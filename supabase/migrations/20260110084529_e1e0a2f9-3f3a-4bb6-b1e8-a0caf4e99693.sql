-- Fix the events RLS policies - the function arguments are in wrong order
-- is_team_manager expects (_user_id, _team_id) not (team_id, user_id)
-- is_club_admin expects (_user_id, _club_id) not (club_id, user_id)

DROP POLICY IF EXISTS "Team managers can create events" ON public.events;
DROP POLICY IF EXISTS "Team managers can delete events" ON public.events;
DROP POLICY IF EXISTS "Team managers can update events" ON public.events;
DROP POLICY IF EXISTS "Team members can view events" ON public.events;

-- Recreate with correct argument order
CREATE POLICY "Team managers can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (
  is_team_manager(auth.uid(), team_id) 
  OR (EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = events.team_id 
    AND is_club_admin(auth.uid(), t.club_id)
  ))
);

CREATE POLICY "Team managers can delete events" 
ON public.events 
FOR DELETE 
USING (
  is_team_manager(auth.uid(), team_id) 
  OR (EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = events.team_id 
    AND is_club_admin(auth.uid(), t.club_id)
  ))
);

CREATE POLICY "Team managers can update events" 
ON public.events 
FOR UPDATE 
USING (
  is_team_manager(auth.uid(), team_id) 
  OR (EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = events.team_id 
    AND is_club_admin(auth.uid(), t.club_id)
  ))
);

CREATE POLICY "Team members can view events" 
ON public.events 
FOR SELECT 
USING (
  is_team_member(auth.uid(), team_id) 
  OR is_team_manager(auth.uid(), team_id) 
  OR (EXISTS (
    SELECT 1 FROM teams t
    WHERE t.id = events.team_id 
    AND is_club_admin(auth.uid(), t.club_id)
  ))
);