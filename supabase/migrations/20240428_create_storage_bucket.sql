-- Create a new storage bucket for avatars
SELECT storage.create_bucket('avatars', 'avatars', true);

-- Allow public access to read avatars
SELECT storage.create_policy(
  'Allow public to read avatars',
  'avatars',
  'SELECT',
  'public',
  'true'
);

-- Allow authenticated users to upload their own avatar
SELECT storage.create_policy(
  'Allow users to upload their own avatar',
  'avatars',
  'INSERT',
  'authenticated',
  'bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow users to update their own avatar
SELECT storage.create_policy(
  'Allow users to update their own avatar',
  'avatars',
  'UPDATE',
  'authenticated',
  'bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow users to delete their own avatar
SELECT storage.create_policy(
  'Allow users to delete their own avatar',
  'avatars',
  'DELETE',
  'authenticated',
  'bucket_id = ''avatars'' AND auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow public access to read avatars
SELECT storage.create_policy(
  'Allow public to read avatars',
  'storage.objects',
  'SELECT',
  'public',
  'bucket_id = ''avatars'''
); 