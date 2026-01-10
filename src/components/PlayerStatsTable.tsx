import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDemoPlayerStats } from '@/lib/demo-stats-data';

export function PlayerStatsTable() {
  const playerStats = generateDemoPlayerStats();

  // Sort by goals descending for top scorers view
  const sortedByGoals = [...playerStats].sort((a, b) => b.goals - a.goals);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Statistics</CardTitle>
        <CardDescription>2025-2026 Season</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead className="text-center">GP</TableHead>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">A</TableHead>
                <TableHead className="text-center">YC</TableHead>
                <TableHead className="text-center">RC</TableHead>
                <TableHead className="text-center">Min</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedByGoals.map((player, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold text-primary">
                    {player.jersey_number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {player.player_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {player.position.substring(0, 3).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-center">{player.games_played}</TableCell>
                  <TableCell className="text-center font-semibold">{player.goals}</TableCell>
                  <TableCell className="text-center">{player.assists}</TableCell>
                  <TableCell className="text-center text-yellow-600">{player.yellow_cards || '-'}</TableCell>
                  <TableCell className="text-center text-destructive">{player.red_cards || '-'}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{player.minutes_played}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
