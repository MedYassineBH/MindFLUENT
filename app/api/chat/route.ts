import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Save user message to database
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage.role === 'user') {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        role: 'user',
        content: lastUserMessage.content,
        language: 'fr' // Default to French for now
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Vous êtes un assistant IA spécialisé dans l'apprentissage du français. 
          Votre rôle est d'aider les utilisateurs à améliorer leur français en :
          1. Répondant à leurs questions sur la grammaire, le vocabulaire et la prononciation
          2. Corrigeant leurs erreurs de manière constructive
          3. Fournissant des exemples et des explications claires
          4. Adaptant votre niveau de langue à celui de l'utilisateur
          5. Encourageant la pratique et l'apprentissage continu
          
          Répondez toujours en français, sauf si l'utilisateur demande explicitement une réponse dans une autre langue.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    })

    // Create a new TransformStream
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Process the stream
    const processStream = async () => {
      let fullResponse = ''
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            await writer.write(encoder.encode(content))
          }
        }
      } catch (error) {
        console.error('Error in stream processing:', error)
        await writer.write(encoder.encode('\n\nUne erreur est survenue. Veuillez réessayer.'))
      } finally {
        // Save assistant's response to database
        if (fullResponse) {
          try {
            await supabase.from('chat_messages').insert({
              user_id: userId,
              role: 'assistant',
              content: fullResponse,
              language: 'fr' // Default to French for now
            })
          } catch (error) {
            console.error('Error saving assistant message:', error)
          }
        }
        await writer.close()
      }
    }

    // Start processing the stream
    processStream()

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la communication avec l\'IA' },
      { status: 500 }
    )
  }
} 