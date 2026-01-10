import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VideoClipAdvice {
  advice: string;
  citations: string[];
  sport: string;
  position: string;
  level: string;
}

export function useRecruiting() {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<VideoClipAdvice | null>(null);

  const getVideoClipAdvice = async (
    sport: string,
    position: string,
    level: string,
    highlights?: string
  ): Promise<VideoClipAdvice | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('video-clip-advisor', {
        body: { sport, position, level, highlights },
      });

      if (error) {
        console.error('Error getting video clip advice:', error);
        toast({
          title: "Error",
          description: "Failed to get video clip advice. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      setAdvice(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startPayment = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.functions.invoke('create-recruiting-payment');

      if (error) {
        console.error('Error creating payment session:', error);
        toast({
          title: "Payment Error",
          description: "Failed to start payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    advice,
    getVideoClipAdvice,
    startPayment,
    clearAdvice: () => setAdvice(null),
  };
}
