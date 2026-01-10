import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserTeam {
  id: string;
  name: string;
  age_group: string | null;
  gender: string | null;
  sport: string | null;
  club: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  user_role: 'club_admin' | 'team_manager' | 'parent' | 'player';
}

export function useUserTeams() {
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserTeams = async () => {
    if (!user) {
      setTeams([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch teams where user is a direct member
      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select(`
          role,
          teams (
            id,
            name,
            age_group,
            gender,
            sport,
            club_id,
            clubs (
              id,
              name,
              logo_url
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (memberError) throw memberError;

      // Fetch teams from clubs where user is admin
      const { data: adminClubs, error: adminError } = await supabase
        .from('club_admins')
        .select(`
          club_id,
          clubs (
            id,
            name,
            logo_url,
            teams (
              id,
              name,
              age_group,
              gender,
              sport,
              club_id
            )
          )
        `)
        .eq('user_id', user.id);

      if (adminError) throw adminError;

      // Merge and deduplicate teams
      const teamMap = new Map<string, UserTeam>();

      // Add member teams first (their specific role takes precedence)
      memberTeams?.forEach((mt: any) => {
        if (mt.teams) {
          const team = mt.teams;
          teamMap.set(team.id, {
            id: team.id,
            name: team.name,
            age_group: team.age_group,
            gender: team.gender,
            sport: team.sport,
            club: {
              id: team.clubs.id,
              name: team.clubs.name,
              logo_url: team.clubs.logo_url,
            },
            user_role: mt.role,
          });
        }
      });

      // Add admin teams (only if not already in map)
      adminClubs?.forEach((ac: any) => {
        if (ac.clubs && ac.clubs.teams) {
          ac.clubs.teams.forEach((team: any) => {
            if (!teamMap.has(team.id)) {
              teamMap.set(team.id, {
                id: team.id,
                name: team.name,
                age_group: team.age_group,
                gender: team.gender,
                sport: team.sport,
                club: {
                  id: ac.clubs.id,
                  name: ac.clubs.name,
                  logo_url: ac.clubs.logo_url,
                },
                user_role: 'club_admin',
              });
            }
          });
        }
      });

      // Convert to array and sort by club name, then team name
      const sortedTeams = Array.from(teamMap.values()).sort((a, b) => {
        const clubCompare = a.club.name.localeCompare(b.club.name);
        return clubCompare !== 0 ? clubCompare : a.name.localeCompare(b.name);
      });

      setTeams(sortedTeams);
    } catch (error) {
      console.error('Error fetching user teams:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTeams();
  }, [user?.id]);

  return { teams, loading, refetch: fetchUserTeams };
}
