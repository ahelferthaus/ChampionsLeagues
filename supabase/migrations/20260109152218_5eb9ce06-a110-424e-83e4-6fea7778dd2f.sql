-- Create payments table for tracking team finances
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table for team travel
CREATE TABLE public.trips (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE,
    meeting_location TEXT,
    notes TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Team members can view their payments"
ON public.payments FOR SELECT
USING (
    auth.uid() = user_id OR
    is_team_manager(auth.uid(), team_id) OR
    EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND is_club_admin(auth.uid(), t.club_id))
);

CREATE POLICY "Team managers can create payments"
ON public.payments FOR INSERT
WITH CHECK (
    is_team_manager(auth.uid(), team_id) OR
    EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND is_club_admin(auth.uid(), t.club_id))
);

CREATE POLICY "Team managers can update payments"
ON public.payments FOR UPDATE
USING (
    is_team_manager(auth.uid(), team_id) OR
    EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND is_club_admin(auth.uid(), t.club_id))
);

-- Trips policies
CREATE POLICY "Team members can view trips"
ON public.trips FOR SELECT
USING (
    is_team_member(auth.uid(), team_id) OR
    EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND is_club_admin(auth.uid(), t.club_id))
);

CREATE POLICY "Team managers can create trips"
ON public.trips FOR INSERT
WITH CHECK (
    auth.uid() = created_by AND (
        is_team_manager(auth.uid(), team_id) OR
        EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND is_club_admin(auth.uid(), t.club_id))
    )
);

CREATE POLICY "Team managers can update trips"
ON public.trips FOR UPDATE
USING (
    is_team_manager(auth.uid(), team_id) OR
    EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND is_club_admin(auth.uid(), t.club_id))
);

-- Add triggers for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();