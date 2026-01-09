import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Trip } from '@/hooks/useTrips';

interface TripsListProps {
  trips: Trip[];
  loading: boolean;
}

export function TripsList({ trips, loading }: TripsListProps) {
  const isUpcoming = (date: string) => new Date(date) > new Date();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No trips scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <Card key={trip.id} className={!isUpcoming(trip.departure_date) ? 'opacity-60' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{trip.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.destination}</span>
                </div>
              </div>
              <Badge variant={isUpcoming(trip.departure_date) ? 'default' : 'secondary'}>
                {isUpcoming(trip.departure_date) ? 'Upcoming' : 'Past'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(trip.departure_date), 'MMM d, yyyy')}
                  {trip.return_date && ` - ${format(new Date(trip.return_date), 'MMM d, yyyy')}`}
                </span>
              </div>
              
              {trip.meeting_location && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Meet at: {trip.meeting_location}</span>
                </div>
              )}
            </div>
            
            {trip.notes && (
              <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                {trip.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
