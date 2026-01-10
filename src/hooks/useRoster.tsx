import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RosterMember {
  id: string;
  user_id: string;
  team_id: string;
  role: string;
  jersey_number: string | null;
  position: string | null;
  is_active: boolean;
  joined_at: string;
  profile?: {
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
  };
}

export function useRoster(teamId?: string) {
  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoster = async () => {
    if (!teamId) {
      setRoster([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profile:profiles!team_members_user_id_fkey(full_name, phone, avatar_url)
        `)
        .eq('team_id', teamId)
        .eq('is_active', true)
        .order('role', { ascending: true });

      if (error) throw error;
      
      // Transform the data to flatten the profile
      const transformedData = (data || []).map((member: any) => ({
        ...member,
        profile: Array.isArray(member.profile) ? member.profile[0] : member.profile,
      }));
      
      setRoster(transformedData);
    } catch (error) {
      console.error('Error fetching roster:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [teamId]);

  return {
    roster,
    loading,
    refetch: fetchRoster,
  };
}
