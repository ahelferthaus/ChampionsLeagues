-- =====================================================
-- SECURITY FIX: Role Assignment & COPPA Compliance
-- =====================================================

-- 1. CRITICAL: Remove the dangerous self-insert policy that allows privilege escalation
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;

-- 2. Create a secure policy: Users can only self-assign SAFE roles (parent only)
-- Club admins and team managers must be assigned by existing admins
CREATE POLICY "Users can self-assign parent role only"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'parent'
);

-- 3. Allow club admins to assign any role to users
CREATE POLICY "Club admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'club_admin')
);

-- 4. Allow team managers to assign parent/player roles (for their team context)
CREATE POLICY "Team managers can assign member roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'team_manager')
  AND role IN ('parent', 'player')
);

-- =====================================================
-- COPPA COMPLIANCE: Parent-Child Account Structure
-- =====================================================

-- 5. Create child_profiles table FIRST (no dependencies)
CREATE TABLE IF NOT EXISTS public.child_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  jersey_number TEXT,
  position TEXT,
  medical_notes TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create team_child_members table (depends on child_profiles)
CREATE TABLE IF NOT EXISTS public.team_child_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player',
  jersey_number TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, child_id)
);

-- Enable RLS
ALTER TABLE public.team_child_members ENABLE ROW LEVEL SECURITY;

-- 7. Now add all the policies for child_profiles
CREATE POLICY "Parents can view their children"
ON public.child_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = parent_user_id);

CREATE POLICY "Parents can create child profiles"
ON public.child_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = parent_user_id);

CREATE POLICY "Parents can update their children"
ON public.child_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = parent_user_id);

CREATE POLICY "Parents can delete their children"
ON public.child_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = parent_user_id);

-- Team managers can view children on their teams
CREATE POLICY "Team managers can view team children"
ON public.child_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.team_child_members tcm
    JOIN public.teams t ON t.id = tcm.team_id
    WHERE tcm.child_id = child_profiles.id
    AND (
      public.is_team_manager(auth.uid(), t.id)
      OR public.is_club_admin(auth.uid(), t.club_id)
    )
  )
);

-- 8. Add policies for team_child_members
CREATE POLICY "Parents can view their children's teams"
ON public.team_child_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.child_profiles cp
    WHERE cp.id = team_child_members.child_id
    AND cp.parent_user_id = auth.uid()
  )
);

CREATE POLICY "Team managers can manage roster"
ON public.team_child_members
FOR ALL
TO authenticated
USING (
  public.is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = team_child_members.team_id
    AND public.is_club_admin(auth.uid(), t.club_id)
  )
)
WITH CHECK (
  public.is_team_manager(auth.uid(), team_id)
  OR EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = team_child_members.team_id
    AND public.is_club_admin(auth.uid(), t.club_id)
  )
);

CREATE POLICY "Team members can view roster"
ON public.team_child_members
FOR SELECT
TO authenticated
USING (
  public.is_team_member(auth.uid(), team_id)
);

-- 9. Add updated_at trigger
CREATE TRIGGER update_child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Helper function to check if user is a parent of a child
CREATE OR REPLACE FUNCTION public.is_parent_of(
  _user_id UUID,
  _child_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.child_profiles
    WHERE id = _child_id
    AND parent_user_id = _user_id
  )
$$;