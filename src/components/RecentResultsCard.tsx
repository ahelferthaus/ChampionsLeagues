import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { recentResults, upcomingMatches } from '@/lib/demo-stats-data';
import { format } from 'date-fns';

export function RecentResultsCard() {
  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case 'W':
        return 'default';
      case 'D':
        return 'secondary';
      case 'L':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
        <CardDescription>Last 5 matches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentResults.map((match, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Badge variant={getResultBadgeVariant(match.result)} className="w-8 justify-center">
                  {match.result}
                </Badge>
                <div>
                  <p className="font-medium">vs. {match.opponent}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(match.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <span className="font-bold text-lg">{match.score}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingMatchesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Matches</CardTitle>
        <CardDescription>Next 3 fixtures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingMatches.map((match, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div>
                <p className="font-medium">vs. {match.opponent}</p>
                <p className="text-sm text-muted-foreground">{match.location}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{format(new Date(match.date), 'MMM d')}</p>
                <p className="text-sm text-muted-foreground">{match.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
