/* sqlfluff:disable
  # Voice Practice System Schema

  1. New Tables
    - `voice_practices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `text` (text) - The text to practice
      - `audio_url` (text) - URL to the recorded audio
      - `feedback` (jsonb) - AI feedback on pronunciation
      - `score` (int) - Pronunciation score (0-100)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

create table if not exists voice_practices (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    text text not null,
    audio_url text,
    feedback jsonb default '{}'::jsonb,
    score integer default 0,
    created_at timestamptz default now()
);

-- Ensure the database supports Row Level Security (RLS)
do $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated;
  END IF;
END $$;

alter table voice_practices enable row level security;

create policy "Users can manage their voice practices"
on voice_practices
for all
to authenticated
using (current_setting('request.jwt.claims.user_id', true) = user_id::text)
with check (current_setting('request.jwt.claims.user_id', true) = user_id::text);
