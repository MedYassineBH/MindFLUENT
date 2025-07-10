'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { useAuth } from '@/contexts/AuthContext';
import {
  saveMessage,
  updateMessage,
  deleteMessage,
  getConversationMessages,
  addReaction,
  removeReaction,
  subscribeToTyping,
  sendTypingIndicator,
  type ChatMessage,
  type TypingIndicator,
  supabase
} from '@/utils/supabase';
import { format } from 'date-fns';
import { Pencil, Trash2, Check, X, User as UserIcon, MessageSquare, Send, Loader2 } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

function Avatar({ user, size = 32 }: { user: any, size?: number }) {
  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt="avatar"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  if (user?.email) {
    const initials = user.email[0].toUpperCase();
    return (
      <div
        className="rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size }}
      >
        {initials}
      </div>
    );
  }
  return <UserIcon size={size} className="text-gray-400" />;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export default function Chat() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user?.id) return;

    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
        .eq('language', language)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error(t('errorLoadingMessages'));
    }
  };

  const saveMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user?.id,
            conversation_id: conversationId,
            role: message.role,
            content: message.content,
            language: language
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    
    if (!trimmedMessage || !user?.id) {
      toast.error(t('pleaseLogin'));
      return;
    }
    
    setIsLoading(true);
    setNewMessage('');

    let userMessageId: string | null = null;

    try {
      console.log('Attempting to save message with user ID:', user.id);
      console.log('Conversation ID:', conversationId);
      
      // Save user message
      const { data: userMessage, error: saveError } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: user.id,
          conversation_id: conversationId,
          role: 'user',
          content: trimmedMessage,
          language: language
        }])
        .select()
        .single();

      if (saveError) {
        console.error('Supabase error details:', saveError);
        throw new Error(`Failed to save user message: ${saveError.message}`);
      }

      if (!userMessage) {
        throw new Error('No user message data returned');
      }

      userMessageId = userMessage.id;
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          language: language,
          userId: user.id,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get AI response');
      }
      
      const data = await response.json();
      
      // Save AI response
      const { data: assistantMessage, error: assistantError } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: user.id,
          conversation_id: conversationId,
          role: 'assistant',
          content: data.response,
          language: language
        }])
        .select()
        .single();

      if (assistantError || !assistantMessage) {
        throw new Error('Failed to save assistant message');
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error in chat:', error);
      toast.error(error.message || t('errorSendingMessage'));
      
      // Clean up user message if it was saved but we failed to get/save AI response
      if (userMessageId) {
        try {
          await supabase
            .from('chat_messages')
            .delete()
            .eq('id', userMessageId);
          
          setMessages(prev => prev.filter(msg => msg.id !== userMessageId));
        } catch (cleanupError) {
          console.error('Error cleaning up user message:', cleanupError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user?.id)
        .eq('conversation_id', conversationId);

      if (error) throw error;
      
      setMessages([]);
      setConversationId(uuidv4());
      toast.success(t('chatCleared'));
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error(t('errorClearingChat'));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <MessageSquare className="w-12 h-12 mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2">{t('pleaseLogin')}</h2>
        <p className="text-center text-gray-600">{t('loginToChat')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('chat')}</h2>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          disabled={isLoading || messages.length === 0}
        >
          <Trash2 className="w-5 h-5" />
          {t('clearChat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">{t('startConversation')}</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              {message.content}
            </div>
          ))
        )}
        {isLoading && (
          <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
            <div className="animate-pulse">{t('thinking')}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('typeMessage')}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isLoading || !newMessage.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
} 