import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentMethodButtons } from '@/components/PaymentMethodButtons';
import { DollarSign, Check, Clock, AlertCircle } from 'lucide-react';
import { Payment } from '@/hooks/usePayments';

interface PaymentsListProps {
  payments: Payment[];
  loading: boolean;
  onMarkPaid?: (paymentId: string) => void;
  isManager?: boolean;
  showPaymentOptions?: boolean;
}

export function PaymentsList({ payments, loading, onMarkPaid, isManager, showPaymentOptions = true }: PaymentsListProps) {
  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-600"><Check className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No payments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{payment.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.due_date 
                      ? `Due: ${format(new Date(payment.due_date), 'MMM d, yyyy')}`
                      : 'No due date'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold">${payment.amount.toFixed(2)}</p>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            </div>
            
            {/* Payment Actions */}
            {(payment.status === 'pending' || payment.status === 'overdue') && (
              <div className="border-t bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                {showPaymentOptions && !isManager && (
                  <PaymentMethodButtons 
                    amount={payment.amount}
                    description={payment.description}
                    onPaymentComplete={() => onMarkPaid?.(payment.id)}
                  />
                )}
                
                {isManager && onMarkPaid && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onMarkPaid(payment.id)}
                    className="gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark as Paid
                  </Button>
                )}
                
                {!isManager && showPaymentOptions && (
                  <p className="text-xs text-muted-foreground">
                    Secure payments powered by Stripe
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
