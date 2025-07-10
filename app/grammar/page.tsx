"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Book, GraduationCap, School } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GrammarSection {
  id: string
  title: string
  description: string
  level: 'basic' | 'intermediate' | 'advanced'
  icon: React.ReactNode
  topics: Array<{
    title: string
    description: string
  }>
}

export default function GrammarPage() {
  const { t } = useLanguage()
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const router = useRouter()

  const grammarSections: GrammarSection[] = [
    {
      id: 'basic-grammar',
      title: t('basicGrammar'),
      description: t('basicGrammarDescription'),
      level: 'basic',
      icon: <Book className="w-6 h-6" />,
      topics: [
        {
          title: t('articles'),
          description: t('articlesDescription')
        },
        {
          title: t('presentTense'),
          description: t('presentTenseDescription')
        },
        {
          title: t('adjectives'),
          description: t('adjectivesDescription')
        }
      ]
    },
    {
      id: 'intermediate-grammar',
      title: t('intermediateGrammar'),
      description: t('intermediateGrammarDescription'),
      level: 'intermediate',
      icon: <School className="w-6 h-6" />,
      topics: [
        {
          title: t('pastTense'),
          description: t('pastTenseDescription')
        },
        {
          title: t('pronouns'),
          description: t('pronounsDescription')
        },
        {
          title: t('adverbs'),
          description: t('adverbsDescription')
        }
      ]
    },
    {
      id: 'advanced-grammar',
      title: t('advancedGrammar'),
      description: t('advancedGrammarDescription'),
      level: 'advanced',
      icon: <GraduationCap className="w-6 h-6" />,
      topics: [
        {
          title: t('subjunctive'),
          description: t('subjunctiveDescription')
        },
        {
          title: t('conditionals'),
          description: t('conditionalsDescription')
        },
        {
          title: t('literaryTenses'),
          description: t('literaryTensesDescription')
        }
      ]
    }
  ]

  const filteredSections = selectedLevel === 'all'
    ? grammarSections
    : grammarSections.filter(section => section.level === selectedLevel)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('grammarTitle')}</h1>
        <div className="flex gap-2">
          <Button
            variant={selectedLevel === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('all')}
          >
            {t('all')}
          </Button>
          <Button
            variant={selectedLevel === 'basic' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('basic')}
          >
            {t('basic')}
          </Button>
          <Button
            variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('intermediate')}
          >
            {t('intermediate')}
          </Button>
          <Button
            variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('advanced')}
          >
            {t('advanced')}
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
                  onClick={() => router.push(`/grammar/${section.id}`)}
                >
                  {t('startLearning')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 