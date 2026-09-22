-- ==============================================================================
-- 003_storage_buckets_and_policies.sql
-- Storage Buckets & RLS for UIKEY AI Studio
-- ==============================================================================

-- 1. Insert Storage Buckets if they don't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('galleries', 'galleries', true, 26214400, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('receipts', 'receipts', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies for 'galleries' bucket
-- Public read access for client proofing galleries
CREATE POLICY "Public can view gallery photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'galleries');

-- Authenticated studio owners can upload gallery photos
CREATE POLICY "Studio owners can upload gallery photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'galleries'
);

-- Studio owners can update gallery photos
CREATE POLICY "Studio owners can update gallery photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'galleries');

-- Studio owners can delete gallery photos
CREATE POLICY "Studio owners can delete gallery photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'galleries');

-- 3. Storage RLS Policies for 'receipts' bucket
-- Clients can upload UPI payment proof screenshots (anonymous or authenticated)
CREATE POLICY "Clients can upload payment receipts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'receipts');

-- Studio owners can view payment receipts
CREATE POLICY "Studio owners can view payment receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'receipts');

-- 4. Storage RLS Policies for 'avatars' bucket
-- Anyone can view studio avatars & logos
CREATE POLICY "Public can view studio avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated studio owners can upload/modify studio logos
CREATE POLICY "Studio owners can upload studio avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Studio owners can update studio avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');
