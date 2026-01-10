-- Allow users to add themselves as team members when they are club admins
-- This fixes the chicken-and-egg problem where club admins can't add team members
-- because they need to be team managers first

-- Drop and recreate the policy to allow club admins OR the team creator to add members
DROP POLICY IF EXISTS "Team managers can add members" ON public.team_members;

CREATE POLICY "Team managers and club admins can add members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (
  is_team_manager(auth.uid(), team_id) 
  OR (EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = team_members.team_id 
    AND is_club_admin(auth.uid(), t.club_id)
  ))
  OR (EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = team_members.team_id 
    AND t.created_by = auth.uid()
  ))
);