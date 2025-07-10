-- Create message_reactions table
CREATE TABLE message_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view reactions
CREATE POLICY "Users can view reactions"
ON message_reactions
FOR SELECT
TO authenticated
USING (
    message_id IN (
        SELECT id FROM chat_messages 
        WHERE conversation_id IN (
            SELECT conversation_id FROM chat_messages 
            WHERE user_id = auth.uid()
        )
    )
);

-- Create policy to allow users to add reactions
CREATE POLICY "Users can add reactions"
ON message_reactions
FOR INSERT
TO authenticated
WITH CHECK (
    message_id IN (
        SELECT id FROM chat_messages 
        WHERE conversation_id IN (
            SELECT conversation_id FROM chat_messages 
            WHERE user_id = auth.uid()
        )
    )
);

-- Create policy to allow users to remove their own reactions
CREATE POLICY "Users can remove their own reactions"
ON message_reactions
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON message_reactions(user_id); 