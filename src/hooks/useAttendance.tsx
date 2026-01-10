import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceRecord {
  id: string;
  event_id: string;
  team_member_id: string | null;
  child_member_id: string | null;
  status: 'present' | 'absent' | 'excused' | 'late' | 'pending';
  notes: string | null;
  marked_by: string | null;
  marked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithEvent extends AttendanceRecord {
  event?: {
    title: string;
    start_time: string;
    location: string | null;
    event_type: string;
  };
}

export function useAttendance(eventId?: string, teamId?: string) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    if (!eventId && !teamId) {
      setAttendance([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('event_attendance')
        .select('*');

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAttendance((data || []) as AttendanceRecord[]);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (
    eventId: string,
    memberId: string,
    memberType: 'team_member' | 'child',
    status: AttendanceRecord['status'],
    notes?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const record = {
        event_id: eventId,
        team_member_id: memberType === 'team_member' ? memberId : null,
        child_member_id: memberType === 'child' ? memberId : null,
        status,
        notes: notes || null,
        marked_by: user.id,
        marked_at: new Date().toISOString(),
      };

      // Check if record exists
      const { data: existing } = await supabase
        .from('event_attendance')
        .select('id')
        .eq('event_id', eventId)
        .eq(memberType === 'team_member' ? 'team_member_id' : 'child_member_id', memberId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('event_attendance')
          .update({ status, notes: notes || null, marked_by: user.id, marked_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_attendance')
          .insert(record);
        if (error) throw error;
      }

      await fetchAttendance();
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [eventId, teamId]);

  return {
    attendance,
    loading,
    markAttendance,
    refetch: fetchAttendance,
  };
}
