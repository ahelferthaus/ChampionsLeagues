import { createContext, useContext, useState, ReactNode } from 'react';
import albionLogo from '@/assets/albion-logo.png';

interface TeamInfo {
  name: string;
  clubName: string;
  logoUrl: string;
  playerName: string;
  ageGroup: string;
}

interface TeamContextType {
  team: TeamInfo;
  setTeam: (team: TeamInfo) => void;
}

const defaultTeam: TeamInfo = {
  name: "Albion '09 Boys MLS Next Academy",
  clubName: "Albion SC Boulder County",
  logoUrl: albionLogo,
  playerName: "Tristan Helfert",
  ageGroup: "U15",
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamInfo>(defaultTeam);

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
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
