"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Mic, Volume2, Play, Pause, SkipBack, SkipForward, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface Word {
  word: string
  pronunciation: string
  audioUrl: string
  difficulty: number
  lastPracticed: string | null
}

interface Lesson {
  id: number
  title: string
  description: string
  words: Word[]
  progress: {
    total: number
    practiced: number
    mastered: number
  }
}

const pronunciationLessons: Lesson[] = [
  {
    id: 1,
    title: 'Les voyelles',
    description: 'Apprenez à prononcer les voyelles françaises',
    words: [
      { word: 'été', pronunciation: 'e-té', audioUrl: '/audio/ete.mp3', difficulty: 0, lastPracticed: null },
      { word: 'eau', pronunciation: 'o', audioUrl: '/audio/eau.mp3', difficulty: 0, lastPracticed: null },
      { word: 'oiseau', pronunciation: 'wa-zo', audioUrl: '/audio/oiseau.mp3', difficulty: 0, lastPracticed: null }
    ],
    progress: { total: 3, practiced: 0, mastered: 0 }
  },
  {
    id: 2,
    title: 'Les consonnes',
    description: 'Maîtrisez la prononciation des consonnes',
    words: [
      { word: 'chat', pronunciation: 'cha', audioUrl: '/audio/chat.mp3', difficulty: 0, lastPracticed: null },
      { word: 'champ', pronunciation: 'chan', audioUrl: '/audio/champ.mp3', difficulty: 0, lastPracticed: null },
      { word: 'chanson', pronunciation: 'chan-son', audioUrl: '/audio/chanson.mp3', difficulty: 0, lastPracticed: null }
    ],
    progress: { total: 3, practiced: 0, mastered: 0 }
  }
]

export default function PronunciationPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>(pronunciationLessons)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      mediaRecorder.ondataavailable = (e) => {
        // Here you would typically send the audio data to your backend for analysis
        console.log('Audio data:', e.data)
      }

      mediaRecorder.start()
    } catch (error) {
      toast.error('Erreur lors de l\'accès au microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const nextWord = () => {
    if (selectedLesson !== null) {
      const lesson = lessons.find(l => l.id === selectedLesson)
      if (lesson && currentWordIndex < lesson.words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      }
    }
  }

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
    }
  }

  const updateWordProgress = (wordIndex: number, isCorrect: boolean) => {
    if (selectedLesson === null) return

    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons]
      const lessonIndex = updatedLessons.findIndex(l => l.id === selectedLesson)
      if (lessonIndex === -1) return prevLessons

      const word = updatedLessons[lessonIndex].words[wordIndex]
      const now = new Date().toISOString()
      
      word.lastPracticed = now
      word.difficulty = isCorrect ? Math.min(word.difficulty + 0.2, 1) : Math.max(word.difficulty - 0.1, 0)

      // Update lesson progress
      const practicedWords = updatedLessons[lessonIndex].words.filter(w => w.lastPracticed !== null).length
      const masteredWords = updatedLessons[lessonIndex].words.filter(w => w.difficulty >= 0.8).length

      updatedLessons[lessonIndex].progress = {
        total: updatedLessons[lessonIndex].words.length,
        practiced: practicedWords,
        mastered: masteredWords
      }

      return updatedLessons
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Prononciation</h1>
        <p>Veuillez vous connecter pour accéder aux leçons de prononciation.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Prononciation</h1>
      
      {selectedLesson === null ? (
        <div className="grid gap-6 md:grid-cols-2">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{lesson.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progression</span>
                    <span className="text-sm font-medium">
                      {lesson.progress.practiced}/{lesson.progress.total}
                    </span>
                  </div>
                  <Progress
                    value={(lesson.progress.practiced / lesson.progress.total) * 100}
                    className="h-2"
                  />
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Check className="w-3 h-3 mr-1" />
                      {lesson.progress.mastered} maîtrisés
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedLesson(lesson.id)}>
                    Commencer la leçon
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLesson(lesson.id)
                      setPracticeMode(true)
                    }}
                  >
                    Mode pratique
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLesson(null)
                setCurrentWordIndex(0)
                setPracticeMode(false)
              }}
            >
              Retour aux leçons
            </Button>
            {practiceMode && (
              <Button
                variant="outline"
                onClick={() => setPracticeMode(false)}
              >
                Quitter le mode pratique
              </Button>
            )}
          </div>
          
          {lessons
            .filter((lesson) => lesson.id === selectedLesson)
            .map((lesson) => (
              <div key={lesson.id} className="space-y-6">
                <h2 className="text-xl font-semibold">{lesson.title}</h2>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium mb-2">{lesson.words[currentWordIndex].word}</h3>
                          <p className="text-muted-foreground">{lesson.words[currentWordIndex].pronunciation}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={isPlaying ? pauseAudio : playAudio}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <audio
                            ref={audioRef}
                            src={lesson.words[currentWordIndex].audioUrl}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {practiceMode && (
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={previousWord}
                        disabled={currentWordIndex === 0}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? <Pause className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextWord}
                        disabled={currentWordIndex === lesson.words.length - 1}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {practiceMode && (
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        className="text-green-600"
                        onClick={() => {
                          updateWordProgress(currentWordIndex, true)
                          toast.success('Bonne prononciation !')
                        }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Correct
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600"
                        onClick={() => {
                          updateWordProgress(currentWordIndex, false)
                          toast.error('Essayez encore !')
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Incorrect
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
} 