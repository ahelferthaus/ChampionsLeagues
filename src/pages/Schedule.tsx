import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/EventCard';
import { ScheduleImportDialog } from '@/components/ScheduleImportDialog';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { MainNavigation } from '@/components/MainNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, List, Download } from 'lucide-react';
import { downloadICS, generateEventsICS } from '@/lib/calendar-export';

export default function Schedule() {
  const { user, loading: authLoading } = useAuth();
  const { events, loading, importEvents, deleteEvent, refetch } = useEvents();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const upcomingEvents = events.filter(e => new Date(e.start_time) >= new Date());
  const pastEvents = events.filter(e => new Date(e.start_time) < new Date());

  const handleExportAll = () => {
    const ics = generateEventsICS(events, 'Team Schedule');
    downloadICS(ics, 'team-schedule.ics');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Schedule</h1>
            <p className="text-muted-foreground">Manage games, practices, and events</p>
          </div>
          <div className="flex items-center gap-2">
            <LoadDemoDataButton userId={user.id} onComplete={refetch} />
            <ScheduleImportDialog onImport={importEvents} />
            <Button variant="outline" onClick={handleExportAll} disabled={events.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="bg-primary/10 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <CalendarIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-3xl font-bold">{upcomingEvents.length}</p>
              </div>
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
              <TabsList>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <ScheduleCalendar events={events} />
        ) : (
          <>
            {/* Upcoming Events */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No upcoming events</p>
                    <ScheduleImportDialog 
                      onImport={importEvents}
                      trigger={<Button>Import Schedule</Button>}
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onDelete={deleteEvent}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                <div className="space-y-4">
                  {pastEvents.slice(0, 5).map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onDelete={deleteEvent}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
