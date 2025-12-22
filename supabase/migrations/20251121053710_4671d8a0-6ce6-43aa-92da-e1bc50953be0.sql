-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Admins can insert into admin table" ON public.admin;

-- Create a new policy that allows authenticated users to insert themselves
-- This is needed for the initial admin creation
CREATE POLICY "Allow initial admin creation"
  ON public.admin
  FOR INSERT
  TO authenticated
  WITH CHECK (true);