/*
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

CREATE TABLE IF NOT EXISTS voice_practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  text text NOT NULL,
  audio_url text,
  feedback jsonb DEFAULT '{}',
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their voice practices"
  ON voice_practices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);