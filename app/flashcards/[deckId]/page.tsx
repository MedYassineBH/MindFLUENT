"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, Repeat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  example: string;
  review_count: number;
}

export default function DeckView({ params }: { params: { deckId: string } }) {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ front: '', back: '', example: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [params.deckId]);

  async function fetchCards() {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', params.deckId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
      if (data && data.length > 0) {
        setCurrentCard(data[0]);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createCard() {
    try {
      const { error } = await supabase
        .from('flashcards')
        .insert([{ ...newCard, deck_id: params.deckId }]);

      if (error) throw error;
      
      setDialogOpen(false);
      setNewCard({ front: '', back: '', example: '' });
      fetchCards();
    } catch (error) {
      console.error('Error creating card:', error);
    }
  }

  function nextCard() {
    if (!cards.length) return;
    const currentIndex = cards.findIndex(card => card.id === currentCard?.id);
    const nextIndex = (currentIndex + 1) % cards.length;
    setCurrentCard(cards[nextIndex]);
    setShowBack(false);
  }

  async function updateReviewCount() {
    if (!currentCard) return;
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ 
          review_count: currentCard.review_count + 1,
          last_reviewed: new Date().toISOString()
        })
        .eq('id', currentCard.id);

      if (error) throw error;
      nextCard();
    } catch (error) {
      console.error('Error updating review count:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/flashcards')}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-[#007BFF]">Study Deck</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setStudyMode(!studyMode)}
              >
                <Repeat className="h-5 w-5 mr-2" />
                {studyMode ? 'View All' : 'Study Mode'}
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#28A745] hover:bg-[#218838]">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Card</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="front">Front</Label>
                      <Input
                        id="front"
                        value={newCard.front}
                        onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="back">Back</Label>
                      <Input
                        id="back"
                        value={newCard.back}
                        onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="example">Example (optional)</Label>
                      <Input
                        id="example"
                        value={newCard.example}
                        onChange={(e) => setNewCard({ ...newCard, example: e.target.value })}
                      />
                    </div>
                    <Button
                      className="w-full bg-[#28A745] hover:bg-[#218838]"
                      onClick={createCard}
                    >
                      Add Card
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div>Loading cards...</div>
          ) : studyMode ? (
            currentCard ? (
              <div className="flex flex-col items-center">
                <Card
                  className="w-full max-w-2xl p-8 cursor-pointer"
                  onClick={() => setShowBack(!showBack)}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4">
                      {showBack ? currentCard.back : currentCard.front}
                    </h3>
                    {showBack && currentCard.example && (
                      <p className="text-gray-600 mt-4">
                        Example: {currentCard.example}
                      </p>
                    )}
                  </div>
                </Card>
                {showBack && (
                  <div className="mt-6">
                    <Button
                      className="bg-[#28A745] hover:bg-[#218838]"
                      onClick={updateReviewCount}
                    >
                      Mark as Reviewed
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">No cards in this deck</div>
            )
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Card key={card.id} className="p-6">
                  <div className="font-semibold mb-2">{card.front}</div>
                  <div className="text-gray-600">{card.back}</div>
                  {card.example && (
                    <div className="text-gray-500 text-sm mt-2">
                      Example: {card.example}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}