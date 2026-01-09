import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { TripsList } from '@/components/TripsList';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft, MapPin } from 'lucide-react';

export default function Trips() {
  const { user, loading: authLoading } = useAuth();
  const { trips, loading } = useTrips();
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

  const upcomingTrips = trips.filter(t => new Date(t.departure_date) > new Date());
  const pastTrips = trips.filter(t => new Date(t.departure_date) <= new Date());

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Trips & Travel</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="bg-secondary/10 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/20 p-3 rounded-full">
              <MapPin className="h-8 w-8 text-secondary" />
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
          />
        </div>

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
            <TripsList 
              trips={pastTrips} 
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
