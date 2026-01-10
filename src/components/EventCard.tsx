import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, Clock, MapPin, Download, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { downloadICS, generateEventICS, getGoogleCalendarUrl, getOutlookCalendarUrl } from '@/lib/calendar-export';

interface EventCardProps {
  event: Event;
  onDelete?: (eventId: string) => void;
  showActions?: boolean;
}

export function EventCard({ event, onDelete, showActions = true }: EventCardProps) {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;
  const isUpcoming = startDate > new Date();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'game':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'practice':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'meeting':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const handleDownloadICS = () => {
    const ics = generateEventICS(event);
    downloadICS(ics, `${event.title.replace(/\s+/g, '-')}.ics`);
  };

  return (
    <Card className={!isUpcoming ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
              </Badge>
              {event.is_home_game === false && event.event_type === 'game' && (
                <Badge variant="outline">Away</Badge>
              )}
              {!isUpcoming && (
                <Badge variant="secondary">Past</Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
            
            {event.opponent && (
              <p className="text-muted-foreground mb-2">vs {event.opponent}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(startDate, 'EEE, MMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {format(startDate, 'h:mm a')}
                  {endDate && ` - ${format(endDate, 'h:mm a')}`}
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                {event.description}
              </p>
            )}
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={handleDownloadICS}>
                  <Download className="h-4 w-4 mr-2" />
                  Download .ics
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Add to Google Calendar
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={getOutlookCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Add to Outlook
                  </a>
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(event.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
