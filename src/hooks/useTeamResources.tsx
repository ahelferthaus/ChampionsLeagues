import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeamResource {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  resource_type: 'link' | 'google_drive' | 'document' | 'event_link' | 'form';
  url: string;
  icon: string | null;
  category: string | null;
  sort_order: number;
  is_pinned: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useTeamResources(teamId?: string) {
  const [resources, setResources] = useState<TeamResource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    if (!teamId) {
      setResources([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('team_resources')
        .select('*')
        .eq('team_id', teamId)
        .order('is_pinned', { ascending: false })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setResources((data || []) as TeamResource[]);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<TeamResource, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('team_resources')
        .insert({
          ...resource,
          created_by: user.id,
        });

      if (error) throw error;
      await fetchResources();
      return true;
    } catch (error) {
      console.error('Error adding resource:', error);
      return false;
    }
  };

  const updateResource = async (id: string, updates: Partial<TeamResource>) => {
    try {
      const { error } = await supabase
        .from('team_resources')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchResources();
      return true;
    } catch (error) {
      console.error('Error updating resource:', error);
      return false;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchResources();
      return true;
    } catch (error) {
      console.error('Error deleting resource:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchResources();
  }, [teamId]);

  return {
    resources,
    loading,
    addResource,
    updateResource,
    deleteResource,
    refetch: fetchResources,
  };
}
