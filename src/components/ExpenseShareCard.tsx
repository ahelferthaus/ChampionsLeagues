import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExpenseShare } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { CreditCard, Building2, ExternalLink, MoreVertical, Check, Clock, AlertCircle } from 'lucide-react';

interface ExpenseShareCardProps {
  share: ExpenseShare;
  onPayCard: (shareId: string) => void;
  onPayACH: (shareId: string) => void;
  onMarkPaid: (shareId: string, method: string) => void;
  creatorVenmoHandle?: string;
}

export function ExpenseShareCard({ share, onPayCard, onPayACH, onMarkPaid, creatorVenmoHandle }: ExpenseShareCardProps) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const isPaid = share.status === 'paid';
  const isOverdue = share.expense?.due_date && new Date(share.expense.due_date) < new Date() && !isPaid;

  const getStatusBadge = () => {
    if (isPaid) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Paid</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      trip: 'Trip/Travel',
      tournament: 'Tournament',
      club_fee: 'Club Fee',
      equipment: 'Equipment',
      uniform: 'Uniform',
      other: 'Other',
    };
    return labels[category] || category;
  };

  const openVenmo = () => {
    if (creatorVenmoHandle) {
      // Open Venmo app/website with payment request
      const venmoUrl = `https://venmo.com/${creatorVenmoHandle}?txn=pay&amount=${share.amount}&note=${encodeURIComponent(share.expense?.title || 'Team Expense')}`;
      window.open(venmoUrl, '_blank');
    }
  };

  return (
    <Card className={`${isOverdue ? 'border-destructive/50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{share.expense?.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(share.expense?.category || '')}
              </Badge>
              {share.expense?.due_date && (
                <span className="text-xs">
                  Due {format(new Date(share.expense.due_date), 'MMM d, yyyy')}
                </span>
              )}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {share.expense?.description && (
          <p className="text-sm text-muted-foreground">{share.expense.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${Number(share.amount).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Your share</p>
          </div>

          {!isPaid && (
            <div className="flex flex-col gap-2">
              {/* Main payment buttons */}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onPayCard(share.id)} className="gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  Card
                </Button>
                <Button size="sm" variant="outline" onClick={() => onPayACH(share.id)} className="gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  Bank (ACH)
                </Button>
              </div>
              
              {/* Alternative payment methods */}
              <div className="flex gap-2">
                {creatorVenmoHandle && (
                  <Button size="sm" variant="ghost" onClick={openVenmo} className="gap-1.5 text-xs">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                      <path d="M19.5 3c.9 1.5 1.3 3 1.3 5 0 5.5-4.7 12.6-8.5 17.6H4.7L1.5 3.5l7-.7 1.5 12c1.4-2.3 3.2-5.8 3.2-8.2 0-1.9-.3-3.2-.9-4.2L19.5 3z"/>
                    </svg>
                    Venmo
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-xs">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onMarkPaid(share.id, 'cash')}>
                      Mark as Paid (Cash)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMarkPaid(share.id, 'venmo')}>
                      Mark as Paid (Venmo)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMarkPaid(share.id, 'other')}>
                      Mark as Paid (Other)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {isPaid && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <div className="text-right">
                <p className="text-sm font-medium">Paid</p>
                {share.paid_at && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(share.paid_at), 'MMM d')}
                    {share.payment_method && ` via ${share.payment_method}`}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fee info */}
        {!isPaid && (
          <p className="text-xs text-muted-foreground">
            💡 ACH (bank transfer) has lower fees than card payments
          </p>
        )}
      </CardContent>
    </Card>
  );
}
