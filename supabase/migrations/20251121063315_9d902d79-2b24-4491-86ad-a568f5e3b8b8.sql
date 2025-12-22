-- Add password_hash column to admin table
ALTER TABLE admin ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update existing admin with hashed password (admin123)
UPDATE admin 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'krfireworks7@gmail.com';

-- Create function to verify admin credentials
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
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT id, admin.username, admin.email
  FROM admin
  WHERE admin.email = _email
    AND password_hash = crypt(_password, password_hash);
END;
$$;