import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips, Trip } from '@/hooks/useTrips';
import { TripsList } from '@/components/TripsList';
import { TripPlanner } from '@/components/TripPlanner';
import { CreateTripDialog } from '@/components/CreateTripDialog';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, ArrowLeft, MapPin, Plane } from 'lucide-react';
import { downloadICS, generateTripICS } from '@/lib/calendar-export';

// Demo team ID for showcase purposes
const DEMO_TEAM_ID = 'demo-team-id';

export default function Trips() {
  const { user, loading: authLoading } = useAuth();
  const { trips, loading, createTrip, refetch } = useTrips();
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showPlanner, setShowPlanner] = useState(false);

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

  const upcomingTrips = trips.filter(t => new Date(t.departure_date) > new Date());
  const pastTrips = trips.filter(t => new Date(t.departure_date) <= new Date());

  const handlePlanTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowPlanner(true);
  };

  const handleExportTrip = (trip: Trip) => {
    const ics = generateTripICS(trip);
    downloadICS(ics, `${trip.name.replace(/\s+/g, '-')}.ics`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Trips & Travel</span>
            </div>
            <div className="flex items-center gap-2">
              <LoadDemoDataButton 
                teamId={DEMO_TEAM_ID} 
                userId={user.id} 
                onComplete={refetch}
              />
              <CreateTripDialog
                teamId={DEMO_TEAM_ID}
                userId={user.id}
                onCreateTrip={createTrip}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="bg-secondary/10 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/20 p-3 rounded-full">
              <MapPin className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Trips</p>
              <p className="text-3xl font-bold">{upcomingTrips.length}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
          <TripsList 
            trips={upcomingTrips} 
            loading={loading}
            onPlanTrip={handlePlanTrip}
            onExportTrip={handleExportTrip}
          />
        </div>

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
            <TripsList 
              trips={pastTrips} 
              loading={loading}
              onExportTrip={handleExportTrip}
            />
          </div>
        )}
      </main>

      {/* Trip Planner Dialog */}
      <Dialog open={showPlanner} onOpenChange={setShowPlanner}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Plan Your Trip
            </DialogTitle>
          </DialogHeader>
          {selectedTrip && <TripPlanner trip={selectedTrip} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
