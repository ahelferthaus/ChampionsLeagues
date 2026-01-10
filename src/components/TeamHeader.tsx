import { useTeam } from '@/contexts/TeamContext';

interface TeamHeaderProps {
  title?: string;
}

export function TeamHeader({ title }: TeamHeaderProps = {}) {
  const { team } = useTeam();
  
  return (
    <div className="flex items-center gap-4 mb-4 mt-2 pt-2">
      <img 
        src={team.logoUrl} 
        alt={`${team.clubName} logo`}
        className="h-14 w-14 object-contain rounded-lg shadow-sm"
      />
      <div>
        {title && <span className="text-xl font-bold">{title}</span>}
        <p className="text-lg font-semibold text-foreground">{team.clubName}</p>
        <p className="text-sm text-muted-foreground">{team.name}</p>
      </div>
    </div>
  );
}
