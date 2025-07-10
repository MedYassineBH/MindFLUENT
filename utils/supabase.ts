import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface MessageReaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  language: string
  created_at: string
  updated_at: string
  is_edited: boolean
  message_reactions?: MessageReaction[]
}

export interface TypingIndicator {
  user_id: string
  conversation_id: string
  last_typed: string
}

// Message operations
export async function saveMessage(message: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at' | 'message_reactions'>) {
  return supabase
    .from('chat_messages')
    .insert(message)
    .select('id, created_at, updated_at')
    .single();
}

export async function updateMessage(id: string, content: string) {
  return supabase
    .from('chat_messages')
    .update({ content, is_edited: true, updated_at: new Date().toISOString() })
    .eq('id', id)
}

export async function deleteMessage(id: string) {
  return supabase.from('chat_messages').delete().eq('id', id)
}

export async function getConversationMessages(conversationId: string) {
  return supabase
    .from('chat_messages')
    .select('*, message_reactions(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

// Reaction operations
export async function addReaction(reaction: Omit<MessageReaction, 'id' | 'created_at'>) {
  return supabase.from('message_reactions').insert(reaction)
}

export async function removeReaction(messageId: string, userId: string, emoji: string) {
  return supabase
    .from('message_reactions')
    .delete()
    .match({ message_id: messageId, user_id: userId, emoji })
}

// Typing indicator operations
const TYPING_CHANNEL = 'typing_indicators'

export function subscribeToTyping(conversationId: string, callback: (payload: TypingIndicator) => void) {
  return supabase
    .channel(TYPING_CHANNEL)
    .on(
      'broadcast',
      { event: `typing:${conversationId}` },
      ({ payload }) => callback(payload as TypingIndicator)
    )
    .subscribe()
}

export async function sendTypingIndicator(conversationId: string, userId: string) {
  return supabase
    .channel(TYPING_CHANNEL)
    .send({
      type: 'broadcast',
      event: `typing:${conversationId}`,
      payload: {
        user_id: userId,
        conversation_id: conversationId,
        last_typed: new Date().toISOString(),
      },
    })
} 