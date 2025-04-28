"use client"

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from "next/link"
import { Brain, BookOpen, MessageSquare, Trophy } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  example: string
}

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Bienvenue sur MindFluent</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Découvrez une nouvelle façon d'apprendre le français
        </p>
        {!user && (
          <Link
            href="/auth"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
          >
            Commencer
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Fonctionnalités</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Flashcards Intelligentes"
            description="Apprenez avec des cartes mémoire adaptatives"
          />
          <FeatureCard
            title="Quiz Interactifs"
            description="Testez vos connaissances de manière ludique"
          />
          <FeatureCard
            title="Prononciation"
            description="Améliorez votre accent avec des exercices ciblés"
          />
          <FeatureCard
            title="Grammaire"
            description="Maîtrisez les règles essentielles"
          />
          <FeatureCard
            title="Suivi de Progression"
            description="Visualisez vos progrès en temps réel"
          />
          <FeatureCard
            title="Apprentissage Personnalisé"
            description="Un parcours adapté à votre niveau"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16 rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Prêt à commencer ?</h2>
        <p className="mb-8 text-muted-foreground">
          Rejoignez des milliers d'apprenants et commencez votre voyage vers la
          maîtrise du français.
        </p>
        <Link
          href="/auth"
          className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
        >
          S'inscrire gratuitement
        </Link>
      </section>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}