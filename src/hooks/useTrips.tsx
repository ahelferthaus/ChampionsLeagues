import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Trip {
  id: string;
  team_id: string;
  name: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  meeting_location: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useTrips(teamId?: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTrips = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('trips')
        .select('*')
        .order('departure_date', { ascending: true });
      
      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setTrips(data as Trip[] || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trips',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert(trip)
        .select()
        .single();
      
      if (error) throw error;
      
      setTrips(prev => [...prev, data as Trip].sort((a, b) => 
        new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
      ));
      
      toast({
        title: 'Success',
        description: 'Trip created successfully',
      });
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating trip:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create trip',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', tripId);
      
      if (error) throw error;
      
      setTrips(prev => prev.map(t => 
        t.id === tripId ? { ...t, ...updates } : t
      ));
      
      toast({
        title: 'Success',
        description: 'Trip updated successfully',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating trip:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update trip',
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user, teamId]);

  return {
    trips,
    loading,
    createTrip,
    updateTrip,
    refetch: fetchTrips,
  };
}
