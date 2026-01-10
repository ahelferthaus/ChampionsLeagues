import { useTeam } from '@/contexts/TeamContext';

interface TeamHeaderProps {
  title?: string;
}

export function TeamHeader({ title }: TeamHeaderProps = {}) {
  const { team } = useTeam();
  
  return (
    <div className="flex items-center gap-4 mb-6">
      <img 
        src={team.logoUrl} 
        alt={`${team.clubName} logo`}
        className="h-16 w-16 object-contain"
      />
      <div>
        {title && <span className="text-xl font-bold">{title}</span>}
        <p className="text-lg font-semibold">{team.clubName}</p>
        <p className="text-sm text-muted-foreground">{team.name}</p>
      </div>
    </div>
  );
}
