import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Expense, ExpenseShare } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { Users, Calendar, Check, MoreVertical } from 'lucide-react';

interface ExpenseManagerCardProps {
  expense: Expense;
  shares: ExpenseShare[];
  onViewDetails?: (expenseId: string) => void;
  onMarkSharePaid?: (shareId: string, method: string) => void;
}

export function ExpenseManagerCard({ expense, shares, onMarkSharePaid }: ExpenseManagerCardProps) {
  const paidShares = shares.filter((s) => s.status === 'paid');
  const unpaidShares = shares.filter((s) => s.status !== 'paid');
  const totalCollected = paidShares.reduce((sum, s) => sum + Number(s.amount), 0);
  const percentCollected =
    shares.length > 0 ? (totalCollected / Number(expense.total_amount)) * 100 : 0;

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

  const getMemberName = (share: ExpenseShare) =>
    share.profile?.full_name || `Member (${share.user_id.slice(0, 6)}…)`;

  const getStatusBadge = () => {
    if (unpaidShares.length === 0 && shares.length > 0) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Fully Paid</Badge>
      );
    }
    if (paidShares.length > 0) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          Partially Paid
        </Badge>
      );
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{expense.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(expense.category)}
              </Badge>
              <span className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(expense.expense_date), 'MMM d, yyyy')}
              </span>
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {expense.description && (
          <p className="text-sm text-muted-foreground">{expense.description}</p>
        )}

        {/* Collection Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Collected</span>
            <span className="font-medium">
              ${totalCollected.toFixed(2)} / ${Number(expense.total_amount).toFixed(2)}
            </span>
          </div>
          <Progress value={percentCollected} className="h-2" />
        </div>

        {/* Share count + due date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {paidShares.length} of {shares.length} paid
            </span>
          </div>
          {expense.due_date && (
            <span className="text-muted-foreground text-xs">
              Due {format(new Date(expense.due_date), 'MMM d')}
            </span>
          )}
        </div>

        {/* Per-member breakdown */}
        {shares.length > 0 && (
          <div className="pt-2 border-t space-y-1">
            <p className="text-xs text-muted-foreground mb-2">Member breakdown:</p>
            {shares.map((share) => {
              const paid = share.status === 'paid';
              return (
                <div
                  key={share.id}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/40 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {paid ? (
                      <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                    )}
                    <span className="truncate text-foreground">{getMemberName(share)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span
                      className={
                        paid
                          ? 'text-green-600 font-medium'
                          : 'text-muted-foreground'
                      }
                    >
                      ${Number(share.amount).toFixed(2)}
                    </span>
                    {paid ? (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 text-green-600 border-green-500/30"
                      >
                        {share.payment_method ? `via ${share.payment_method}` : 'Paid'}
                      </Badge>
                    ) : (
                      onMarkSharePaid && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onMarkSharePaid(share.id, 'cash')}
                            >
                              Mark Paid (Cash)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onMarkSharePaid(share.id, 'venmo')}
                            >
                              Mark Paid (Venmo)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onMarkSharePaid(share.id, 'stripe')}
                            >
                              Mark Paid (Stripe)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onMarkSharePaid(share.id, 'other')}
                            >
                              Mark Paid (Other)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
