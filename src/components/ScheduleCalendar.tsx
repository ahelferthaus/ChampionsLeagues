import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth,
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/hooks/useEvents';

interface ScheduleCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export function ScheduleCalendar({ events, onEventClick }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const getEventStyle = (eventType: string) => {
    switch (eventType) {
      case 'game':
        // Games highlighted with destructive (red) background
        return 'bg-destructive/20 text-destructive font-semibold border-l-2 border-destructive';
      case 'practice':
        // Practices in blue (using chart-3 which is a blue)
        return 'text-[hsl(199,89%,48%)] font-medium';
      default:
        // Everything else in foreground (black/dark)
        return 'text-foreground';
    }
  };

  const eventsOnDay = (day: Date) => 
    events.filter(e => isSameDay(new Date(e.start_time), day));

  const navigatePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getDateRange = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }
  };

  const days = getDateRange();
  const today = new Date();

  const getHeaderText = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  };

  return (
    <div className="space-y-4">
      {/* Header with navigation and view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {getHeaderText()}
          </h2>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-destructive/20 border-l-2 border-destructive"></span>
          <span className="text-muted-foreground">Game</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[hsl(199,89%,48%)]/20"></span>
          <span className="text-[hsl(199,89%,48%)]">Practice</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-muted"></span>
          <span className="text-muted-foreground">Other</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-muted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2 border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid grid-cols-7 ${viewMode === 'week' ? '' : 'auto-rows-fr'}`}>
          {days.map((day, index) => {
            const dayEvents = eventsOnDay(day);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={day.toISOString()} 
                className={`
                  min-h-[100px] border-b border-r p-2
                  ${viewMode === 'month' && !isCurrentMonth ? 'bg-muted/30' : 'bg-card'}
                  ${isToday ? 'bg-primary/5' : ''}
                `}
              >
                <span className={`
                  text-sm inline-flex items-center justify-center w-7 h-7 rounded-full
                  ${isToday ? 'bg-primary text-primary-foreground font-bold' : ''}
                  ${!isCurrentMonth && viewMode === 'month' ? 'text-muted-foreground' : ''}
                `}>
                  {format(day, 'd')}
                </span>
                
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, viewMode === 'week' ? 5 : 3).map(event => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={`
                        w-full text-left text-xs p-1.5 rounded truncate transition-colors
                        hover:opacity-80 cursor-pointer
                        ${getEventStyle(event.event_type)}
                        ${event.event_type === 'game' ? '' : 'bg-transparent'}
                      `}
                    >
                      <span className="font-medium">{format(new Date(event.start_time), 'h:mm a')}</span>
                      {' '}
                      {event.title}
                    </button>
                  ))}
                  {dayEvents.length > (viewMode === 'week' ? 5 : 3) && (
                    <p className="text-xs text-muted-foreground pl-1">
                      +{dayEvents.length - (viewMode === 'week' ? 5 : 3)} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
