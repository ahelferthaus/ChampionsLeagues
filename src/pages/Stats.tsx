import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainNavigation } from '@/components/MainNavigation';
import { TeamStatsCard, LeagueStandingsTable } from '@/components/TeamStatsCard';
import { PlayerStatsTable } from '@/components/PlayerStatsTable';
import { RecentResultsCard, UpcomingMatchesCard } from '@/components/RecentResultsCard';
import { VideoLinksCard } from '@/components/VideoLinksCard';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Video, BarChart3 } from 'lucide-react';

export default function Stats() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Stats</h1>
            <p className="text-muted-foreground">
              Season statistics, league standings, and game footage
            </p>
          </div>
          <LoadDemoDataButton userId={user.id} onComplete={() => {}} />
        </div>

        {/* Team Stats Summary */}
        <div className="mb-8">
          <TeamStatsCard />
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="players" className="gap-2">
              <Users className="h-4 w-4" />
              Player Stats
            </TabsTrigger>
            <TabsTrigger value="standings" className="gap-2">
              <Trophy className="h-4 w-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <RecentResultsCard />
              <UpcomingMatchesCard />
            </div>
          </TabsContent>

          <TabsContent value="players">
            <PlayerStatsTable />
          </TabsContent>

          <TabsContent value="standings">
            <LeagueStandingsTable />
          </TabsContent>

          <TabsContent value="videos">
            <VideoLinksCard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
