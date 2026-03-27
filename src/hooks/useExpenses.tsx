import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  team_id: string;
  club_id: string | null;
  created_by: string;
  title: string;
  description: string | null;
  category: string;
  total_amount: number;
  receipt_url: string | null;
  expense_date: string;
  due_date: string | null;
  status: string;
  split_type: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseShare {
  id: string;
  expense_id: string;
  user_id: string;
  child_id: string | null;
  amount: number;
  status: string;
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  expense?: Expense;
  profile?: { full_name: string; venmo_handle: string | null };
}

export interface ConnectAccountStatus {
  hasAccount: boolean;
  accountId?: string;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export function useExpenses(teamId?: string) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [myShares, setMyShares] = useState<ExpenseShare[]>([]);
  const [allShares, setAllShares] = useState<ExpenseShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectStatus, setConnectStatus] = useState<ConnectAccountStatus | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch expenses for the team
      let expenseQuery = supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamId) {
        expenseQuery = expenseQuery.eq('team_id', teamId);
      }

      // 2. Fetch my shares with expense details
      const mySharesQuery = supabase
        .from('expense_shares')
        .select('*, expense:expenses(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // 3. Check connect status
      const connectQuery = supabase.functions.invoke('check-connect-status');

      const [expensesResult, mySharesResult, connectResult] = await Promise.all([
        expenseQuery,
        mySharesQuery,
        connectQuery,
      ]);

      // Process expenses
      const expensesData = (expensesResult.data || []).map((e: any) => ({
        ...e,
        total_amount: Number(e.total_amount),
      }));
      setExpenses(expensesData);

      // Process my shares
      setMyShares(
        (mySharesResult.data || []).map((s: any) => ({
          ...s,
          amount: Number(s.amount),
          expense: s.expense
            ? { ...s.expense, total_amount: Number(s.expense.total_amount) }
            : undefined,
        }))
      );

      // Process connect status
      if (!connectResult.error) {
        setConnectStatus(connectResult.data);
      }

      // 4. Fetch ALL shares for manager view (for all team expenses)
      if (expensesData.length > 0) {
        const expenseIds = expensesData.map((e: Expense) => e.id);

        const { data: allSharesRaw } = await supabase
          .from('expense_shares')
          .select('*, expense:expenses(*)')
          .in('expense_id', expenseIds)
          .order('created_at', { ascending: false });

        if (allSharesRaw && allSharesRaw.length > 0) {
          // Fetch profile names for the unique user_ids
          const userIds = [...new Set(allSharesRaw.map((s: any) => s.user_id as string))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, full_name, venmo_handle')
            .in('user_id', userIds);

          const profileMap = new Map(
            (profilesData || []).map((p: any) => [p.user_id, p])
          );

          setAllShares(
            allSharesRaw.map((s: any) => {
              const profile = profileMap.get(s.user_id);
              return {
                ...s,
                amount: Number(s.amount),
                expense: s.expense
                  ? { ...s.expense, total_amount: Number(s.expense.total_amount) }
                  : undefined,
                profile: profile
                  ? { full_name: profile.full_name, venmo_handle: profile.venmo_handle }
                  : undefined,
              };
            })
          );
        } else {
          setAllShares([]);
        }
      } else {
        setAllShares([]);
      }
    } catch (error) {
      console.error('Error fetching expenses data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, teamId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createExpense = async (expense: {
    teamId: string;
    title: string;
    description?: string;
    category: string;
    totalAmount: number;
    dueDate?: string;
    splitType: string;
    shares: { userId: string; amount: number; childId?: string }[];
  }) => {
    if (!user) return null;

    try {
      const { data: newExpense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          team_id: expense.teamId,
          created_by: user.id,
          title: expense.title,
          description: expense.description,
          category: expense.category,
          total_amount: expense.totalAmount,
          due_date: expense.dueDate,
          split_type: expense.splitType,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      const sharesData = expense.shares.map((s) => ({
        expense_id: newExpense.id,
        user_id: s.userId,
        child_id: s.childId || null,
        amount: s.amount,
      }));

      const { error: sharesError } = await supabase
        .from('expense_shares')
        .insert(sharesData);

      if (sharesError) throw sharesError;

      toast({
        title: 'Expense Created',
        description: `${expense.shares.length} family members have been invoiced.`,
      });

      await fetchAll();
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to create expense.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const startConnectOnboarding = async (clubId?: string, teamId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: { clubId, teamId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error starting Connect onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to start payment setup.',
        variant: 'destructive',
      });
    }
  };

  const payExpenseShare = async (shareId: string, paymentMethod: 'card' | 'ach') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-expense-payment', {
        body: { expenseShareId: shareId, paymentMethod },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error creating payment:', error);
      const msg: string = error?.message || '';

      if (
        msg.includes('Payment service not configured') ||
        msg.includes('not set up their payment account')
      ) {
        toast({
          title: 'Demo Mode',
          description:
            'Stripe is not configured. Use "Mark as Paid" in the menu to record this payment manually.',
        });
      } else {
        toast({
          title: 'Error',
          description:
            'Failed to start payment. The team manager may not have set up their payment account yet.',
          variant: 'destructive',
        });
      }
    }
  };

  const markSharePaid = async (shareId: string, paymentMethod: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('expense_shares')
        .update({
          status: 'paid',
          payment_method: paymentMethod,
          paid_at: new Date().toISOString(),
          notes,
        })
        .eq('id', shareId);

      if (error) throw error;

      toast({
        title: 'Marked as Paid',
        description: 'Payment has been recorded.',
      });

      await fetchAll();
    } catch (error) {
      console.error('Error marking share as paid:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status.',
        variant: 'destructive',
      });
    }
  };

  const updateVenmoHandle = async (venmoHandle: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ venmo_handle: venmoHandle })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Venmo Updated',
        description: 'Your Venmo handle has been saved.',
      });
    } catch (error) {
      console.error('Error updating Venmo handle:', error);
      toast({
        title: 'Error',
        description: 'Failed to update Venmo handle.',
        variant: 'destructive',
      });
    }
  };

  return {
    expenses,
    myShares,
    allShares,
    loading,
    connectStatus,
    createExpense,
    startConnectOnboarding,
    payExpenseShare,
    markSharePaid,
    updateVenmoHandle,
    refetch: fetchAll,
  };
}
