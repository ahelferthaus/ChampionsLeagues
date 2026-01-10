import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Plane } from 'lucide-react';
import { getOrCreateDemoTeam } from '@/lib/demo-team';

interface CreateTripDialogProps {
  userId: string;
  onCreateTrip: (trip: {
    team_id: string;
    name: string;
    destination: string;
    departure_date: string;
    return_date: string | null;
    meeting_location: string | null;
    notes: string | null;
    created_by: string;
  }) => Promise<{ data: any; error: any }>;
  trigger?: React.ReactNode;
}

export function CreateTripDialog({ userId, onCreateTrip, trigger }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    departure_date: '',
    return_date: '',
    meeting_location: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.destination || !formData.departure_date) return;

    setLoading(true);
    
    try {
      const teamId = await getOrCreateDemoTeam(userId);
      
      if (!teamId) {
        toast({
          title: 'Error',
          description: 'Could not create team. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await onCreateTrip({
        team_id: teamId,
        name: formData.name,
        destination: formData.destination,
        departure_date: formData.departure_date,
        return_date: formData.return_date || null,
        meeting_location: formData.meeting_location || null,
        notes: formData.notes || null,
        created_by: userId,
      });

      if (!error) {
        setFormData({
          name: '',
          destination: '',
          departure_date: '',
          return_date: '',
          meeting_location: '',
          notes: '',
        });
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Create New Trip
          </DialogTitle>
          <DialogDescription>
            Plan a new team trip or tournament travel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Trip Name</Label>
            <Input
              id="name"
              placeholder="e.g., Las Vegas Showcase"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Las Vegas, NV"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure_date">Departure Date</Label>
              <Input
                id="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return_date">Return Date</Label>
              <Input
                id="return_date"
                type="date"
                value={formData.return_date}
                onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting_location">Meeting Location</Label>
            <Input
              id="meeting_location"
              placeholder="e.g., DFW Airport Terminal A"
              value={formData.meeting_location}
              onChange={(e) => setFormData({ ...formData, meeting_location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
