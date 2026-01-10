import { useTeam } from '@/contexts/TeamContext';

interface TeamHeaderProps {
  title: string;
}

export function TeamHeader({ title }: TeamHeaderProps) {
  const { team } = useTeam();
  
  return (
    <div className="flex items-center gap-3">
      <img 
        src={team.logoUrl} 
        alt={`${team.clubName} logo`}
        className="h-10 w-10 object-contain"
      />
      <div>
        <span className="text-xl font-bold">{title}</span>
        <p className="text-sm text-sidebar-foreground/70">{team.name}</p>
      </div>
    </div>
  );
}
