-- Create messages table for in-app messaging
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_group_message BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message_recipients table
CREATE TABLE public.message_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create team_stats table for season statistics
CREATE TABLE public.team_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  ties INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  league_name TEXT,
  league_rank INTEGER,
  division TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create player_stats table
CREATE TABLE public.player_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  games_played INTEGER NOT NULL DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_links table for team video integrations
CREATE TABLE public.video_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;

-- RLS for messages
CREATE POLICY "Team members can view messages"
ON public.messages FOR SELECT
USING (
  is_team_member(auth.uid(), team_id) 
  OR is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM teams t WHERE t.id = messages.team_id AND is_club_admin(auth.uid(), t.club_id)
  )
);

CREATE POLICY "Team managers can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND (
    is_team_manager(auth.uid(), team_id)
    OR EXISTS (
      SELECT 1 FROM teams t WHERE t.id = messages.team_id AND is_club_admin(auth.uid(), t.club_id)
    )
  )
);

-- RLS for message_recipients
CREATE POLICY "Recipients can view their messages"
ON public.message_recipients FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM messages m 
    WHERE m.id = message_recipients.message_id 
    AND (
      is_team_member(auth.uid(), m.team_id)
      OR is_team_manager(auth.uid(), m.team_id)
    )
  )
);

CREATE POLICY "Message senders can add recipients"
ON public.message_recipients FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM messages m 
    WHERE m.id = message_recipients.message_id 
    AND m.sender_id = auth.uid()
  )
);

CREATE POLICY "Recipients can mark as read"
ON public.message_recipients FOR UPDATE
USING (user_id = auth.uid());

-- RLS for team_stats
CREATE POLICY "Team stats viewable by team members"
ON public.team_stats FOR SELECT
USING (
  is_team_member(auth.uid(), team_id) 
  OR is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM teams t WHERE t.id = team_stats.team_id AND is_club_admin(auth.uid(), t.club_id)
  )
);

CREATE POLICY "Team managers can manage team stats"
ON public.team_stats FOR ALL
USING (
  is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM teams t WHERE t.id = team_stats.team_id AND is_club_admin(auth.uid(), t.club_id)
  )
);

-- RLS for player_stats
CREATE POLICY "Player stats viewable by team members"
ON public.player_stats FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.id = player_stats.team_member_id 
    AND (
      is_team_member(auth.uid(), tm.team_id)
      OR is_team_manager(auth.uid(), tm.team_id)
      OR EXISTS (
        SELECT 1 FROM teams t WHERE t.id = tm.team_id AND is_club_admin(auth.uid(), t.club_id)
      )
    )
  )
);

CREATE POLICY "Team managers can manage player stats"
ON public.player_stats FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.id = player_stats.team_member_id 
    AND (
      is_team_manager(auth.uid(), tm.team_id)
      OR EXISTS (
        SELECT 1 FROM teams t WHERE t.id = tm.team_id AND is_club_admin(auth.uid(), t.club_id)
      )
    )
  )
);

-- RLS for video_links
CREATE POLICY "Video links viewable by team members"
ON public.video_links FOR SELECT
USING (
  is_team_member(auth.uid(), team_id) 
  OR is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM teams t WHERE t.id = video_links.team_id AND is_club_admin(auth.uid(), t.club_id)
  )
);

CREATE POLICY "Team managers can manage video links"
ON public.video_links FOR ALL
USING (
  is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM teams t WHERE t.id = video_links.team_id AND is_club_admin(auth.uid(), t.club_id)
  )
);

-- Add trigger for updated_at on team_stats
CREATE TRIGGER update_team_stats_updated_at
BEFORE UPDATE ON public.team_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();