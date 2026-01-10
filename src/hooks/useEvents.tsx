import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  event_type: string;
  location: string | null;
  start_time: string;
  end_time: string | null;
  opponent: string | null;
  is_home_game: boolean | null;
  external_id: string | null;
  external_source: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventInput {
  team_id: string;
  title: string;
  description?: string;
  event_type: string;
  location?: string;
  start_time: string;
  end_time?: string;
  opponent?: string;
  is_home_game?: boolean;
  external_id?: string;
  external_source?: string;
  created_by: string;
}

export function useEvents(teamId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setEvents(data as Event[] || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: CreateEventInput) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      
      if (error) throw error;
      
      setEvents(prev => [...prev, data as Event].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
      
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const importEvents = async (events: CreateEventInput[]) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(events)
        .select();
      
      if (error) throw error;
      
      setEvents(prev => [...prev, ...(data as Event[])].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
      
      toast({
        title: 'Success',
        description: `${events.length} events imported successfully`,
      });
      return { data, error: null };
    } catch (error: any) {
      console.error('Error importing events:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to import events',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      setEvents(prev => prev.filter(e => e.id !== eventId));
      
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete event',
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user, teamId]);

  return {
    events,
    loading,
    createEvent,
    importEvents,
    deleteEvent,
    refetch: fetchEvents,
  };
}
