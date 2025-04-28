"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface GrammarRule {
  type: 'rule'
  text: string
  examples: string[]
}

interface GrammarExercise {
  type: 'exercise'
  question: string
  answer: string
  hint: string
}

type GrammarContent = GrammarRule | GrammarExercise

interface GrammarLesson {
  id: number
  title: string
  description: string
  content: GrammarContent[]
}

const grammarLessons: GrammarLesson[] = [
  {
    id: 1,
    title: 'Les articles',
    description: 'Apprenez à utiliser les articles définis et indéfinis',
    content: [
      {
        type: 'rule',
        text: 'Les articles définis: le, la, les',
        examples: ['le chat', 'la maison', 'les enfants']
      },
      {
        type: 'rule',
        text: 'Les articles indéfinis: un, une, des',
        examples: ['un livre', 'une voiture', 'des amis']
      },
      {
        type: 'exercise',
        question: 'Complétez avec l\'article approprié: ___ chat est noir.',
        answer: 'Le',
        hint: 'Utilisez l\'article défini masculin singulier'
      }
    ]
  },
  {
    id: 2,
    title: 'Les verbes',
    description: 'Conjugaison des verbes au présent',
    content: [
      {
        type: 'rule',
        text: 'Verbes du premier groupe (-er)',
        examples: ['je mange', 'tu manges', 'il mange']
      },
      {
        type: 'rule',
        text: 'Verbes du deuxième groupe (-ir)',
        examples: ['je finis', 'tu finis', 'il finit']
      },
      {
        type: 'exercise',
        question: 'Conjuguez le verbe "manger" à la première personne du singulier: Je ___',
        answer: 'mange',
        hint: 'Utilisez la terminaison -e pour la première personne du singulier'
      }
    ]
  },
  {
    id: 3,
    title: 'Les adjectifs',
    description: 'Accord et placement des adjectifs',
    content: [
      {
        type: 'rule',
        text: 'Accord des adjectifs avec le nom',
        examples: ['un grand arbre', 'une grande maison', 'des grands arbres']
      },
      {
        type: 'rule',
        text: 'Placement des adjectifs',
        examples: ['un beau chat', 'une belle voiture', 'un petit garçon']
      },
      {
        type: 'exercise',
        question: 'Accordez l\'adjectif: une ___ maison (grand)',
        answer: 'grande',
        hint: 'L\'adjectif s\'accorde en genre avec le nom'
      }
    ]
  },
  {
    id: 4,
    title: 'Les pronoms',
    description: 'Utilisation des pronoms personnels et possessifs',
    content: [
      {
        type: 'rule',
        text: 'Pronoms personnels sujets',
        examples: ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles']
      },
      {
        type: 'rule',
        text: 'Pronoms possessifs',
        examples: ['mon', 'ton', 'son', 'notre', 'votre', 'leur']
      },
      {
        type: 'exercise',
        question: 'Remplacez le nom par un pronom: Je vois Marie → Je ___ vois',
        answer: 'la',
        hint: 'Utilisez le pronom complément d\'objet direct'
      }
    ]
  }
]

export default function GrammarPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [exerciseAnswer, setExerciseAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Grammaire</h1>
        <p>Veuillez vous connecter pour accéder aux leçons de grammaire.</p>
      </div>
    )
  }

  const handleExerciseSubmit = (correctAnswer: string) => {
    if (exerciseAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      toast.success('Bonne réponse !')
      setExerciseAnswer('')
      setShowHint(false)
    } else {
      toast.error('Mauvaise réponse. Essayez encore !')
      setShowHint(true)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Grammaire</h1>
      
      {selectedLesson === null ? (
        <div className="grid gap-6 md:grid-cols-2">
          {grammarLessons.map((lesson) => (
            <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{lesson.description}</p>
                <Button onClick={() => setSelectedLesson(lesson.id)}>
                  Commencer la leçon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => {
              setSelectedLesson(null)
              setExerciseAnswer('')
              setShowHint(false)
            }}
          >
            Retour aux leçons
          </Button>
          
          {grammarLessons
            .filter((lesson) => lesson.id === selectedLesson)
            .map((lesson) => (
              <div key={lesson.id} className="space-y-6">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
                <div className="space-y-4">
                  {lesson.content.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        {item.type === 'rule' ? (
                          <>
                            <h3 className="font-medium mb-2">{item.text}</h3>
                            <div className="space-y-2">
                              {item.examples.map((example, i) => (
                                <p key={i} className="text-muted-foreground">
                                  {example}
                                </p>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <p className="font-medium">{item.question}</p>
                            <div className="flex gap-4">
                              <Input
                                value={exerciseAnswer}
                                onChange={(e) => setExerciseAnswer(e.target.value)}
                                placeholder="Votre réponse"
                              />
                              <Button
                                onClick={() => handleExerciseSubmit(item.answer)}
                              >
                                Vérifier
                              </Button>
                            </div>
                            {showHint && (
                              <p className="text-sm text-muted-foreground">
                                Indice: {item.hint}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
} 