'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mic, Volume2, Play, Square, SkipForward, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface PronunciationExercise {
  id: string
  word: string
  audioUrl: string
  translation: string
  tips: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const exercises: Record<string, PronunciationExercise[]> = {
  'sounds': [
    {
      id: '1',
      word: 'bonjour',
      audioUrl: '/audio/bonjour.mp3',
      translation: 'hello',
      tips: [
        'Le "on" se prononce comme dans "bon"',
        'Le "r" final est légèrement roulé',
        'L\'accent est sur la dernière syllabe'
      ],
      difficulty: 'easy'
    },
    {
      id: '2',
      word: 'au revoir',
      audioUrl: '/audio/au-revoir.mp3',
      translation: 'goodbye',
      tips: [
        'Le "au" se prononce comme "o"',
        'Le "r" final est légèrement roulé',
        'Prononcez "voir" comme "vwar"'
      ],
      difficulty: 'easy'
    },
    {
      id: '3',
      word: 'merci',
      audioUrl: '/audio/merci.mp3',
      translation: 'thank you',
      tips: [
        'Le "er" se prononce comme "èr"',
        'Le "ci" se prononce "si"',
        'L\'accent est sur "ci"'
      ],
      difficulty: 'easy'
    }
  ],
  'rhythm': [
    {
      id: '1',
      word: 'je ne sais pas',
      audioUrl: '/audio/je-ne-sais-pas.mp3',
      translation: 'I don\'t know',
      tips: [
        'Les syllabes sont égales en durée',
        'Le "ne" est à peine prononcé',
        'L\'accent est sur "pas"'
      ],
      difficulty: 'medium'
    },
    {
      id: '2',
      word: 'comment allez-vous',
      audioUrl: '/audio/comment-allez-vous.mp3',
      translation: 'how are you',
      tips: [
        'L\'accent est sur "vous"',
        'Le "ent" de "comment" est muet',
        'Les syllabes sont liées'
      ],
      difficulty: 'medium'
    }
  ],
  'intonation': [
    {
      id: '1',
      word: 'c\'est vrai ?',
      audioUrl: '/audio/cest-vrai.mp3',
      translation: 'really?',
      tips: [
        'La voix monte à la fin',
        'Le "ai" se prononce comme "è"',
        'Expression de surprise'
      ],
      difficulty: 'hard'
    },
    {
      id: '2',
      word: 'bien sûr !',
      audioUrl: '/audio/bien-sur.mp3',
      translation: 'of course!',
      tips: [
        'Le "bien" est accentué',
        'Le "û" est long',
        'Ton affirmatif'
      ],
      difficulty: 'hard'
    }
  ]
}

export default function PronunciationExercisePage({ params }: { params: { category: string } }) {
  const { t } = useLanguage()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)

  const currentCategoryExercises = exercises[params.category] || []
  const exercise = currentCategoryExercises[currentExercise]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }, [])

  const playOriginalAudio = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setRecordedAudio(url)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      toast.success(t('recordingStarted'))
    } catch (error) {
      toast.error(t('microphoneError'))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setAttempts(attempts + 1)
      toast.success(t('recordingStopped'))
    }
  }

  const nextExercise = () => {
    if (currentExercise < currentCategoryExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setShowTips(false)
      setAttempts(0)
      setRecordedAudio(null)
    }
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('pronunciationTitle')}</h1>
        <p>{t('noExercisesFound')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('pronunciationTitle')}</h1>
        <Progress
          value={(currentExercise / currentCategoryExercises.length) * 100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {t('exercise')} {currentExercise + 1}/{currentCategoryExercises.length}
          </span>
          <span>
            {t('attempts')}: {attempts}
          </span>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center text-3xl">{exercise.word}</CardTitle>
          <p className="text-center text-muted-foreground">{exercise.translation}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={playOriginalAudio}
                disabled={isPlaying || isRecording}
              >
                {isPlaying ? (
                  <Volume2 className="w-6 h-6 animate-pulse" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                <span className="ml-2">{t('listen')}</span>
              </Button>

              <Button
                size="lg"
                variant={isRecording ? 'destructive' : 'default'}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isPlaying}
              >
                {isRecording ? (
                  <>
                    <Square className="w-6 h-6" />
                    <span className="ml-2">{t('stopRecording')}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6" />
                    <span className="ml-2">{t('record')}</span>
                  </>
                )}
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowTips(!showTips)}
            >
              {showTips ? t('hideTips') : t('showTips')}
            </Button>

            {showTips && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">{t('pronunciationTips')}:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {exercise.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {recordedAudio && (
              <div className="mt-4">
                <audio controls src={recordedAudio} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={nextExercise}
          disabled={currentExercise >= currentCategoryExercises.length - 1}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          {currentExercise >= currentCategoryExercises.length - 1 
            ? t('finish')
            : t('nextExercise')}
        </Button>
      </div>

      <audio
        ref={audioRef}
        src={exercise.audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
} 