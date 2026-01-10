-- Demo data for testing multi-team selection
-- This creates sample clubs and teams

-- Create demo club (idempotent)
INSERT INTO public.clubs (id, name, description, created_by)
VALUES (
  'demo-club-albion',
  'Albion SC Boulder County',
  'Premier youth soccer club in Boulder County',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (id) DO NOTHING;

-- Create demo teams
INSERT INTO public.teams (id, club_id, name, age_group, gender, sport, created_by)
VALUES
  ('demo-team-u14-boys', 'demo-club-albion', 'U14 Boys Premier', 'U14', 'Boys', 'soccer', (SELECT id FROM auth.users LIMIT 1)),
  ('demo-team-u16-girls', 'demo-club-albion', 'U16 Girls Elite', 'U16', 'Girls', 'soccer', (SELECT id FROM auth.users LIMIT 1)),
  ('demo-team-u12-coed', 'demo-club-albion', 'U12 Coed Rec', 'U12', 'Coed', 'soccer', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Add all existing users as club admins (for demo purposes)
INSERT INTO public.club_admins (club_id, user_id)
SELECT 'demo-club-albion', id
FROM auth.users
ON CONFLICT (club_id, user_id) DO NOTHING;

-- Add all existing users as team members (for demo purposes)
INSERT INTO public.team_members (team_id, user_id, role, is_active)
SELECT team_id, user_id, 'parent', true
FROM (SELECT id AS user_id FROM auth.users) users
CROSS JOIN (
  SELECT 'demo-team-u14-boys' AS team_id
  UNION SELECT 'demo-team-u16-girls'
  UNION SELECT 'demo-team-u12-coed'
) teams
ON CONFLICT (team_id, user_id) DO NOTHING;
