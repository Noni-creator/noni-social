-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access to read files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id IN ('videos', 'images'));

-- 3. Allow Anonymous/Authenticated Uploads (For testing purposes, adjust for production)
-- This allows anyone with the anon key to upload. In production, you should restrict to auth.uid()
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('videos', 'images'));

-- 4. Allow users to update/delete their own files (optional but good practice)
CREATE POLICY "Own File Management" ON storage.objects
FOR ALL USING (auth.uid() = owner);
