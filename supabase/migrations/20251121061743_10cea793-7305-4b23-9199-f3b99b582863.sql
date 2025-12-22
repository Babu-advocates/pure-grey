-- Insert admin record
INSERT INTO admin (username, email)
VALUES ('krfireworks', 'krfireworks7@gmail.com')
ON CONFLICT (email) DO NOTHING;