import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import albionLogo from '@/assets/albion-logo.png';
import { useUserTeams, UserTeam } from '@/hooks/useUserTeams';
import { useAuth } from '@/hooks/useAuth';

interface TeamInfo {
  id: string;
  name: string;
  clubName: string;
  clubId: string;
  logoUrl: string;
  ageGroup: string | null;
  sport: string | null;
}

interface TeamContextType {
  team: TeamInfo | null;
  teams: UserTeam[];
  setTeam: (teamId: string) => void;
  loading: boolean;
  refetchTeams: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { teams, loading: teamsLoading, refetch } = useUserTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [team, setTeamState] = useState<TeamInfo | null>(null);

  // Load selected team from localStorage on mount
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`selectedTeam_${user.id}`);
    if (saved) {
      setSelectedTeamId(saved);
    }
  }, [user]);

  // Auto-select first team if none selected and teams are available
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Handle deleted team - if selected team no longer exists, select first available
  useEffect(() => {
    if (selectedTeamId && teams.length > 0 && !teams.find(t => t.id === selectedTeamId)) {
      setSelectedTeamId(teams[0].id);
      if (user) {
        localStorage.removeItem(`selectedTeam_${user.id}`);
      }
    }
  }, [teams, selectedTeamId, user]);

  // Update team state when selection changes
  useEffect(() => {
    if (!selectedTeamId) {
      setTeamState(null);
      return;
    }

    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (selectedTeam) {
      setTeamState({
        id: selectedTeam.id,
        name: selectedTeam.name,
        clubName: selectedTeam.club.name,
        clubId: selectedTeam.club.id,
        logoUrl: selectedTeam.club.logo_url || albionLogo,
        ageGroup: selectedTeam.age_group,
        sport: selectedTeam.sport,
      });
    }
  }, [selectedTeamId, teams]);

  const setTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    if (user) {
      localStorage.setItem(`selectedTeam_${user.id}`, teamId);
    }
  };

  return (
    <TeamContext.Provider
      value={{
        team,
        teams,
        setTeam,
        loading: teamsLoading,
        refetchTeams: refetch
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
