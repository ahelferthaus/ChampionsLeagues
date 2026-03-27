-- Demo expenses and expense_shares for the demo team
-- These let managers and parents see the full expense-splitting flow without real Stripe keys.

-- Insert demo expenses for the U14 Boys team (idempotent)
INSERT INTO public.expenses (id, team_id, created_by, title, description, category, total_amount, due_date, split_type, status, expense_date)
SELECT
  id, team_id, created_by, title, description, category, total_amount, due_date, split_type, status, expense_date
FROM (VALUES
  (
    'demo-expense-hotel',
    'demo-team-u14-boys',
    (SELECT id FROM auth.users LIMIT 1),
    'Hotel – Atlanta Tournament',
    '2 nights at Marriott for the spring tournament',
    'trip',
    750.00,
    (CURRENT_DATE + INTERVAL '14 days')::date,
    'equal',
    'pending',
    CURRENT_DATE::date
  ),
  (
    'demo-expense-tournament-fee',
    'demo-team-u14-boys',
    (SELECT id FROM auth.users LIMIT 1),
    'Spring Classic Entry Fee',
    'Tournament registration for all players',
    'tournament',
    500.00,
    (CURRENT_DATE + INTERVAL '7 days')::date,
    'equal',
    'partially_paid',
    (CURRENT_DATE - INTERVAL '3 days')::date
  ),
  (
    'demo-expense-uniforms',
    'demo-team-u14-boys',
    (SELECT id FROM auth.users LIMIT 1),
    'New Away Kits',
    'Full uniform set for the season',
    'uniform',
    600.00,
    NULL,
    'equal',
    'paid',
    (CURRENT_DATE - INTERVAL '10 days')::date
  )
) AS v(id, team_id, created_by, title, description, category, total_amount, due_date, split_type, status, expense_date)
ON CONFLICT (id) DO NOTHING;

-- Insert demo expense shares, splitting each expense among all members of the team
-- Hotel: pending for everyone (demo = current user owes money)
INSERT INTO public.expense_shares (id, expense_id, user_id, amount, status)
SELECT
  'demo-share-hotel-' || u.id,
  'demo-expense-hotel',
  u.id,
  750.00 / COUNT(*) OVER (),
  'pending'
FROM auth.users u
JOIN public.team_members tm ON tm.user_id = u.id AND tm.team_id = 'demo-team-u14-boys'
ON CONFLICT (id) DO NOTHING;

-- Tournament fee: first user paid, rest pending (partially_paid scenario)
INSERT INTO public.expense_shares (id, expense_id, user_id, amount, status, payment_method, paid_at)
SELECT
  'demo-share-tournament-' || u.id,
  'demo-expense-tournament-fee',
  u.id,
  500.00 / COUNT(*) OVER (),
  CASE WHEN ROW_NUMBER() OVER (ORDER BY u.id) = 1 THEN 'paid' ELSE 'pending' END,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY u.id) = 1 THEN 'stripe' ELSE NULL END,
  CASE WHEN ROW_NUMBER() OVER (ORDER BY u.id) = 1 THEN NOW() ELSE NULL END
FROM auth.users u
JOIN public.team_members tm ON tm.user_id = u.id AND tm.team_id = 'demo-team-u14-boys'
ON CONFLICT (id) DO NOTHING;

-- Uniforms: everyone paid (fully_paid scenario)
INSERT INTO public.expense_shares (id, expense_id, user_id, amount, status, payment_method, paid_at)
SELECT
  'demo-share-uniform-' || u.id,
  'demo-expense-uniforms',
  u.id,
  600.00 / COUNT(*) OVER (),
  'paid',
  'stripe',
  NOW() - INTERVAL '5 days'
FROM auth.users u
JOIN public.team_members tm ON tm.user_id = u.id AND tm.team_id = 'demo-team-u14-boys'
ON CONFLICT (id) DO NOTHING;
