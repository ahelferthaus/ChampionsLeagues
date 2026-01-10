import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';

interface CreateExpenseDialogProps {
  teamId: string;
  teamMembers: { userId: string; name: string; childId?: string }[];
  onCreateExpense: (expense: {
    teamId: string;
    title: string;
    description?: string;
    category: string;
    totalAmount: number;
    dueDate?: string;
    splitType: string;
    shares: { userId: string; amount: number; childId?: string }[];
  }) => Promise<any>;
}

const CATEGORIES = [
  { value: 'trip', label: 'Trip/Travel' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'club_fee', label: 'Club Fee' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'uniform', label: 'Uniform' },
  { value: 'other', label: 'Other' },
];

export function CreateExpenseDialog({ teamId, teamMembers, onCreateExpense }: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('trip');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !totalAmount || selectedMembers.length === 0) return;

    setLoading(true);
    
    const amount = parseFloat(totalAmount);
    const shareAmount = amount / selectedMembers.length;
    
    const shares = selectedMembers.map(memberId => {
      const member = teamMembers.find(m => m.userId === memberId);
      return {
        userId: memberId,
        amount: Math.round(shareAmount * 100) / 100,
        childId: member?.childId,
      };
    });

    await onCreateExpense({
      teamId,
      title,
      description: description || undefined,
      category,
      totalAmount: amount,
      dueDate: dueDate || undefined,
      splitType,
      shares,
    });

    setLoading(false);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('trip');
    setTotalAmount('');
    setDueDate('');
    setSplitType('equal');
    setSelectedMembers([]);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedMembers(teamMembers.map(m => m.userId));
  };

  const perPersonAmount = selectedMembers.length > 0 && totalAmount
    ? (parseFloat(totalAmount) / selectedMembers.length).toFixed(2)
    : '0.00';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
          <DialogDescription>
            Create an expense to split among team members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Expense Title</Label>
            <Input
              id="title"
              placeholder="e.g., Hotel for Atlanta Tournament"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount ($)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="500.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this expense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split Among</Label>
              <Button type="button" variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
            </div>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
              {teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team members found</p>
              ) : (
                teamMembers.map((member) => (
                  <label
                    key={member.userId}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.userId)}
                      onChange={() => toggleMember(member.userId)}
                      className="rounded"
                    />
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))
              )}
            </div>
            {selectedMembers.length > 0 && totalAmount && (
              <p className="text-sm text-muted-foreground">
                ${perPersonAmount} per person ({selectedMembers.length} selected)
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title || !totalAmount || selectedMembers.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create & Send Invoices'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
