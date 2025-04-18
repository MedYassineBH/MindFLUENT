/*
  # Flashcard System Schema

  1. New Tables
    - `flashcard_decks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `language` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `flashcards`
      - `id` (uuid, primary key)
      - `deck_id` (uuid, references flashcard_decks)
      - `front` (text)
      - `back` (text)
      - `example` (text)
      - `audio_url` (text)
      - `last_reviewed` (timestamp)
      - `review_count` (int)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS flashcard_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  language text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid REFERENCES flashcard_decks ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  example text,
  audio_url text,
  last_reviewed timestamptz,
  review_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own decks"
  ON flashcard_decks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage flashcards in their decks"
  ON flashcards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_decks
      WHERE id = flashcards.deck_id
      AND user_id = auth.uid()
    )
  );