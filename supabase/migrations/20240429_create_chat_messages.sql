-- Drop existing tables if they exist
DROP TABLE IF EXISTS message_reactions;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_history;

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    conversation_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON chat_messages;

-- Create policy to allow users to select their own messages
CREATE POLICY "Users can view their own messages"
ON chat_messages
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create policy to allow users to insert their own messages
CREATE POLICY "Users can insert their own messages"
ON chat_messages
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create policy to allow users to update their own messages
CREATE POLICY "Users can update their own messages"
ON chat_messages
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own messages"
ON chat_messages
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at); 