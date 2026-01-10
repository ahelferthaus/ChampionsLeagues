import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquarePlus } from 'lucide-react';

interface ComposeMessageDialogProps {
  onSend: (subject: string, body: string) => Promise<any>;
  disabled?: boolean;
}

export function ComposeMessageDialog({ onSend, disabled }: ComposeMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;

    setSending(true);
    const result = await onSend(subject, body);
    setSending(false);

    if (result) {
      setSubject('');
      setBody('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Send Team Message</DialogTitle>
          <DialogDescription>
            Send a message to all team members, parents, and coaches.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Message subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Type your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={sending || !subject.trim() || !body.trim()}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
