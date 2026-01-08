import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trophy, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Camera,
  ChevronRight,
  Check
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Financial Management',
    description: 'Track expenses, request payments from parents, and keep your team finances organized all in one place.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: MapPin,
    title: 'Trip Planning',
    description: 'Coordinate travel logistics, manage RSVPs, organize carpools, and plan team activities during tournaments.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Calendar,
    title: 'Team Scheduling',
    description: 'Manage practices, games, and tournaments. Send reminders and track attendance with ease.',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  {
    icon: Users,
    title: 'Team Organization',
    description: 'Build your club hierarchy from leagues to teams. Manage rosters, roles, and communication.',
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
  },
  {
    icon: Camera,
    title: 'Photo Gallery',
    description: 'Store and share game photos, team memories, and highlight moments with your entire team.',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
];

const benefits = [
  'Easy payment collection from parents',
  'Real-time expense tracking',
  'Tournament trip coordination',
  'Team calendar with reminders',
  'Mobile-friendly design',
  'Secure and private',
];

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Champions</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-sidebar text-sidebar-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Trophy className="h-4 w-4" />
            Built for youth sports teams
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Manage Your Team
            <span className="block text-primary">Like a Pro</span>
          </h1>
          
          <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl mx-auto mb-8">
            The all-in-one platform for youth sports team management. Handle finances, plan trips, coordinate schedules, and keep your team connected.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Start Free Today
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Run Your Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From collecting payments to coordinating tournament travel, Champions handles it all so you can focus on the game.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built by Parents, For Parents
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We know the chaos of managing team finances, coordinating travel, and keeping everyone informed. Champions was built to make your life easier.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8">
                <div className="bg-card rounded-xl shadow-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">U14 Lightning</p>
                      <p className="text-sm text-muted-foreground">Fall Season 2026</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Collected</p>
                      <p className="text-xl font-bold text-primary">$4,250</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-xl font-bold text-secondary">$750</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Next Event</p>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Phoenix Cup Tournament - Jan 15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-sidebar text-sidebar-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Team Management?
          </h2>
          <p className="text-lg text-sidebar-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using Champions to streamline their operations.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              Get Started Free
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="font-bold">Champions</span>
          </div>
          <p className="text-sm text-sidebar-foreground/60">
            © 2026 Champions. Built for teams that play to win.
          </p>
        </div>
      </footer>
    </div>
  );
}
