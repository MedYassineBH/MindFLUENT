"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  example: string;
}

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards: Flashcard[] = [
    {
      id: '1',
      front: 'Bonjour',
      back: 'Hello',
      example: 'Bonjour, comment allez-vous?'
    },
    {
      id: '2',
      front: 'Merci',
      back: 'Thank you',
      example: 'Merci beaucoup pour votre aide!'
    },
    {
      id: '3',
      front: 'Au revoir',
      back: 'Goodbye',
      example: 'Au revoir, à bientôt!'
    },
    {
      id: '4',
      front: 'Pomme',
      back: 'Apple',
      example: 'Je mange une pomme.'
    },
    {
      id: '5',
      front: 'Livre',
      back: 'Book',
      example: 'Ce livre est très intéressant.'
    }
  ];

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Practice Flashcards</h1>
        <p>Please log in to view your flashcards.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Practice Flashcards</h2>
      <Card className="flex flex-col items-center justify-center p-8">
        <div
          className={`w-full max-w-md aspect-[4/3] relative cursor-pointer transition-transform duration-500 transform-gpu ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="bg-primary text-primary-foreground rounded-lg p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-bold mb-4">{flashcards[currentCardIndex].front}</h3>
              <p className="text-sm opacity-80">Click to flip</p>
            </div>
          </div>
          <div className={`absolute w-full h-full backface-hidden ${!isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="bg-muted rounded-lg p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-bold mb-4">{flashcards[currentCardIndex].back}</h3>
              <p className="text-sm mb-4">{flashcards[currentCardIndex].example}</p>
              <p className="text-sm opacity-80">Click to flip back</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full max-w-md mt-8">
          <Button variant="outline" onClick={prevCard}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" onClick={nextCard}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}