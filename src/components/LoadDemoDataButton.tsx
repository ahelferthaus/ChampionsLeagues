import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateDemoEvents, generateDemoTrips, generateDemoPayments } from '@/lib/demo-data';
import { Sparkles } from 'lucide-react';

interface LoadDemoDataButtonProps {
  teamId: string;
  userId: string;
  onComplete?: () => void;
}

export function LoadDemoDataButton({ teamId, userId, onComplete }: LoadDemoDataButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadDemoData = async () => {
    setLoading(true);

    try {
      // Load demo events
      const demoEvents = generateDemoEvents(teamId, userId);
      const { error: eventsError } = await supabase
        .from('events')
        .insert(demoEvents);
      
      if (eventsError) {
        console.error('Events error:', eventsError);
      }

      // Load demo trips
      const demoTrips = generateDemoTrips(teamId, userId);
      const { error: tripsError } = await supabase
        .from('trips')
        .insert(demoTrips);
      
      if (tripsError) {
        console.error('Trips error:', tripsError);
      }

      // Load demo payments
      const demoPayments = generateDemoPayments(teamId, userId);
      const { error: paymentsError } = await supabase
        .from('payments')
        .insert(demoPayments);
      
      if (paymentsError) {
        console.error('Payments error:', paymentsError);
      }

      toast({
        title: 'Demo Data Loaded!',
        description: 'Sample events, trips, and payments have been added.',
      });

      onComplete?.();
    } catch (error: any) {
      console.error('Error loading demo data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load demo data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLoadDemoData}
      disabled={loading}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {loading ? 'Loading...' : 'Load Demo Data'}
    </Button>
  );
}
