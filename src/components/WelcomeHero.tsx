import { useTeam } from '@/contexts/TeamContext';
import { SportIcon, getSportInfo } from '@/components/SportIcons';
import { useAuth } from '@/hooks/useAuth';

interface WelcomeHeroProps {
  userName?: string;
  sport?: string | null;
}

export function WelcomeHero({ userName, sport }: WelcomeHeroProps) {
  const { team } = useTeam();
  const sportInfo = getSportInfo(sport);
  
  // Get a motivational message based on sport
  const getMotivationalMessage = () => {
    const messages: Record<string, string> = {
      soccer: "Ready to score some goals!",
      basketball: "Time to hit the court!",
      swimming: "Make a splash today!",
      water_polo: "Dive into action!",
      dance: "Let's move and groove!",
      chess: "Strategize for victory!",
      hockey: "Hit the ice!",
      tennis: "Ace your day!",
      volleyball: "Spike it up!",
      gymnastics: "Flip into success!",
      martial_arts: "Train hard, fight easy!",
      default: "Here's what's happening with your teams today."
    };
    return messages[sport || ''] || messages.default;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 mb-8">
      <div className="flex items-center justify-between p-6 md:p-8">
        {/* Left side - Welcome text */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {userName || 'there'}!
          </h1>
          <p className="text-muted-foreground max-w-md">
            {getMotivationalMessage()}
          </p>
          {sport && (
            <div className="pt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-medium ${sportInfo.color}`}>
                <span role="img" aria-label={sportInfo.label}>{sportInfo.icon}</span>
                <span>{sportInfo.label}</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Right side - Sport visual */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="relative">
            {/* Background glow */}
            <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full ${sportInfo.color}`} />
            
            {/* Large sport emoji with animation */}
            <div className="relative animate-bounce-slow">
              <span 
                className="text-7xl md:text-8xl lg:text-9xl drop-shadow-lg"
                role="img" 
                aria-label={sportInfo.label}
              >
                {sportInfo.icon}
              </span>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 text-2xl opacity-60 animate-pulse">✨</div>
            <div className="absolute -bottom-1 -left-1 text-xl opacity-40">🌟</div>
          </div>
        </div>
      </div>
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-secondary rounded-full blur-2xl" />
      </div>
    </div>
  );
}
