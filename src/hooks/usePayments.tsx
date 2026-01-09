import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  team_id: string;
  user_id: string;
  amount: number;
  description: string;
  due_date: string | null;
  paid_at: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export function usePayments(teamId?: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPayments = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setPayments(data as Payment[] || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();
      
      if (error) throw error;
      
      setPayments(prev => [data as Payment, ...prev]);
      toast({
        title: 'Success',
        description: 'Payment created successfully',
      });
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create payment',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: Payment['status'], paidAt?: string) => {
    try {
      const updateData: Partial<Payment> = { status };
      if (paidAt) updateData.paid_at = paidAt;
      
      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);
      
      if (error) throw error;
      
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, ...updateData } : p
      ));
      
      toast({
        title: 'Success',
        description: 'Payment updated successfully',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment',
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user, teamId]);

  return {
    payments,
    loading,
    createPayment,
    updatePaymentStatus,
    refetch: fetchPayments,
  };
}
