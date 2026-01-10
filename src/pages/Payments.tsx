import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePayments } from '@/hooks/usePayments';
import { PaymentsList } from '@/components/PaymentsList';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { TeamHeader } from '@/components/TeamHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, CreditCard } from 'lucide-react';

export default function Payments() {
  const { user, roles, loading: authLoading } = useAuth();
  const { payments, loading, updatePaymentStatus, refetch } = usePayments();
  const navigate = useNavigate();

  const isManager = roles.includes('club_admin') || roles.includes('team_manager');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleMarkPaid = async (paymentId: string) => {
    await updatePaymentStatus(paymentId, 'paid', new Date().toISOString());
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const completedPayments = payments.filter(p => p.status === 'paid' || p.status === 'cancelled');
  const totalDue = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <TeamHeader title="Payments" />
            </div>
            <LoadDemoDataButton 
              userId={user.id} 
              onComplete={refetch}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="bg-primary/10 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isManager ? 'Total Pending Collection' : 'Total Amount Due'}
                </p>
                <p className="text-3xl font-bold">${totalDue.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Payment Methods Info */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Pay with Card or Venmo</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {pendingPayments.length > 0 ? 'Pending Payments' : 'All Caught Up!'}
          </h2>
          <PaymentsList 
            payments={pendingPayments} 
            loading={loading}
            isManager={isManager}
            onMarkPaid={handleMarkPaid}
          />
        </div>

        {/* Payment History */}
        {completedPayments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <PaymentsList 
              payments={completedPayments} 
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
