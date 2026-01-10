import { CreateEventInput } from '@/hooks/useEvents';

export interface ImportedEvent {
  title: string;
  event_type: string;
  start_time: string;
  end_time?: string;
  location?: string;
  opponent?: string;
  is_home_game?: boolean;
  external_id?: string;
}

// Parse CSV format (generic)
export function parseCSV(csvContent: string): ImportedEvent[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const events: ImportedEvent[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Map common column names
    const title = row['title'] || row['event'] || row['name'] || row['subject'] || '';
    const eventType = row['type'] || row['event_type'] || 'practice';
    const startTime = row['start'] || row['start_time'] || row['date'] || row['datetime'] || '';
    const endTime = row['end'] || row['end_time'] || '';
    const location = row['location'] || row['venue'] || row['address'] || '';
    const opponent = row['opponent'] || row['vs'] || row['against'] || '';
    const isHome = row['home'] === 'true' || row['home'] === '1' || row['is_home'] === 'true';

    if (title && startTime) {
      events.push({
        title,
        event_type: eventType.toLowerCase().includes('game') ? 'game' : 
                    eventType.toLowerCase().includes('practice') ? 'practice' : 
                    eventType.toLowerCase().includes('meeting') ? 'meeting' : 'other',
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : undefined,
        location: location || undefined,
        opponent: opponent || undefined,
        is_home_game: isHome,
      });
    }
  }

  return events;
}

// Parse TeamSnap-style format (simplified for demo)
export function parseTeamSnapFormat(data: any[]): ImportedEvent[] {
  return data.map(item => ({
    title: item.name || item.title || 'Event',
    event_type: item.is_game ? 'game' : 'practice',
    start_time: new Date(item.start_date || item.start_time).toISOString(),
    end_time: item.end_date ? new Date(item.end_date).toISOString() : undefined,
    location: item.location?.name || item.location_name || '',
    opponent: item.opponent?.name || item.opponent_name || '',
    is_home_game: item.is_home_game ?? true,
    external_id: item.id?.toString(),
  }));
}

// Convert imported events to create input format
export function convertToCreateInput(
  events: ImportedEvent[],
  teamId: string,
  userId: string,
  source: string
): CreateEventInput[] {
  return events.map(event => ({
    team_id: teamId,
    created_by: userId,
    title: event.title,
    event_type: event.event_type,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    opponent: event.opponent,
    is_home_game: event.is_home_game,
    external_id: event.external_id,
    external_source: source,
  }));
}

// Generate sample schedule data for demo purposes
export function generateSampleSchedule(): ImportedEvent[] {
  const now = new Date();
  const events: ImportedEvent[] = [];

  // Generate 10 sample events over the next 2 months
  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + (i * 7) + Math.floor(Math.random() * 3));
    
    const isGame = i % 3 === 0;
    const isPractice = !isGame;
    
    const hour = isGame ? 10 + Math.floor(Math.random() * 4) : 17 + Math.floor(Math.random() * 2);
    date.setHours(hour, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + (isGame ? 2 : 1.5));

    events.push({
      title: isGame ? `Game vs ${['Eagles', 'Sharks', 'Thunder', 'Lightning'][i % 4]}` : 'Team Practice',
      event_type: isGame ? 'game' : 'practice',
      start_time: date.toISOString(),
      end_time: endDate.toISOString(),
      location: isGame ? ['Central Stadium', 'West Field', 'Sports Complex', 'City Arena'][i % 4] : 'Home Field',
      opponent: isGame ? ['Eagles', 'Sharks', 'Thunder', 'Lightning'][i % 4] : undefined,
      is_home_game: i % 2 === 0,
    });
  }

  return events;
}
