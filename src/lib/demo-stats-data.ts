// Demo stats data for team statistics
export interface DemoTeamStats {
  team_id: string;
  season: string;
  wins: number;
  losses: number;
  ties: number;
  goals_for: number;
  goals_against: number;
  league_name: string;
  league_rank: number;
  division: string;
}

export interface DemoPlayerStats {
  player_name: string;
  jersey_number: string;
  position: string;
  games_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
}

export function generateDemoTeamStats(teamId: string): DemoTeamStats {
  return {
    team_id: teamId,
    season: '2025-2026',
    wins: 8,
    losses: 2,
    ties: 3,
    goals_for: 32,
    goals_against: 14,
    league_name: 'North Texas Premier League',
    league_rank: 2,
    division: 'U15 Boys Elite',
  };
}

export function generateDemoPlayerStats(): DemoPlayerStats[] {
  return [
    { player_name: 'Marcus Johnson', jersey_number: '10', position: 'Forward', games_played: 13, goals: 12, assists: 5, yellow_cards: 1, red_cards: 0, minutes_played: 1040 },
    { player_name: 'Lucas Brown', jersey_number: '9', position: 'Forward', games_played: 13, goals: 8, assists: 7, yellow_cards: 2, red_cards: 0, minutes_played: 975 },
    { player_name: 'Ethan Williams', jersey_number: '7', position: 'Midfielder', games_played: 12, goals: 4, assists: 9, yellow_cards: 0, red_cards: 0, minutes_played: 1020 },
    { player_name: 'Benjamin Taylor', jersey_number: '8', position: 'Midfielder', games_played: 13, goals: 3, assists: 4, yellow_cards: 1, red_cards: 0, minutes_played: 1100 },
    { player_name: 'William Martinez', jersey_number: '6', position: 'Midfielder', games_played: 11, goals: 2, assists: 3, yellow_cards: 2, red_cards: 0, minutes_played: 880 },
    { player_name: 'Owen Lewis', jersey_number: '15', position: 'Midfielder', games_played: 10, goals: 1, assists: 2, yellow_cards: 0, red_cards: 0, minutes_played: 650 },
    { player_name: 'Daniel White', jersey_number: '14', position: 'Midfielder', games_played: 9, goals: 2, assists: 1, yellow_cards: 1, red_cards: 0, minutes_played: 540 },
    { player_name: 'Oliver Garcia', jersey_number: '4', position: 'Defender', games_played: 13, goals: 1, assists: 1, yellow_cards: 3, red_cards: 0, minutes_played: 1170 },
    { player_name: 'James Anderson', jersey_number: '3', position: 'Defender', games_played: 13, goals: 0, assists: 2, yellow_cards: 2, red_cards: 0, minutes_played: 1170 },
    { player_name: 'Henry Thomas', jersey_number: '5', position: 'Defender', games_played: 12, goals: 0, assists: 0, yellow_cards: 1, red_cards: 0, minutes_played: 1080 },
    { player_name: 'Sebastian Jackson', jersey_number: '2', position: 'Defender', games_played: 11, goals: 0, assists: 1, yellow_cards: 0, red_cards: 0, minutes_played: 880 },
    { player_name: 'Alexander Moore', jersey_number: '11', position: 'Forward', games_played: 8, goals: 3, assists: 2, yellow_cards: 0, red_cards: 0, minutes_played: 480 },
    { player_name: 'Jack Clark', jersey_number: '17', position: 'Forward', games_played: 7, goals: 1, assists: 1, yellow_cards: 0, red_cards: 0, minutes_played: 350 },
    { player_name: 'Noah Davis', jersey_number: '1', position: 'Goalkeeper', games_played: 13, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, minutes_played: 1170 },
    { player_name: 'Matthew Harris', jersey_number: '16', position: 'Goalkeeper', games_played: 3, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, minutes_played: 135 },
  ];
}

export const recentResults = [
  { opponent: 'FC Dallas Academy', result: 'W', score: '3-1', date: '2026-01-05' },
  { opponent: 'Solar SC', result: 'W', score: '2-0', date: '2025-12-28' },
  { opponent: 'Texans SC', result: 'D', score: '1-1', date: '2025-12-21' },
  { opponent: 'Houston Dynamo Academy', result: 'W', score: '4-2', date: '2025-12-14' },
  { opponent: 'Lonestar SC', result: 'L', score: '0-2', date: '2025-12-07' },
];

export const upcomingMatches = [
  { opponent: 'FC Dallas Academy', location: 'Toyota Stadium Field 3', date: '2026-01-13', time: '2:00 PM' },
  { opponent: 'Solar SC', location: 'MoneyGram Soccer Park', date: '2026-01-17', time: '10:00 AM' },
  { opponent: 'Houston Dynamo Academy', location: 'BBVA Stadium', date: '2026-01-24', time: '1:00 PM' },
];

export const leagueStandings = [
  { rank: 1, team: 'FC Dallas Academy', played: 13, points: 31, gd: '+22' },
  { rank: 2, team: 'Albion SC 2011', played: 13, points: 27, gd: '+18' },
  { rank: 3, team: 'Solar SC', played: 13, points: 25, gd: '+12' },
  { rank: 4, team: 'Texans SC', played: 13, points: 22, gd: '+8' },
  { rank: 5, team: 'Houston Dynamo Academy', played: 13, points: 19, gd: '+4' },
  { rank: 6, team: 'Lonestar SC', played: 13, points: 16, gd: '-3' },
  { rank: 7, team: 'Austin FC Academy', played: 13, points: 12, gd: '-12' },
  { rank: 8, team: 'San Antonio FC', played: 13, points: 8, gd: '-18' },
];
