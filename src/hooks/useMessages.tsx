import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  team_id: string;
  sender_id: string;
  subject: string;
  body: string;
  is_group_message: boolean;
  created_at: string;
  sender_name?: string;
}

export function useMessages(teamId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!teamId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [teamId]);

  const sendMessage = async (
    teamId: string,
    senderId: string,
    subject: string,
    body: string,
    isGroupMessage: boolean = true
  ) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          team_id: teamId,
          sender_id: senderId,
          subject,
          body,
          is_group_message: isGroupMessage,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [data, ...prev]);
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the team.',
      });

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
  };
}
