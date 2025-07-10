CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the decks table
CREATE TABLE decks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  title text NOT NULL,
  description text,
  progress integer DEFAULT 0,
  cards jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own decks"
  ON decks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decks"
  ON decks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks"
  ON decks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks"
  ON decks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX decks_user_id_idx ON decks(user_id);
CREATE INDEX decks_created_at_idx ON decks(created_at); 