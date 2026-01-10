import { useClubStatistics } from '@/hooks/useClubStatistics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  DollarSign, 
  MapPin,
  TrendingUp,
  Wallet,
  UserCheck
} from 'lucide-react';

export function ClubExecutiveDashboard() {
  const { stats, loading } = useClubStatistics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalClubs === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Club Executive Overview</h2>
        <Badge variant="secondary" className="ml-2">
          {stats.totalClubs} {stats.totalClubs === 1 ? 'Club' : 'Clubs'}
        </Badge>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Teams</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalTeams}</div>
            <p className="text-xs text-muted-foreground">Across all clubs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Players</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total paid</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            <Wallet className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${stats.pendingRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trips Summary */}
      {stats.upcomingTrips > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <span className="text-2xl font-bold text-foreground mr-2">{stats.upcomingTrips}</span>
              trips scheduled across all teams
            </p>
          </CardContent>
        </Card>
      )}

      {/* Per-Club Breakdown */}
      {stats.clubs.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Club Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.clubs.map((club) => (
              <Card key={club.clubId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    {club.clubName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Teams:</span>
                      <span className="font-medium">{club.totalTeams}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Players:</span>
                      <span className="font-medium">{club.totalPlayers + club.totalChildPlayers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Collected:</span>
                      <span className="font-medium text-accent-foreground">${club.collectedPayments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium text-destructive">${club.pendingPayments.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
