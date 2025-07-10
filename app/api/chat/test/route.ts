import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { testGeminiConnection } from '@/services/geminiService'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Test Supabase connection
    const { data: supabaseTest, error: supabaseError } = await supabase
      .from('chat_messages')
      .select('count')
      .limit(1)

    if (supabaseError) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Supabase connection failed',
          error: supabaseError.message 
        },
        { status: 500 }
      )
    }

    // Test Gemini connection
    const geminiTest = await testGeminiConnection()
    if (!geminiTest.success) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Gemini connection failed',
          error: geminiTest.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      message: 'All connections working',
      supabase: 'connected',
      gemini: 'connected'
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Test failed',
        error: error.message 
      },
      { status: 500 }
    )
  }
} 