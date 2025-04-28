import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

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
    })

    return NextResponse.json({
      content: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la communication avec l\'IA' },
      { status: 500 }
    )
  }
} 