-- Create storage bucket for category icons
INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-icons', 'category-icons', true);

-- Allow anyone to view category icons (public bucket)
CREATE POLICY "Category icons are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-icons');

-- Allow admins to upload category icons
CREATE POLICY "Admins can upload category icons"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-icons' AND is_admin(auth.uid()));

-- Allow admins to update category icons
CREATE POLICY "Admins can update category icons"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-icons' AND is_admin(auth.uid()));

-- Allow admins to delete category icons
CREATE POLICY "Admins can delete category icons"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-icons' AND is_admin(auth.uid()));