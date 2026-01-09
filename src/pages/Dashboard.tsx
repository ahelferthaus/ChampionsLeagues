import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trophy, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Plus,
  LogOut,
  Building2,
  UserCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user, profile, roles, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = roles.includes('club_admin');
  const isManager = roles.includes('team_manager');
  const isParent = roles.includes('parent');
  const isPlayer = roles.includes('player');

  const getRoleLabel = () => {
    if (isAdmin) return 'Club Administrator';
    if (isManager) return 'Team Manager';
    if (isParent) return 'Parent';
    if (isPlayer) return 'Player';
    return 'Member';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Champions</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{profile?.full_name || user.email}</p>
                <p className="text-sm text-sidebar-foreground/70">{getRoleLabel()}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your teams today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(isAdmin || isManager) && (
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 border-primary/30 hover:bg-primary/5"
              onClick={() => navigate('/clubs/create')}
            >
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Create Club</span>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 border-primary/30 hover:bg-primary/5"
            >
              <Plus className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Add Team</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 border-primary/30 hover:bg-primary/5"
          >
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">View Schedule</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 border-secondary/30 hover:bg-secondary/5"
            onClick={() => navigate('/payments')}
          >
            <DollarSign className="h-6 w-6 text-secondary" />
            <span className="text-sm font-medium">Payments</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 border-primary/30 hover:bg-primary/5"
            onClick={() => navigate('/trips')}
          >
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Trips</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No teams yet</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No upcoming events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isAdmin || isManager ? 'Pending Payments' : 'Amount Due'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">All caught up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Empty State - Getting Started */}
        <Card className="border-dashed border-2 border-border">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Get Started with Champions</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              {isAdmin || isManager 
                ? "Create your first club to start managing teams, schedules, and finances."
                : "You haven't been added to any teams yet. Ask your team manager for an invitation."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            {(isAdmin || isManager) && (
              <Button onClick={() => navigate('/clubs/create')}>
                <Building2 className="h-4 w-4 mr-2" />
                Create Your First Club
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
