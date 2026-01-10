import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Shield, TrendingUp } from 'lucide-react';
import { generateDemoTeamStats, leagueStandings } from '@/lib/demo-stats-data';

interface TeamStatsCardProps {
  teamId?: string;
}

export function TeamStatsCard({ teamId }: TeamStatsCardProps) {
  const stats = generateDemoTeamStats(teamId || '');
  const winRate = Math.round((stats.wins / (stats.wins + stats.losses + stats.ties)) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Season Record</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.wins}-{stats.losses}-{stats.ties}
          </div>
          <p className="text-xs text-muted-foreground">
            {winRate}% win rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Goals For</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.goals_for}</div>
          <p className="text-xs text-muted-foreground">
            {(stats.goals_for / (stats.wins + stats.losses + stats.ties)).toFixed(1)} per game
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Goals Against</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.goals_against}</div>
          <p className="text-xs text-muted-foreground">
            {(stats.goals_against / (stats.wins + stats.losses + stats.ties)).toFixed(1)} per game
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">League Rank</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{stats.league_rank}</div>
          <p className="text-xs text-muted-foreground">
            {stats.league_name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function LeagueStandingsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>League Standings</CardTitle>
        <CardDescription>North Texas Premier League - U15 Boys Elite</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left text-sm font-medium">Rank</th>
                <th className="p-2 text-left text-sm font-medium">Team</th>
                <th className="p-2 text-center text-sm font-medium">P</th>
                <th className="p-2 text-center text-sm font-medium">Pts</th>
                <th className="p-2 text-center text-sm font-medium">GD</th>
              </tr>
            </thead>
            <tbody>
              {leagueStandings.map((team) => (
                <tr 
                  key={team.rank} 
                  className={`border-b ${team.team === 'Albion SC 2011' ? 'bg-primary/10' : ''}`}
                >
                  <td className="p-2 text-sm font-medium">{team.rank}</td>
                  <td className="p-2 text-sm">
                    {team.team === 'Albion SC 2011' ? (
                      <span className="font-semibold text-primary">{team.team}</span>
                    ) : (
                      team.team
                    )}
                  </td>
                  <td className="p-2 text-center text-sm text-muted-foreground">{team.played}</td>
                  <td className="p-2 text-center text-sm font-medium">{team.points}</td>
                  <td className="p-2 text-center text-sm text-muted-foreground">{team.gd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
