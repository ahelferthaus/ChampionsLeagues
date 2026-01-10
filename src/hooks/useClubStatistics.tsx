import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ClubStatistics {
  clubId: string;
  clubName: string;
  totalTeams: number;
  totalPlayers: number;
  totalChildPlayers: number;
  totalPayments: number;
  pendingPayments: number;
  collectedPayments: number;
  upcomingTrips: number;
}

export interface AggregatedStats {
  totalClubs: number;
  totalTeams: number;
  totalPlayers: number;
  totalRevenue: number;
  pendingRevenue: number;
  upcomingTrips: number;
  clubs: ClubStatistics[];
}

export function useClubStatistics() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStatistics = async () => {
    if (!user) return;

    try {
      // Get clubs where user is admin
      const { data: adminClubs, error: clubsError } = await supabase
        .from('club_admins')
        .select('club_id, clubs(id, name)')
        .eq('user_id', user.id);

      if (clubsError) throw clubsError;

      if (!adminClubs || adminClubs.length === 0) {
        setStats({
          totalClubs: 0,
          totalTeams: 0,
          totalPlayers: 0,
          totalRevenue: 0,
          pendingRevenue: 0,
          upcomingTrips: 0,
          clubs: [],
        });
        setLoading(false);
        return;
      }

      const clubIds = adminClubs.map(ac => ac.club_id);
      const clubsData: ClubStatistics[] = [];

      for (const adminClub of adminClubs) {
        const clubId = adminClub.club_id;
        const clubName = (adminClub.clubs as any)?.name || 'Unknown Club';

        // Get teams for this club
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('id')
          .eq('club_id', clubId);

        if (teamsError) throw teamsError;

        const teamIds = teams?.map(t => t.id) || [];
        const totalTeams = teamIds.length;

        let totalPlayers = 0;
        let totalChildPlayers = 0;
        let totalPayments = 0;
        let pendingPayments = 0;
        let collectedPayments = 0;
        let upcomingTrips = 0;

        if (teamIds.length > 0) {
          // Get adult team members
          const { data: members, error: membersError } = await supabase
            .from('team_members')
            .select('id')
            .in('team_id', teamIds)
            .eq('is_active', true);

          if (membersError) throw membersError;
          totalPlayers = members?.length || 0;

          // Get child team members
          const { data: childMembers, error: childMembersError } = await supabase
            .from('team_child_members')
            .select('id')
            .in('team_id', teamIds)
            .eq('is_active', true);

          if (childMembersError) throw childMembersError;
          totalChildPlayers = childMembers?.length || 0;

          // Get payments
          const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('amount, status')
            .in('team_id', teamIds);

          if (paymentsError) throw paymentsError;

          payments?.forEach(p => {
            totalPayments += p.amount;
            if (p.status === 'pending') {
              pendingPayments += p.amount;
            } else if (p.status === 'paid') {
              collectedPayments += p.amount;
            }
          });

          // Get upcoming trips
          const today = new Date().toISOString().split('T')[0];
          const { data: trips, error: tripsError } = await supabase
            .from('trips')
            .select('id')
            .in('team_id', teamIds)
            .gte('departure_date', today);

          if (tripsError) throw tripsError;
          upcomingTrips = trips?.length || 0;
        }

        clubsData.push({
          clubId,
          clubName,
          totalTeams,
          totalPlayers,
          totalChildPlayers,
          totalPayments,
          pendingPayments,
          collectedPayments,
          upcomingTrips,
        });
      }

      // Aggregate stats
      const aggregated: AggregatedStats = {
        totalClubs: clubsData.length,
        totalTeams: clubsData.reduce((sum, c) => sum + c.totalTeams, 0),
        totalPlayers: clubsData.reduce((sum, c) => sum + c.totalPlayers + c.totalChildPlayers, 0),
        totalRevenue: clubsData.reduce((sum, c) => sum + c.collectedPayments, 0),
        pendingRevenue: clubsData.reduce((sum, c) => sum + c.pendingPayments, 0),
        upcomingTrips: clubsData.reduce((sum, c) => sum + c.upcomingTrips, 0),
        clubs: clubsData,
      };

      setStats(aggregated);
    } catch (error) {
      console.error('Error fetching club statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [user]);

  return { stats, loading, refetch: fetchStatistics };
}
