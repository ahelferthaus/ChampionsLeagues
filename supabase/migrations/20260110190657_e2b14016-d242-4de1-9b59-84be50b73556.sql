-- Add primary_sport to profiles for personalization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_sport TEXT;