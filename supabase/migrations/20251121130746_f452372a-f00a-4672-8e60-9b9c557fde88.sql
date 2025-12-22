-- Link the existing admin record to the authenticated user
UPDATE admin 
SET user_id = '23812728-2ae0-4785-b97c-37afbc940d59'
WHERE email = 'krfireworks7@gmail.com';