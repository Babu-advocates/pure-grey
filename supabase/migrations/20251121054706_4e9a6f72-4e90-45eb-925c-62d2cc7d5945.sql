-- Add email column to admin table
ALTER TABLE public.admin 
ADD COLUMN IF NOT EXISTS email text UNIQUE;

-- Make user_id nullable temporarily (will be populated on first login)
ALTER TABLE public.admin 
ALTER COLUMN user_id DROP NOT NULL;

-- Insert the pre-approved admin email without user_id
INSERT INTO public.admin (email, username)
VALUES ('krfireworks7@gmail.com', 'KrFireworks')
ON CONFLICT (email) DO NOTHING;

-- Create function to check if email is approved admin
CREATE OR REPLACE FUNCTION public.is_approved_admin_email(_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin
    WHERE email = _email
  )
$function$;