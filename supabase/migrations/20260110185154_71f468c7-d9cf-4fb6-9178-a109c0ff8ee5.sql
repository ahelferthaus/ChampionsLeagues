-- Add venmo_handle to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS venmo_handle TEXT;

-- Create table for Stripe Connect accounts (clubs and managers)
CREATE TABLE public.connected_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  club_id UUID REFERENCES public.clubs(id),
  team_id UUID REFERENCES public.teams(id),
  stripe_account_id TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'express', -- 'express' or 'standard'
  onboarding_complete BOOLEAN DEFAULT false,
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table (what managers/clubs charge for)
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id),
  club_id UUID REFERENCES public.clubs(id),
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'trip', -- 'trip', 'equipment', 'club_fee', 'tournament', 'other'
  total_amount DECIMAL(10,2) NOT NULL,
  receipt_url TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'partially_paid', 'paid', 'cancelled'
  split_type TEXT NOT NULL DEFAULT 'equal', -- 'equal', 'custom'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense shares (individual parent portions)
CREATE TABLE public.expense_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  child_id UUID REFERENCES public.child_profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'waived'
  payment_method TEXT, -- 'card', 'ach', 'venmo', 'cash', 'other'
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_shares ENABLE ROW LEVEL SECURITY;

-- RLS for connected_accounts
CREATE POLICY "Users can view their own connected accounts" 
ON public.connected_accounts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connected accounts" 
ON public.connected_accounts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connected accounts" 
ON public.connected_accounts FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS for expenses (team members can view, managers can create/edit)
CREATE POLICY "Team members can view expenses" 
ON public.expenses FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_members.team_id = expenses.team_id 
    AND team_members.user_id = auth.uid()
  )
);

CREATE POLICY "Managers can create expenses" 
ON public.expenses FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_members.team_id = expenses.team_id 
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('team_manager', 'club_admin')
  )
);

CREATE POLICY "Managers can update their expenses" 
ON public.expenses FOR UPDATE 
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_members.team_id = expenses.team_id 
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('team_manager', 'club_admin')
  )
);

-- RLS for expense_shares
CREATE POLICY "Users can view their own expense shares" 
ON public.expense_shares FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.expenses e
    JOIN public.team_members tm ON tm.team_id = e.team_id
    WHERE e.id = expense_shares.expense_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('team_manager', 'club_admin')
  )
);

CREATE POLICY "Managers can create expense shares" 
ON public.expense_shares FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.expenses e
    JOIN public.team_members tm ON tm.team_id = e.team_id
    WHERE e.id = expense_shares.expense_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('team_manager', 'club_admin')
  )
);

CREATE POLICY "Users and managers can update expense shares" 
ON public.expense_shares FOR UPDATE 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.expenses e
    JOIN public.team_members tm ON tm.team_id = e.team_id
    WHERE e.id = expense_shares.expense_id
    AND tm.user_id = auth.uid()
    AND tm.role IN ('team_manager', 'club_admin')
  )
);

-- Create indexes for performance
CREATE INDEX idx_expenses_team_id ON public.expenses(team_id);
CREATE INDEX idx_expenses_created_by ON public.expenses(created_by);
CREATE INDEX idx_expense_shares_expense_id ON public.expense_shares(expense_id);
CREATE INDEX idx_expense_shares_user_id ON public.expense_shares(user_id);
CREATE INDEX idx_connected_accounts_user_id ON public.connected_accounts(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expense_shares_updated_at
BEFORE UPDATE ON public.expense_shares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connected_accounts_updated_at
BEFORE UPDATE ON public.connected_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();