-- =================================================================
-- FIX ADMIN ACCESS: RLS POLICIES (UPDATED)
-- =================================================================
-- Run this script in your Supabase Dashboard > SQL Editor
-- This uses DROP POLICY to avoid "already exists" errors.

-- 1. FIX PROFILES POLICY
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  (SELECT count(*) FROM admin WHERE user_id = auth.uid()) > 0
);

-- 2. FIX ORDERS POLICY
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  (SELECT count(*) FROM admin WHERE user_id = auth.uid()) > 0
);

-- 3. ENSURE RLS IS ENABLED (Just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
