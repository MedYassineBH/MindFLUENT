'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Progress } from '@/components/ui/progress'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface Exercise {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

const exercises: Record<string, Exercise[]> = {
  'basic-grammar': [
    {
      id: '1',
      question: 'Choisissez l\'article correct : ___ livre est sur la table.',
      options: ['le', 'la', 'les', 'un'],
      correctAnswer: 'le',
      explanation: 'Le mot "livre" est masculin singulier, donc on utilise l\'article défini "le".'
    },
    {
      id: '2',
      question: 'Complétez avec le bon article : ___ pomme est rouge.',
      options: ['le', 'la', 'les', 'une'],
      correctAnswer: 'la',
      explanation: 'Le mot "pomme" est féminin singulier, donc on utilise l\'article défini "la".'
    },
    {
      id: '3',
      question: 'Quel est le pluriel de "un chat" ?',
      options: ['le chat', 'les chats', 'des chats', 'un chats'],
      correctAnswer: 'des chats',
      explanation: 'Pour former le pluriel indéfini, on utilise "des" + nom au pluriel.'
    }
  ],
  'intermediate-grammar': [
    {
      id: '1',
      question: 'Choisissez le temps correct : "Hier, je ___ au cinéma."',
      options: ['vais', 'suis allé', 'irai', 'allais'],
      correctAnswer: 'suis allé',
      explanation: 'Pour une action terminée dans le passé, on utilise le passé composé.'
    },
    {
      id: '2',
      question: 'Complétez avec le pronom relatif correct : "La personne ___ j\'ai parlé."',
      options: ['que', 'qui', 'à qui', 'dont'],
      correctAnswer: 'à qui',
      explanation: 'Avec le verbe "parler à", on utilise "à qui" comme pronom relatif.'
    },
    {
      id: '3',
      question: 'Quel est le conditionnel de "faire" à la première personne ?',
      options: ['je fais', 'je ferais', 'je ferai', 'je faisais'],
      correctAnswer: 'je ferais',
      explanation: 'Le conditionnel présent exprime une action hypothétique.'
    }
  ],
  'advanced-grammar': [
    {
      id: '1',
      question: 'Complétez : "Si j\'___ (savoir), je vous ___ (dire)."',
      options: ['savais / dirais', 'sais / dis', 'su / aurais dit', 'saurais / dirai'],
      correctAnswer: 'savais / dirais',
      explanation: 'Dans une hypothèse présente, on utilise l\'imparfait + conditionnel présent.'
    },
    {
      id: '2',
      question: 'Choisissez la forme correcte du subjonctif : "Il faut que tu ___ ce livre."',
      options: ['lis', 'lises', 'liras', 'lirais'],
      correctAnswer: 'lises',
      explanation: 'Après "il faut que", on utilise le subjonctif présent.'
    },
    {
      id: '3',
      question: 'Identifiez la valeur du participe présent : "Les enfants dormant profondément, nous parlions doucement."',
      options: ['cause', 'simultanéité', 'condition', 'opposition'],
      correctAnswer: 'simultanéité',
      explanation: 'Le participe présent exprime ici deux actions simultanées.'
    }
  ]
}

export default function GrammarLessonPage({ params }: { params: { level: string } }) {
  const { t } = useLanguage()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentLevelExercises = exercises[params.level] || []
  const exercise = currentLevelExercises[currentExercise]

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowExplanation(true)

    if (answer === exercise.correctAnswer) {
      setScore(score + 1)
      toast.success('Correct !')
    } else {
      toast.error('Incorrect.')
    }
  }

  const nextExercise = () => {
    if (currentExercise < currentLevelExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setShowExplanation(false)
      setSelectedAnswer(null)
    }
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('grammarTitle')}</h1>
        <p>Aucun exercice trouvé pour ce niveau.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('grammarTitle')}</h1>
        <Progress
          value={(currentExercise / currentLevelExercises.length) * 100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Exercise {currentExercise + 1}/{currentLevelExercises.length}</span>
          <span>Score: {score}/{currentLevelExercises.length}</span>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{exercise.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {exercise.options.map((option) => (
              <Button
                key={option}
                variant={
                  selectedAnswer === null ? 'outline' :
                  option === exercise.correctAnswer ? 'default' :
                  option === selectedAnswer ? 'destructive' : 'outline'
                }
                className="w-full justify-start text-left"
                onClick={() => !selectedAnswer && handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
                {selectedAnswer !== null && option === exercise.correctAnswer && (
                  <Check className="ml-2 h-4 w-4" />
                )}
                {selectedAnswer === option && option !== exercise.correctAnswer && (
                  <X className="ml-2 h-4 w-4" />
                )}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Explication :</p>
              <p>{exercise.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showExplanation && (
        <div className="flex justify-end">
          <Button
            onClick={nextExercise}
            disabled={currentExercise >= currentLevelExercises.length - 1}
          >
            {currentExercise >= currentLevelExercises.length - 1 
              ? t('finish')
              : t('nextExercise')}
          </Button>
        </div>
      )}
    </div>
  )
} 