-- Drop the existing function first
DROP FUNCTION IF EXISTS verify_admin_credentials(TEXT, TEXT);

-- Ensure pgcrypto extension is created in the extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Update admin password hash if not already set
UPDATE admin 
SET password_hash = extensions.crypt('admin123', extensions.gen_salt('bf'))
WHERE email = 'krfireworks7@gmail.com' AND password_hash IS NULL;

-- Create function with proper schema reference
CREATE OR REPLACE FUNCTION verify_admin_credentials(
  _email TEXT,
  _password TEXT
)
RETURNS TABLE(
  admin_id UUID,
  username TEXT,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, admin.username, admin.email
  FROM admin
  WHERE admin.email = _email
    AND password_hash = extensions.crypt(_password, password_hash);
END;
$$;