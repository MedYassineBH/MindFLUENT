import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateGeminiChatCompletion } from '@/services/geminiService'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { message, userId, language = 'en', conversationId } = await req.json()

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      )
    }

    // Get conversation history
    const { data: conversationHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (historyError) {
      console.error('Error fetching chat history:', historyError)
      return NextResponse.json(
        { error: 'Failed to fetch chat history' },
        { status: 500 }
      )
    }

    const messages = [
      {
        role: 'system',
        content: `You are a helpful language learning assistant. Respond in ${language}. Help users practice their language skills, explain grammar concepts, and provide examples.`,
      },
      ...(conversationHistory?.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })) || []),
      { role: 'user', content: message },
    ]

    try {
      const completion = await generateGeminiChatCompletion(messages)
      const response = completion.content

      if (!response) {
        throw new Error('No response from Gemini')
      }

      return NextResponse.json({ response })
    } catch (error: any) {
      console.error('Error with Gemini API:', error)
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    )
  }
} 