-- Create attendance table for tracking player attendance per event
CREATE TABLE public.event_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  child_member_id UUID REFERENCES public.team_child_members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('present', 'absent', 'excused', 'late', 'pending')),
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id),
  marked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT attendance_member_check CHECK (
    (team_member_id IS NOT NULL AND child_member_id IS NULL) OR 
    (team_member_id IS NULL AND child_member_id IS NOT NULL)
  )
);

-- Create team_resources table for links, documents, external resources
CREATE TABLE public.team_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('link', 'google_drive', 'document', 'event_link', 'form')),
  url TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_resources ENABLE ROW LEVEL SECURITY;

-- Attendance policies - team members can view their team's attendance
CREATE POLICY "Team members can view attendance" 
ON public.event_attendance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events e
    JOIN public.team_members tm ON tm.team_id = e.team_id
    WHERE e.id = event_attendance.event_id AND tm.user_id = auth.uid()
  )
);

-- Managers can insert/update attendance
CREATE POLICY "Managers can manage attendance" 
ON public.event_attendance 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_attendance.event_id 
    AND public.is_team_manager(e.team_id, auth.uid())
  )
);

-- Team resources policies - team members can view
CREATE POLICY "Team members can view resources" 
ON public.team_resources 
FOR SELECT 
USING (
  public.is_team_member(team_id, auth.uid())
);

-- Managers can manage resources
CREATE POLICY "Managers can manage resources" 
ON public.team_resources 
FOR ALL 
USING (
  public.is_team_manager(team_id, auth.uid())
);

-- Create trigger for updated_at on attendance
CREATE TRIGGER update_event_attendance_updated_at
BEFORE UPDATE ON public.event_attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on resources
CREATE TRIGGER update_team_resources_updated_at
BEFORE UPDATE ON public.team_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();