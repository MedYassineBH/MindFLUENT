"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mic, Volume2, Music } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PronunciationSection {
  id: string
  title: string
  description: string
  category: 'sounds' | 'rhythm' | 'intonation'
  icon: React.ReactNode
  topics: Array<{
    title: string
    description: string
  }>
}

export default function PronunciationPage() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const router = useRouter()

  const pronunciationSections: PronunciationSection[] = [
    {
      id: 'sounds',
      title: t('soundsAndPhonetics'),
      description: t('soundsAndPhoneticsDescription'),
      category: 'sounds',
      icon: <Volume2 className="w-6 h-6" />,
      topics: [
        {
          title: t('basicVowels'),
          description: t('basicVowelsDescription')
        },
        {
          title: t('basicConsonants'),
          description: t('basicConsonantsDescription')
        },
        {
          title: t('nasalSounds'),
          description: t('nasalSoundsDescription')
        }
      ]
    },
    {
      id: 'rhythm',
      title: t('rhythmAndTiming'),
      description: t('rhythmAndTimingDescription'),
      category: 'rhythm',
      icon: <Music className="w-6 h-6" />,
      topics: [
        {
          title: t('wordStress'),
          description: t('wordStressDescription')
        },
        {
          title: t('sentenceRhythm'),
          description: t('sentenceRhythmDescription')
        },
        {
          title: t('linkingWords'),
          description: t('linkingWordsDescription')
        }
      ]
    },
    {
      id: 'intonation',
      title: t('intonationAndExpression'),
      description: t('intonationAndExpressionDescription'),
      category: 'intonation',
      icon: <Mic className="w-6 h-6" />,
      topics: [
        {
          title: t('questionIntonation'),
          description: t('questionIntonationDescription')
        },
        {
          title: t('emotionalExpression'),
          description: t('emotionalExpressionDescription')
        },
        {
          title: t('naturalFlow'),
          description: t('naturalFlowDescription')
        }
      ]
    }
  ]

  const filteredSections = selectedCategory === 'all'
    ? pronunciationSections
    : pronunciationSections.filter(section => section.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('pronunciationTitle')}</h1>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            {t('all')}
          </Button>
          <Button
            variant={selectedCategory === 'sounds' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('sounds')}
          >
            {t('sounds')}
          </Button>
          <Button
            variant={selectedCategory === 'rhythm' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('rhythm')}
          >
            {t('rhythm')}
          </Button>
          <Button
            variant={selectedCategory === 'intonation' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('intonation')}
          >
            {t('intonation')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSections.map((section) => (
          <Card key={section.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                {section.icon}
                <CardTitle>{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{section.description}</p>
              <div className="space-y-4">
                {section.topics.map((topic, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted">
                    <h3 className="font-medium mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                  </div>
                ))}
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/pronunciation/${section.id}`)}
                >
                  {t('startPracticing')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 