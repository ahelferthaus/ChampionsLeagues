import { useLocation, useNavigate } from 'react-router-dom';
import { useTeam } from '@/contexts/TeamContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  LogOut,
  UserCircle,
  Check,
  ChevronDown,
  Plus,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  const { team, teams, setTeam } = useTeam();
  const { signOut } = useAuth();

  const handleTeamChange = (value: string) => {
    if (value === '__create_team__') {
      navigate('/teams/create');
    } else {
      setTeam(value);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 py-3">
          {/* Team Switcher */}
          <div className="flex items-center gap-3 min-w-[240px]">
            {team ? (
              <Select value={team.id} onValueChange={handleTeamChange}>
                <SelectTrigger className="w-[220px] bg-sidebar-accent/50 border-sidebar-border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <img 
                        src={team.logoUrl} 
                        alt={team.clubName}
                        className="h-6 w-6 object-contain"
                      />
                      <div className="flex flex-col items-start text-left">
                        <span className="text-xs font-medium">{team.clubName}</span>
                        <span className="text-xs text-muted-foreground">{team.name}</span>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2 py-1">
                        <img 
                          src={t.club.logo_url || team.logoUrl} 
                          alt={t.club.name}
                          className="h-6 w-6 object-contain"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{t.club.name}</span>
                          <span className="text-xs text-muted-foreground">{t.name}</span>
                        </div>
                        {team.id === t.id && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="__create_team__" className="text-primary border-t">
                    <div className="flex items-center gap-2 py-1">
                      <Plus className="h-4 w-4" />
                      <span>Create New Team</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground">No team selected</div>
            )}
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

          {/* Profile & Sign Out */}
          <div className="flex items-center gap-1">
            <Button 
              variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
              size="sm" 
              onClick={() => navigate('/profile')}
              className={`gap-2 ${
                location.pathname === '/profile'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
              }`}
            >
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </Button>
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
