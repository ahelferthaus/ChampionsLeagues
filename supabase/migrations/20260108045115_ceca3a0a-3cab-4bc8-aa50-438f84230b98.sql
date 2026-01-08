-- =============================================
-- CHAMPIONS - Sports Team Management Platform
-- Database Schema Migration
-- =============================================

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('club_admin', 'team_manager', 'parent', 'player');

-- =============================================
-- PROFILES TABLE
-- Stores additional user information
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES TABLE
-- Stores user roles separately for security
-- =============================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- LEAGUES TABLE
-- Top level organization
-- =============================================
CREATE TABLE public.leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CLUBS TABLE
-- Organizations within leagues (e.g., Albion SC)
-- =============================================
CREATE TABLE public.clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TEAMS TABLE
-- Individual teams within clubs (e.g., U14 Boys)
-- =============================================
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age_group TEXT,
    gender TEXT,
    sport TEXT DEFAULT 'Soccer',
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SEASONS TABLE
-- Seasons for teams (Fall 2024, Spring 2025)
-- =============================================
CREATE TABLE public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TEAM MEMBERS TABLE
-- Links users to teams with their role on that team
-- =============================================
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    jersey_number TEXT,
    position TEXT,
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CLUB ADMINS TABLE
-- Links club admins to clubs
-- =============================================
CREATE TABLE public.club_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (club_id, user_id)
);

ALTER TABLE public.club_admins ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS
-- Used in RLS policies to prevent recursion
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Check if user is a club admin for a specific club
CREATE OR REPLACE FUNCTION public.is_club_admin(_user_id UUID, _club_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.club_admins
        WHERE user_id = _user_id
          AND club_id = _club_id
    )
$$;

-- Check if user is a team manager for a specific team
CREATE OR REPLACE FUNCTION public.is_team_manager(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.team_members
        WHERE user_id = _user_id
          AND team_id = _team_id
          AND role = 'team_manager'
    )
$$;

-- Check if user is a member of a specific team
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.team_members
        WHERE user_id = _user_id
          AND team_id = _team_id
    )
$$;

-- =============================================
-- TRIGGER FUNCTION FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON public.leagues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON public.seasons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER FOR AUTO-CREATING PROFILE
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view profiles of team members"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm1
            JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
            WHERE tm1.user_id = auth.uid()
              AND tm2.user_id = profiles.user_id
        )
    );

-- USER ROLES POLICIES
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
    ON public.user_roles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- LEAGUES POLICIES (public read for now)
CREATE POLICY "Anyone can view leagues"
    ON public.leagues FOR SELECT
    TO authenticated
    USING (true);

-- CLUBS POLICIES
CREATE POLICY "Anyone can view clubs"
    ON public.clubs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Club admins can create clubs"
    ON public.clubs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Club admins can update their clubs"
    ON public.clubs FOR UPDATE
    TO authenticated
    USING (public.is_club_admin(auth.uid(), id));

-- TEAMS POLICIES
CREATE POLICY "Team members can view their teams"
    ON public.teams FOR SELECT
    TO authenticated
    USING (
        public.is_team_member(auth.uid(), id) OR
        public.is_club_admin(auth.uid(), club_id)
    );

CREATE POLICY "Club admins and team managers can create teams"
    ON public.teams FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = created_by AND
        public.is_club_admin(auth.uid(), club_id)
    );

CREATE POLICY "Team managers can update their teams"
    ON public.teams FOR UPDATE
    TO authenticated
    USING (
        public.is_team_manager(auth.uid(), id) OR
        public.is_club_admin(auth.uid(), club_id)
    );

-- SEASONS POLICIES
CREATE POLICY "Team members can view seasons"
    ON public.seasons FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = seasons.team_id
              AND (public.is_team_member(auth.uid(), t.id) OR public.is_club_admin(auth.uid(), t.club_id))
        )
    );

CREATE POLICY "Team managers can create seasons"
    ON public.seasons FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = seasons.team_id
              AND (public.is_team_manager(auth.uid(), t.id) OR public.is_club_admin(auth.uid(), t.club_id))
        )
    );

CREATE POLICY "Team managers can update seasons"
    ON public.seasons FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = seasons.team_id
              AND (public.is_team_manager(auth.uid(), t.id) OR public.is_club_admin(auth.uid(), t.club_id))
        )
    );

-- TEAM MEMBERS POLICIES
CREATE POLICY "Team members can view other members"
    ON public.team_members FOR SELECT
    TO authenticated
    USING (
        public.is_team_member(auth.uid(), team_id) OR
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = team_members.team_id
              AND public.is_club_admin(auth.uid(), t.club_id)
        )
    );

CREATE POLICY "Team managers can add members"
    ON public.team_members FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_team_manager(auth.uid(), team_id) OR
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = team_members.team_id
              AND public.is_club_admin(auth.uid(), t.club_id)
        )
    );

CREATE POLICY "Team managers can update members"
    ON public.team_members FOR UPDATE
    TO authenticated
    USING (
        public.is_team_manager(auth.uid(), team_id) OR
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = team_members.team_id
              AND public.is_club_admin(auth.uid(), t.club_id)
        )
    );

CREATE POLICY "Team managers can remove members"
    ON public.team_members FOR DELETE
    TO authenticated
    USING (
        public.is_team_manager(auth.uid(), team_id) OR
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = team_members.team_id
              AND public.is_club_admin(auth.uid(), t.club_id)
        )
    );

-- CLUB ADMINS POLICIES
CREATE POLICY "Club admins can view admins for their clubs"
    ON public.club_admins FOR SELECT
    TO authenticated
    USING (public.is_club_admin(auth.uid(), club_id) OR auth.uid() = user_id);

CREATE POLICY "Club admins can add other admins"
    ON public.club_admins FOR INSERT
    TO authenticated
    WITH CHECK (public.is_club_admin(auth.uid(), club_id) OR auth.uid() = user_id);