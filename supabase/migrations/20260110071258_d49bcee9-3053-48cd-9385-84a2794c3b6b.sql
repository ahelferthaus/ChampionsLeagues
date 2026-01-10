-- Add INSERT policy for profiles table
-- This ensures the trigger works properly and allows explicit client-side profile creation if needed
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);