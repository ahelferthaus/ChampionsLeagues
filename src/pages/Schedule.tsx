import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/EventCard';
import { ScheduleImportDialog } from '@/components/ScheduleImportDialog';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, ArrowLeft, Calendar as CalendarIcon, List, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadICS, generateEventsICS } from '@/lib/calendar-export';

// Demo team ID for showcase purposes
const DEMO_TEAM_ID = 'demo-team-id';

export default function Schedule() {
  const { user, loading: authLoading } = useAuth();
  const { events, loading, importEvents, deleteEvent, refetch } = useEvents();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

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

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const eventsOnDay = (day: Date) => 
    events.filter(e => isSameDay(new Date(e.start_time), day));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground sticky top-0 z-50 border-b border-sidebar-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Team Schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <LoadDemoDataButton 
                teamId={DEMO_TEAM_ID} 
                userId={user.id} 
                onComplete={refetch}
              />
              <ScheduleImportDialog 
                teamId={DEMO_TEAM_ID}
                onImport={importEvents}
              />
              <Button variant="outline" onClick={handleExportAll} disabled={events.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
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
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="mb-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {/* Padding for first week */}
              {Array.from({ length: monthDays[0].getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[80px]" />
              ))}
              {/* Days */}
              {monthDays.map(day => {
                const dayEvents = eventsOnDay(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toISOString()} 
                    className={`min-h-[80px] border rounded-lg p-1 ${isToday ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <span className={`text-sm ${isToday ? 'font-bold text-primary' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div 
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${
                            event.event_type === 'game' 
                              ? 'bg-destructive/10 text-destructive' 
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {format(new Date(event.start_time), 'h:mm a')} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
                      teamId={DEMO_TEAM_ID}
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
