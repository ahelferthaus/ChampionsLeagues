import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Expense, ExpenseShare } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { Users, Calendar, DollarSign } from 'lucide-react';

interface ExpenseManagerCardProps {
  expense: Expense;
  shares: ExpenseShare[];
  onViewDetails?: (expenseId: string) => void;
}

export function ExpenseManagerCard({ expense, shares, onViewDetails }: ExpenseManagerCardProps) {
  const paidShares = shares.filter(s => s.status === 'paid');
  const totalCollected = paidShares.reduce((sum, s) => sum + Number(s.amount), 0);
  const percentCollected = (totalCollected / Number(expense.total_amount)) * 100;

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

  const getStatusBadge = () => {
    if (expense.status === 'paid') {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Fully Paid</Badge>;
    }
    if (expense.status === 'partially_paid') {
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Partially Paid</Badge>;
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

        {/* Share breakdown */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{paidShares.length} of {shares.length} paid</span>
          </div>
          {expense.due_date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Due {format(new Date(expense.due_date), 'MMM d')}</span>
            </div>
          )}
        </div>

        {/* Unpaid members preview */}
        {shares.filter(s => s.status !== 'paid').length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Awaiting payment:</p>
            <div className="flex flex-wrap gap-1">
              {shares
                .filter(s => s.status !== 'paid')
                .slice(0, 5)
                .map((share) => (
                  <Badge key={share.id} variant="outline" className="text-xs">
                    ${Number(share.amount).toFixed(0)}
                  </Badge>
                ))}
              {shares.filter(s => s.status !== 'paid').length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{shares.filter(s => s.status !== 'paid').length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
