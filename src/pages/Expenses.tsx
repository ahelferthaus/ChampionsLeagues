import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useExpenses } from '@/hooks/useExpenses';
import { useRoster } from '@/hooks/useRoster';
import { useTeam } from '@/contexts/TeamContext';
import { MainNavigation } from '@/components/MainNavigation';
import { CreateExpenseDialog } from '@/components/CreateExpenseDialog';
import { ExpenseShareCard } from '@/components/ExpenseShareCard';
import { ExpenseManagerCard } from '@/components/ExpenseManagerCard';
import { ConnectAccountSetup } from '@/components/ConnectAccountSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Receipt, DollarSign, Settings, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Expenses() {
  const { user, roles, loading: authLoading } = useAuth();
  const { team } = useTeam();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentTeamId = team?.id || 'demo-team-u14-boys';

  const {
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
    refetch,
  } = useExpenses(currentTeamId);

  const { roster } = useRoster(currentTeamId);
  const [venmoHandle, setVenmoHandle] = useState<string>('');

  const isManager = roles.includes('club_admin') || roles.includes('team_manager');

  // Fetch user's Venmo handle
  useEffect(() => {
    const fetchVenmo = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('venmo_handle')
        .eq('user_id', user.id)
        .single();
      if (data?.venmo_handle) {
        setVenmoHandle(data.venmo_handle);
      }
    };
    fetchVenmo();
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Handle payment success/cancel from URL params
  useEffect(() => {
    const payment = searchParams.get('payment');
    const setup = searchParams.get('setup');
    const shareId = searchParams.get('share');

    if (payment === 'success') {
      // If Stripe returned the share id, mark it paid via stripe
      if (shareId) {
        markSharePaid(shareId, 'stripe');
      }
      toast({
        title: 'Payment Successful!',
        description: 'Your payment has been processed.',
      });
      refetch();
      window.history.replaceState({}, '', '/expenses');
    } else if (payment === 'canceled') {
      toast({
        title: 'Payment Canceled',
        description: "You can try again when you're ready.",
        variant: 'destructive',
      });
      window.history.replaceState({}, '', '/expenses');
    } else if (setup === 'complete') {
      toast({
        title: 'Account Setup Complete!',
        description: 'You can now receive payments from team members.',
      });
      refetch();
      window.history.replaceState({}, '', '/expenses');
    }
  }, [searchParams, refetch]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  // Convert roster members to format for expense dialog, using real names
  const teamMembers = roster.map((m) => ({
    userId: m.user_id,
    name:
      m.profile?.full_name ||
      (m.jersey_number ? `Player #${m.jersey_number}` : 'Team Member'),
    childId: undefined,
  }));

  const pendingShares = myShares.filter((s) => s.status === 'pending');
  const paidShares = myShares.filter((s) => s.status === 'paid');
  const totalOwed = pendingShares.reduce((sum, s) => sum + Number(s.amount), 0);

  // Get all shares for a given expense (manager view)
  const getSharesForExpense = (expenseId: string) =>
    allShares.filter((s) => s.expense_id === expenseId);

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Receipt className="h-8 w-8" />
              Expenses
            </h1>
            <p className="text-muted-foreground">Manage team expenses and reimbursements</p>
          </div>
          {isManager && (
            <CreateExpenseDialog
              teamId={currentTeamId}
              teamMembers={teamMembers}
              onCreateExpense={createExpense}
            />
          )}
        </div>

        {/* Summary Card */}
        {pendingShares.length > 0 && (
          <Card className="mb-8 bg-primary/10 border-primary/20">
            <CardContent className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount Due</p>
                  <p className="text-3xl font-bold">${totalOwed.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {pendingShares.length} pending expense
                {pendingShares.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={isManager ? 'manage' : 'my-expenses'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-expenses" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">My Expenses</span>
              <span className="sm:hidden">Mine</span>
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="manage" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Team Expenses</span>
                <span className="sm:hidden">Team</span>
              </TabsTrigger>
            )}
            {isManager && (
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Payment Setup</span>
                <span className="sm:hidden">Setup</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* My Expenses Tab */}
          <TabsContent value="my-expenses" className="space-y-6">
            {pendingShares.length === 0 && paidShares.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No expenses to show</p>
                  <p className="text-sm">Expenses shared with you will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {pendingShares.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Pending Payments</h2>
                    <div className="grid gap-4">
                      {pendingShares.map((share) => (
                        <ExpenseShareCard
                          key={share.id}
                          share={share}
                          onPayCard={(id) => payExpenseShare(id, 'card')}
                          onPayACH={(id) => payExpenseShare(id, 'ach')}
                          onMarkPaid={(id, method) => markSharePaid(id, method)}
                          creatorVenmoHandle={venmoHandle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {paidShares.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Payment History</h2>
                    <div className="grid gap-4">
                      {paidShares.map((share) => (
                        <ExpenseShareCard
                          key={share.id}
                          share={share}
                          onPayCard={() => {}}
                          onPayACH={() => {}}
                          onMarkPaid={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Manager: Team Expenses Tab */}
          {isManager && (
            <TabsContent value="manage" className="space-y-6">
              {expenses.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No team expenses yet</p>
                    <p className="text-sm">
                      Create an expense to start collecting from team members
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {expenses.map((expense) => (
                    <ExpenseManagerCard
                      key={expense.id}
                      expense={expense}
                      shares={getSharesForExpense(expense.id)}
                      onMarkSharePaid={(shareId, method) => markSharePaid(shareId, method)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* Manager: Payment Setup Tab */}
          {isManager && (
            <TabsContent value="settings">
              <ConnectAccountSetup
                status={connectStatus}
                venmoHandle={venmoHandle}
                onStartOnboarding={() => startConnectOnboarding(undefined, currentTeamId)}
                onUpdateVenmo={(handle) => {
                  setVenmoHandle(handle);
                  updateVenmoHandle(handle);
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
