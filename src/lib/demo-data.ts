import { addDays, addHours, subDays, format } from 'date-fns';

export interface DemoEvent {
  team_id: string;
  title: string;
  description: string | null;
  event_type: string;
  location: string | null;
  start_time: string;
  end_time: string | null;
  opponent: string | null;
  is_home_game: boolean | null;
  external_id: string | null;
  external_source: string | null;
  created_by: string;
}

export interface DemoTrip {
  team_id: string;
  name: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  meeting_location: string | null;
  notes: string | null;
  created_by: string;
}

export interface DemoPayment {
  team_id: string;
  user_id: string;
  amount: number;
  description: string;
  due_date: string | null;
  status: 'pending' | 'paid' | 'overdue';
}

export function generateDemoEvents(teamId: string, userId: string): DemoEvent[] {
  const now = new Date();
  
  return [
    {
      team_id: teamId,
      title: 'vs. FC Dallas Academy',
      description: 'League match - bring white jerseys',
      event_type: 'game',
      location: 'Toyota Stadium Field 3',
      start_time: addDays(now, 3).toISOString(),
      end_time: addHours(addDays(now, 3), 2).toISOString(),
      opponent: 'FC Dallas Academy',
      is_home_game: false,
      external_id: null,
      external_source: null,
      created_by: userId,
    },
    {
      team_id: teamId,
      title: 'Weekly Practice',
      description: 'Focus on set pieces and finishing',
      event_type: 'practice',
      location: 'Albion Training Ground',
      start_time: addDays(now, 1).toISOString(),
      end_time: addHours(addDays(now, 1), 1.5).toISOString(),
      opponent: null,
      is_home_game: true,
      external_id: null,
      external_source: null,
      created_by: userId,
    },
    {
      team_id: teamId,
      title: 'vs. Solar SC',
      description: 'Friendly match',
      event_type: 'game',
      location: 'MoneyGram Soccer Park',
      start_time: addDays(now, 7).toISOString(),
      end_time: addHours(addDays(now, 7), 2).toISOString(),
      opponent: 'Solar SC',
      is_home_game: true,
      external_id: null,
      external_source: null,
      created_by: userId,
    },
    {
      team_id: teamId,
      title: 'Team Photo Day',
      description: 'Arrive 30 min early, wear full kit',
      event_type: 'other',
      location: 'Albion Training Ground',
      start_time: addDays(now, 5).toISOString(),
      end_time: addHours(addDays(now, 5), 2).toISOString(),
      opponent: null,
      is_home_game: true,
      external_id: null,
      external_source: null,
      created_by: userId,
    },
    {
      team_id: teamId,
      title: 'Weekly Practice',
      description: 'Defensive drills and scrimmage',
      event_type: 'practice',
      location: 'Albion Training Ground',
      start_time: addDays(now, 4).toISOString(),
      end_time: addHours(addDays(now, 4), 1.5).toISOString(),
      opponent: null,
      is_home_game: true,
      external_id: null,
      external_source: null,
      created_by: userId,
    },
    {
      team_id: teamId,
      title: 'vs. Houston Dynamo Academy',
      description: 'State Cup Qualifier',
      event_type: 'game',
      location: 'BBVA Stadium',
      start_time: addDays(now, 14).toISOString(),
      end_time: addHours(addDays(now, 14), 2).toISOString(),
      opponent: 'Houston Dynamo Academy',
      is_home_game: false,
      external_id: null,
      external_source: null,
      created_by: userId,
    },
  ];
}

export function generateDemoTrips(teamId: string, userId: string): DemoTrip[] {
  const now = new Date();
  
  return [
    {
      team_id: teamId,
      name: 'Las Vegas Showcase',
      destination: 'Las Vegas, NV',
      departure_date: addDays(now, 30).toISOString().split('T')[0],
      return_date: addDays(now, 33).toISOString().split('T')[0],
      meeting_location: 'DFW Airport Terminal A',
      notes: 'Major showcase tournament with college scouts attending',
      created_by: userId,
    },
    {
      team_id: teamId,
      name: 'Disney Soccer Showcase',
      destination: 'Orlando, FL',
      departure_date: addDays(now, 60).toISOString().split('T')[0],
      return_date: addDays(now, 65).toISOString().split('T')[0],
      meeting_location: 'DFW Airport Terminal C',
      notes: 'Annual team trip - families welcome!',
      created_by: userId,
    },
    {
      team_id: teamId,
      name: 'State Cup Finals',
      destination: 'Houston, TX',
      departure_date: addDays(now, 14).toISOString().split('T')[0],
      return_date: addDays(now, 15).toISOString().split('T')[0],
      meeting_location: 'Team Bus - Albion Training Ground',
      notes: 'Bus transportation provided',
      created_by: userId,
    },
  ];
}

export function generateDemoPayments(teamId: string, userId: string): DemoPayment[] {
  const now = new Date();
  
  return [
    {
      team_id: teamId,
      user_id: userId,
      amount: 250.00,
      description: 'Spring Season Registration Fee',
      due_date: addDays(now, 7).toISOString().split('T')[0],
      status: 'pending',
    },
    {
      team_id: teamId,
      user_id: userId,
      amount: 150.00,
      description: 'Tournament Entry - Las Vegas Showcase',
      due_date: addDays(now, 14).toISOString().split('T')[0],
      status: 'pending',
    },
    {
      team_id: teamId,
      user_id: userId,
      amount: 75.00,
      description: 'Team Uniform Set',
      due_date: subDays(now, 5).toISOString().split('T')[0],
      status: 'overdue',
    },
    {
      team_id: teamId,
      user_id: userId,
      amount: 200.00,
      description: 'Fall Season Registration Fee',
      due_date: subDays(now, 30).toISOString().split('T')[0],
      status: 'paid',
    },
    {
      team_id: teamId,
      user_id: userId,
      amount: 50.00,
      description: 'Team Photo Package',
      due_date: subDays(now, 15).toISOString().split('T')[0],
      status: 'paid',
    },
  ];
}
