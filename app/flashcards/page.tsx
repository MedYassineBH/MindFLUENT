"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useLanguage } from '@/contexts/LanguageContext'
import { useProgress } from '@/contexts/ProgressContext'
import { toast } from 'sonner'
import { RotateCw, Check, X, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed: string | null
  mastery: number // 0-100
}

const sampleFlashcards: Flashcard[] = [
  {
    id: '1',
    front: 'Bonjour',
    back: 'Hello',
    category: 'Greetings',
    difficulty: 'easy',
    lastReviewed: null,
    mastery: 0
  },
  {
    id: '2',
    front: 'Comment ça va?',
    back: 'How are you?',
    category: 'Greetings',
    difficulty: 'easy',
    lastReviewed: null,
    mastery: 0
  },
  {
    id: '3',
    front: 'Je m\'appelle',
    back: 'My name is',
    category: 'Introductions',
    difficulty: 'easy',
    lastReviewed: null,
    mastery: 0
  },
  {
    id: '4',
    front: 'Où est la bibliothèque?',
    back: 'Where is the library?',
    category: 'Directions',
    difficulty: 'medium',
    lastReviewed: null,
    mastery: 0
  },
  {
    id: '5',
    front: 'Je voudrais un café',
    back: 'I would like a coffee',
    category: 'Food & Drink',
    difficulty: 'medium',
    lastReviewed: null,
    mastery: 0
  }
]

type StudyMode = 'learn' | 'review' | 'test'

export default function FlashcardsPage() {
  const { t } = useLanguage()
  const { progress, updateProgress } = useProgress()
  const [cards, setCards] = useState<Flashcard[]>(sampleFlashcards)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [studyMode, setStudyMode] = useState<StudyMode>('learn')
  const [score, setScore] = useState(0)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const currentCard = cards[currentCardIndex]

  const handleFlip = () => {
    setShowBack(!showBack)
  }

  const handleResponse = (correct: boolean) => {
    const updatedCards = [...cards]
    const card = updatedCards[currentCardIndex]
    
    if (correct) {
      card.mastery = Math.min(100, card.mastery + 20)
      setScore(prev => prev + 1)
      toast.success('Correct!')
    } else {
      card.mastery = Math.max(0, card.mastery - 10)
      toast.error('Incorrect!')
    }

    card.lastReviewed = new Date().toISOString()
    setCards(updatedCards)

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setShowBack(false)
    } else {
      setSessionCompleted(true)
      updateProgress('flashcards', {
        masteredCards: cards.filter(card => card.mastery >= 80).length,
        lastReviewed: new Date().toISOString()
      })
    }
  }

  const restartSession = () => {
    setCurrentCardIndex(0)
    setShowBack(false)
    setScore(0)
    setSessionCompleted(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (sessionCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('sessionCompleted')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">
                {t('yourScore').replace('{score}', score.toString()).replace('{total}', cards.length.toString())}
              </h2>
              <p className="text-muted-foreground">
                {score === cards.length
                  ? t('perfectScore')
                  : score >= cards.length / 2
                  ? t('goodJob')
                  : t('keepPracticing')}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={restartSession}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  {t('tryAgain')}
                </Button>
                <Button variant="outline" onClick={() => setStudyMode('review')}>
                  {t('reviewCards')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('flashcards')}</h1>
          <div className="flex gap-2">
            <Button
              variant={studyMode === 'learn' ? 'default' : 'outline'}
              onClick={() => setStudyMode('learn')}
            >
              {t('learn')}
            </Button>
            <Button
              variant={studyMode === 'review' ? 'default' : 'outline'}
              onClick={() => setStudyMode('review')}
            >
              {t('review')}
            </Button>
            <Button
              variant={studyMode === 'test' ? 'default' : 'outline'}
              onClick={() => setStudyMode('test')}
            >
              {t('test')}
            </Button>
          </div>
        </div>
        <Progress
          value={(currentCardIndex / cards.length) * 100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t('cardProgress').replace('{current}', (currentCardIndex + 1).toString()).replace('{total}', cards.length.toString())}</span>
          <span>{t('score')}: {score}</span>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center">
        <CardContent className="pt-6">
          <div
            className="text-center cursor-pointer"
            onClick={handleFlip}
          >
            <h2 className="text-2xl font-bold mb-4">
              {showBack ? currentCard.back : currentCard.front}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('clickTo')} {showBack ? t('showQuestion') : t('showAnswer')}
            </p>
          </div>

          {showBack && studyMode !== 'review' && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleResponse(false)}
              >
                <X className="w-4 h-4 mr-2" />
                {t('incorrect')}
              </Button>
              <Button
                size="lg"
                onClick={() => handleResponse(true)}
              >
                <Check className="w-4 h-4 mr-2" />
                {t('correct')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
          disabled={currentCardIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('previous')}
        </Button>
        <Button
          onClick={() => setCurrentCardIndex(prev => Math.min(cards.length - 1, prev + 1))}
          disabled={currentCardIndex === cards.length - 1}
        >
          {t('next')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}