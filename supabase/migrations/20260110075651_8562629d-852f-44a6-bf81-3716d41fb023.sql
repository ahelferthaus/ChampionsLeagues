-- Create events table for games, practices, and other team events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'practice', -- 'game', 'practice', 'meeting', 'other'
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  opponent TEXT, -- For games
  is_home_game BOOLEAN DEFAULT true, -- For games
  external_id TEXT, -- For imported events (TeamSnap ID, etc.)
  external_source TEXT, -- 'teamsnap', 'sportsengine', 'manual', 'csv'
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Team members can view events"
ON public.events
FOR SELECT
USING (
  is_team_member(team_id, auth.uid()) OR 
  is_team_manager(team_id, auth.uid()) OR
  EXISTS (
    SELECT 1 FROM teams t 
    WHERE t.id = events.team_id AND is_club_admin(t.club_id, auth.uid())
  )
);

CREATE POLICY "Team managers can create events"
ON public.events
FOR INSERT
WITH CHECK (
  is_team_manager(team_id, auth.uid()) OR
  EXISTS (
    SELECT 1 FROM teams t 
    WHERE t.id = events.team_id AND is_club_admin(t.club_id, auth.uid())
  )
);

CREATE POLICY "Team managers can update events"
ON public.events
FOR UPDATE
USING (
  is_team_manager(team_id, auth.uid()) OR
  EXISTS (
    SELECT 1 FROM teams t 
    WHERE t.id = events.team_id AND is_club_admin(t.club_id, auth.uid())
  )
);

CREATE POLICY "Team managers can delete events"
ON public.events
FOR DELETE
USING (
  is_team_manager(team_id, auth.uid()) OR
  EXISTS (
    SELECT 1 FROM teams t 
    WHERE t.id = events.team_id AND is_club_admin(t.club_id, auth.uid())
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trip_itinerary table for flight/hotel/activity planning
CREATE TABLE public.trip_itinerary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'flight', 'hotel', 'activity', 'restaurant', 'transportation'
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  cost_estimate NUMERIC,
  booking_url TEXT,
  booking_reference TEXT,
  notes TEXT,
  age_groups TEXT[], -- ['U10', 'U12', 'all']
  sort_order INTEGER DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trip_itinerary ENABLE ROW LEVEL SECURITY;

-- Policies (same as trips since they're related)
CREATE POLICY "Team members can view trip itinerary"
ON public.trip_itinerary
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trips t
    JOIN teams tm ON tm.id = t.team_id
    WHERE t.id = trip_itinerary.trip_id 
    AND (is_team_member(t.team_id, auth.uid()) OR is_team_manager(t.team_id, auth.uid()) OR is_club_admin(tm.club_id, auth.uid()))
  )
);

CREATE POLICY "Team managers can create trip itinerary"
ON public.trip_itinerary
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM trips t
    JOIN teams tm ON tm.id = t.team_id
    WHERE t.id = trip_itinerary.trip_id 
    AND (is_team_manager(t.team_id, auth.uid()) OR is_club_admin(tm.club_id, auth.uid()))
  )
);

CREATE POLICY "Team managers can update trip itinerary"
ON public.trip_itinerary
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM trips t
    JOIN teams tm ON tm.id = t.team_id
    WHERE t.id = trip_itinerary.trip_id 
    AND (is_team_manager(t.team_id, auth.uid()) OR is_club_admin(tm.club_id, auth.uid()))
  )
);

CREATE POLICY "Team managers can delete trip itinerary"
ON public.trip_itinerary
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM trips t
    JOIN teams tm ON tm.id = t.team_id
    WHERE t.id = trip_itinerary.trip_id 
    AND (is_team_manager(t.team_id, auth.uid()) OR is_club_admin(tm.club_id, auth.uid()))
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_trip_itinerary_updated_at
BEFORE UPDATE ON public.trip_itinerary
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();