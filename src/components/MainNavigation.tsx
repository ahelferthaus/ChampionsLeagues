import { useLocation, useNavigate } from 'react-router-dom';
import { useTeam } from '@/contexts/TeamContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Plane, 
  DollarSign, 
  Users, 
  TrendingUp,
  FolderOpen,
  ClipboardCheck,
  GraduationCap,
  Receipt,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileSettingsDialog } from '@/components/ProfileSettingsDialog';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/roster', label: 'Roster', icon: Users },
  { path: '/trips', label: 'Trips', icon: Plane },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/payments', label: 'Payments', icon: DollarSign },
  { path: '/stats', label: 'Stats', icon: TrendingUp },
  { path: '/resources', label: 'Resources', icon: FolderOpen },
  { path: '/recruiting', label: 'Recruiting', icon: GraduationCap },
];

export function MainNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { team } = useTeam();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Team Name */}
          <div className="flex items-center gap-3">
            <img 
              src={team.logoUrl} 
              alt={`${team.clubName} logo`}
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{team.clubName}</p>
              <p className="text-xs text-sidebar-foreground/70">{team.name}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`gap-2 ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Settings & Sign Out */}
          <div className="flex items-center gap-1">
            <ProfileSettingsDialog />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
