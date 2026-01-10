import { 
  Trophy,
  Waves,
  Music,
  Crown,
  Target,
  Dumbbell,
  Bike,
  Snowflake,
  Mountain,
  Volleyball,
  Flame
} from 'lucide-react';

export const SPORTS_LIST = [
  { value: 'soccer', label: 'Soccer', icon: '⚽', color: 'bg-green-500' },
  { value: 'basketball', label: 'Basketball', icon: '🏀', color: 'bg-orange-500' },
  { value: 'baseball', label: 'Baseball', icon: '⚾', color: 'bg-red-500' },
  { value: 'softball', label: 'Softball', icon: '🥎', color: 'bg-yellow-500' },
  { value: 'football', label: 'Football', icon: '🏈', color: 'bg-amber-700' },
  { value: 'volleyball', label: 'Volleyball', icon: '🏐', color: 'bg-blue-400' },
  { value: 'tennis', label: 'Tennis', icon: '🎾', color: 'bg-lime-500' },
  { value: 'swimming', label: 'Swimming', icon: '🏊', color: 'bg-cyan-500' },
  { value: 'water_polo', label: 'Water Polo', icon: '🤽', color: 'bg-blue-600' },
  { value: 'hockey', label: 'Ice Hockey', icon: '🏒', color: 'bg-slate-500' },
  { value: 'field_hockey', label: 'Field Hockey', icon: '🏑', color: 'bg-emerald-600' },
  { value: 'lacrosse', label: 'Lacrosse', icon: '🥍', color: 'bg-purple-500' },
  { value: 'golf', label: 'Golf', icon: '⛳', color: 'bg-green-600' },
  { value: 'wrestling', label: 'Wrestling', icon: '🤼', color: 'bg-red-600' },
  { value: 'gymnastics', label: 'Gymnastics', icon: '🤸', color: 'bg-pink-500' },
  { value: 'dance', label: 'Dance', icon: '💃', color: 'bg-fuchsia-500' },
  { value: 'cheer', label: 'Cheerleading', icon: '📣', color: 'bg-rose-500' },
  { value: 'track', label: 'Track & Field', icon: '🏃', color: 'bg-indigo-500' },
  { value: 'cross_country', label: 'Cross Country', icon: '🏃', color: 'bg-amber-600' },
  { value: 'cycling', label: 'Cycling', icon: '🚴', color: 'bg-sky-500' },
  { value: 'skiing', label: 'Skiing', icon: '⛷️', color: 'bg-blue-300' },
  { value: 'snowboarding', label: 'Snowboarding', icon: '🏂', color: 'bg-violet-500' },
  { value: 'figure_skating', label: 'Figure Skating', icon: '⛸️', color: 'bg-teal-400' },
  { value: 'martial_arts', label: 'Martial Arts', icon: '🥋', color: 'bg-black' },
  { value: 'boxing', label: 'Boxing', icon: '🥊', color: 'bg-red-700' },
  { value: 'fencing', label: 'Fencing', icon: '🤺', color: 'bg-gray-500' },
  { value: 'rowing', label: 'Rowing', icon: '🚣', color: 'bg-blue-700' },
  { value: 'sailing', label: 'Sailing', icon: '⛵', color: 'bg-sky-600' },
  { value: 'archery', label: 'Archery', icon: '🏹', color: 'bg-amber-500' },
  { value: 'chess', label: 'Chess', icon: '♟️', color: 'bg-stone-600' },
  { value: 'esports', label: 'Esports', icon: '🎮', color: 'bg-purple-600' },
  { value: 'badminton', label: 'Badminton', icon: '🏸', color: 'bg-lime-400' },
  { value: 'table_tennis', label: 'Table Tennis', icon: '🏓', color: 'bg-red-400' },
  { value: 'rugby', label: 'Rugby', icon: '🏉', color: 'bg-green-700' },
  { value: 'cricket', label: 'Cricket', icon: '🏏', color: 'bg-amber-400' },
  { value: 'climbing', label: 'Climbing', icon: '🧗', color: 'bg-stone-500' },
  { value: 'equestrian', label: 'Equestrian', icon: '🏇', color: 'bg-amber-800' },
  { value: 'other', label: 'Other Sport', icon: '🏆', color: 'bg-primary' },
] as const;

export type SportValue = typeof SPORTS_LIST[number]['value'];

export function getSportInfo(sportValue: string | null | undefined) {
  return SPORTS_LIST.find(s => s.value === sportValue) || SPORTS_LIST[SPORTS_LIST.length - 1];
}

interface SportIconProps {
  sport: string | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export function SportIcon({ sport, size = 'md', showLabel = false, className = '' }: SportIconProps) {
  const sportInfo = getSportInfo(sport);
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={sizeClasses[size]} role="img" aria-label={sportInfo.label}>
        {sportInfo.icon}
      </span>
      {showLabel && <span className="font-medium">{sportInfo.label}</span>}
    </div>
  );
}

interface SportBadgeProps {
  sport: string | null | undefined;
  className?: string;
}

export function SportBadge({ sport, className = '' }: SportBadgeProps) {
  const sportInfo = getSportInfo(sport);
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-sm font-medium ${sportInfo.color} ${className}`}>
      <span role="img" aria-label={sportInfo.label}>{sportInfo.icon}</span>
      <span>{sportInfo.label}</span>
    </div>
  );
}
