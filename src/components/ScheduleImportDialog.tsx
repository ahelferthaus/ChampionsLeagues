import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseCSV, generateSampleSchedule, convertToCreateInput } from '@/lib/schedule-import';
import { CreateEventInput } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateDemoTeam } from '@/lib/demo-team';

interface ScheduleImportDialogProps {
  onImport: (events: CreateEventInput[]) => void;
  trigger?: React.ReactNode;
}

export function ScheduleImportDialog({ onImport, trigger }: ScheduleImportDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importing, setImporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };

  const handleImportCSV = async () => {
    if (!user || !csvContent.trim()) return;
    
    setImporting(true);
    try {
      const teamId = await getOrCreateDemoTeam(user.id);
      if (!teamId) {
        toast({
          title: 'Error',
          description: 'Could not create team. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      const parsed = parseCSV(csvContent);
      const events = convertToCreateInput(parsed, teamId, user.id, 'csv');
      onImport(events);
      setOpen(false);
      setCsvContent('');
    } finally {
      setImporting(false);
    }
  };

  const handleLoadSample = async () => {
    if (!user) return;
    
    setImporting(true);
    try {
      const teamId = await getOrCreateDemoTeam(user.id);
      if (!teamId) {
        toast({
          title: 'Error',
          description: 'Could not create team. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      const sample = generateSampleSchedule();
      const events = convertToCreateInput(sample, teamId, user.id, 'demo');
      onImport(events);
      setOpen(false);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Schedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Schedule</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="csv" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV Import</TabsTrigger>
            <TabsTrigger value="demo">Demo Data</TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload CSV File</Label>
              <Input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground">
                CSV should include columns: title, type (game/practice), start, end, location, opponent
              </p>
            </div>

            <div className="space-y-2">
              <Label>Or Paste CSV Content</Label>
              <Textarea
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="title,type,start,end,location,opponent&#10;Game vs Eagles,game,2024-03-15 10:00,2024-03-15 12:00,Central Field,Eagles"
                rows={6}
              />
            </div>

            <Button 
              onClick={handleImportCSV} 
              disabled={!csvContent.trim() || importing}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Import from CSV
            </Button>
          </TabsContent>

          <TabsContent value="demo" className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Load Sample Schedule</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This will create 10 sample events (games and practices) over the next 2 months to help you explore the scheduling features.
              </p>
              <Button onClick={handleLoadSample} disabled={importing} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Load Sample Schedule
              </Button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">TeamSnap / SportsEngine</h4>
              <p className="text-sm text-muted-foreground">
                To import from TeamSnap or SportsEngine, export your schedule as CSV from those platforms, then use the CSV Import tab.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
