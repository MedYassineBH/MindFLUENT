-- Drop existing tables and policies
DROP TABLE IF EXISTS chat_messages CASCADE;

-- Recreate the chat_messages table
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    conversation_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies with simpler conditions
CREATE POLICY chat_messages_select_policy ON chat_messages 
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY chat_messages_insert_policy ON chat_messages 
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_messages_update_policy ON chat_messages 
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_messages_delete_policy ON chat_messages 
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX chat_messages_conversation_id_idx ON chat_messages(conversation_id);
CREATE INDEX chat_messages_created_at_idx ON chat_messages(created_at); 