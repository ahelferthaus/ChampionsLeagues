import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RosterMember } from '@/hooks/useRoster';

export type TripRosterStatus = 'invited' | 'going' | 'not_going' | 'maybe';

export interface TripRosterEntry {
  id: string;
  trip_id: string;
  team_member_id: string;
  status: TripRosterStatus;
  notes: string | null;
}

export interface TripRosterMember extends RosterMember {
  rosterEntry: TripRosterEntry | null;
}

export function useTripRoster(tripId?: string, teamId?: string) {
  const [entries, setEntries] = useState<TripRosterEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip_roster')
        .select('*')
        .eq('trip_id', tripId);
      if (error) throw error;
      setEntries((data ?? []) as TripRosterEntry[]);
    } catch (err) {
      console.error('Error fetching trip roster:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const upsertStatus = async (teamMemberId: string, status: TripRosterStatus) => {
    if (!tripId) return;
    try {
      const existing = entries.find(e => e.team_member_id === teamMemberId);
      if (existing) {
        const { error } = await supabase
          .from('trip_roster')
          .update({ status })
          .eq('id', existing.id);
        if (error) throw error;
        setEntries(prev =>
          prev.map(e => e.id === existing.id ? { ...e, status } : e)
        );
      } else {
        const { data, error } = await supabase
          .from('trip_roster')
          .insert({ trip_id: tripId, team_member_id: teamMemberId, status })
          .select()
          .single();
        if (error) throw error;
        setEntries(prev => [...prev, data as TripRosterEntry]);
      }
    } catch (err) {
      console.error('Error updating trip roster:', err);
      toast({ title: 'Error saving roster', variant: 'destructive' });
    }
  };

  const addAllMembers = async (memberIds: string[]) => {
    if (!tripId || memberIds.length === 0) return;
    try {
      const existingIds = new Set(entries.map(e => e.team_member_id));
      const newIds = memberIds.filter(id => !existingIds.has(id));
      if (newIds.length === 0) return;
      const rows = newIds.map(id => ({ trip_id: tripId, team_member_id: id, status: 'invited' as TripRosterStatus }));
      const { data, error } = await supabase.from('trip_roster').insert(rows).select();
      if (error) throw error;
      setEntries(prev => [...prev, ...((data ?? []) as TripRosterEntry[])]);
      toast({ title: `${newIds.length} member(s) invited to trip` });
    } catch (err) {
      console.error('Error adding members:', err);
      toast({ title: 'Error inviting members', variant: 'destructive' });
    }
  };

  const removeEntry = async (teamMemberId: string) => {
    if (!tripId) return;
    try {
      const existing = entries.find(e => e.team_member_id === teamMemberId);
      if (!existing) return;
      const { error } = await supabase.from('trip_roster').delete().eq('id', existing.id);
      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== existing.id));
    } catch (err) {
      console.error('Error removing from trip roster:', err);
      toast({ title: 'Error removing member', variant: 'destructive' });
    }
  };

  return { entries, loading, upsertStatus, addAllMembers, removeEntry, refetch: fetchEntries };
}
