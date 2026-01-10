// Demo roster data for team members
export interface DemoRosterMember {
  team_id: string;
  user_id: string;
  role: 'team_manager' | 'player' | 'parent';
  jersey_number: string | null;
  position: string | null;
  is_active: boolean;
}

export interface DemoPlayerProfile {
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
}

// Demo players for the roster
export const demoPlayerNames = [
  { first: 'Marcus', last: 'Johnson', jersey: '10', position: 'Forward', parentName: 'David Johnson', parentEmail: 'david.johnson@email.com', parentPhone: '(214) 555-0101' },
  { first: 'Ethan', last: 'Williams', jersey: '7', position: 'Midfielder', parentName: 'Sarah Williams', parentEmail: 'sarah.williams@email.com', parentPhone: '(214) 555-0102' },
  { first: 'Lucas', last: 'Brown', jersey: '9', position: 'Forward', parentName: 'Michael Brown', parentEmail: 'michael.brown@email.com', parentPhone: '(214) 555-0103' },
  { first: 'Noah', last: 'Davis', jersey: '1', position: 'Goalkeeper', parentName: 'Jennifer Davis', parentEmail: 'jennifer.davis@email.com', parentPhone: '(214) 555-0104' },
  { first: 'Oliver', last: 'Garcia', jersey: '4', position: 'Defender', parentName: 'Carlos Garcia', parentEmail: 'carlos.garcia@email.com', parentPhone: '(214) 555-0105' },
  { first: 'William', last: 'Martinez', jersey: '6', position: 'Midfielder', parentName: 'Maria Martinez', parentEmail: 'maria.martinez@email.com', parentPhone: '(214) 555-0106' },
  { first: 'James', last: 'Anderson', jersey: '3', position: 'Defender', parentName: 'Robert Anderson', parentEmail: 'robert.anderson@email.com', parentPhone: '(214) 555-0107' },
  { first: 'Benjamin', last: 'Taylor', jersey: '8', position: 'Midfielder', parentName: 'Lisa Taylor', parentEmail: 'lisa.taylor@email.com', parentPhone: '(214) 555-0108' },
  { first: 'Henry', last: 'Thomas', jersey: '5', position: 'Defender', parentName: 'James Thomas', parentEmail: 'james.thomas@email.com', parentPhone: '(214) 555-0109' },
  { first: 'Alexander', last: 'Moore', jersey: '11', position: 'Forward', parentName: 'Emily Moore', parentEmail: 'emily.moore@email.com', parentPhone: '(214) 555-0110' },
  { first: 'Sebastian', last: 'Jackson', jersey: '2', position: 'Defender', parentName: 'William Jackson', parentEmail: 'william.jackson@email.com', parentPhone: '(214) 555-0111' },
  { first: 'Daniel', last: 'White', jersey: '14', position: 'Midfielder', parentName: 'Amanda White', parentEmail: 'amanda.white@email.com', parentPhone: '(214) 555-0112' },
  { first: 'Matthew', last: 'Harris', jersey: '16', position: 'Goalkeeper', parentName: 'Christopher Harris', parentEmail: 'chris.harris@email.com', parentPhone: '(214) 555-0113' },
  { first: 'Jack', last: 'Clark', jersey: '17', position: 'Forward', parentName: 'Michelle Clark', parentEmail: 'michelle.clark@email.com', parentPhone: '(214) 555-0114' },
  { first: 'Owen', last: 'Lewis', jersey: '15', position: 'Midfielder', parentName: 'Daniel Lewis', parentEmail: 'daniel.lewis@email.com', parentPhone: '(214) 555-0115' },
];

// Demo coaches/managers
export const demoCoaches = [
  { name: 'Coach Mike Rodriguez', role: 'Head Coach', email: 'coach.mike@albionsc.com', phone: '(214) 555-0001' },
  { name: 'Coach Sarah Chen', role: 'Assistant Coach', email: 'coach.sarah@albionsc.com', phone: '(214) 555-0002' },
  { name: 'Tom Williams', role: 'Team Manager', email: 'tom.williams@albionsc.com', phone: '(214) 555-0003' },
];
