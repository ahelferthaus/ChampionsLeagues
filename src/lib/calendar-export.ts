import { format } from 'date-fns';
import { Event } from '@/hooks/useEvents';
import { Trip } from '@/hooks/useTrips';

// Generate ICS format date (YYYYMMDDTHHMMSSZ)
function formatICSDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

// Generate ICS format date without time
function formatICSDateOnly(date: Date): string {
  return format(date, 'yyyyMMdd');
}

// Escape special characters for ICS
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Generate a unique UID for calendar events
function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@teamhub.app`;
}

export function generateEventICS(event: Event): string {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TeamHub//Sports Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUID()}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ];

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  }

  if (event.opponent) {
    lines.push(`DESCRIPTION:${escapeICS(`vs ${event.opponent}${event.description ? ' - ' + event.description : ''}`)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

export function generateEventsICS(events: Event[], calendarName = 'Team Schedule'): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TeamHub//Sports Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(calendarName)}`,
  ];

  events.forEach(event => {
    const startDate = new Date(event.start_time);
    const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${generateUID()}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${escapeICS(event.title)}`
    );

    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }

    const description = [event.opponent ? `vs ${event.opponent}` : '', event.description || ''].filter(Boolean).join(' - ');
    if (description) {
      lines.push(`DESCRIPTION:${escapeICS(description)}`);
    }

    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function generateTripICS(trip: Trip): string {
  const startDate = new Date(trip.departure_date);
  const endDate = trip.return_date ? new Date(trip.return_date) : startDate;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TeamHub//Trip Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUID()}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART;VALUE=DATE:${formatICSDateOnly(startDate)}`,
    `DTEND;VALUE=DATE:${formatICSDateOnly(new Date(endDate.getTime() + 24 * 60 * 60 * 1000))}`, // Add 1 day for all-day events
    `SUMMARY:${escapeICS(trip.name)}`,
    `LOCATION:${escapeICS(trip.destination)}`,
  ];

  const description = [
    trip.meeting_location ? `Meet at: ${trip.meeting_location}` : '',
    trip.notes || '',
  ].filter(Boolean).join('\\n');

  if (description) {
    lines.push(`DESCRIPTION:${escapeICS(description)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Generate Google Calendar URL
export function getGoogleCalendarUrl(event: Event): string {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatICSDate(startDate)}/${formatICSDate(endDate)}`,
    details: [event.opponent ? `vs ${event.opponent}` : '', event.description || ''].filter(Boolean).join(' - '),
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate Outlook Calendar URL
export function getOutlookCalendarUrl(event: Event): string {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: [event.opponent ? `vs ${event.opponent}` : '', event.description || ''].filter(Boolean).join(' - '),
    location: event.location || '',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
