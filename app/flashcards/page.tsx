"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  language: string;
  created_at: string;
}

export default function Flashcards() {
  const router = useRouter();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDeck, setNewDeck] = useState({ name: '', description: '', language: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  async function fetchDecks() {
    try {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDecks(data || []);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createDeck() {
    try {
      const { error } = await supabase
        .from('flashcard_decks')
        .insert([newDeck]);

      if (error) throw error;
      
      setDialogOpen(false);
      setNewDeck({ name: '', description: '', language: '' });
      fetchDecks();
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-[#007BFF]">Flashcards</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#28A745] hover:bg-[#218838]">
                    <Plus className="h-5 w-5 mr-2" />
                    New Deck
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Deck</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">Deck Name</Label>
                      <Input
                        id="name"
                        value={newDeck.name}
                        onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newDeck.description}
                        onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Input
                        id="language"
                        value={newDeck.language}
                        onChange={(e) => setNewDeck({ ...newDeck, language: e.target.value })}
                      />
                    </div>
                    <Button
                      className="w-full bg-[#28A745] hover:bg-[#218838]"
                      onClick={createDeck}
                    >
                      Create Deck
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
            <div>Loading decks...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <Card
                  key={deck.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/flashcards/${deck.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <BookOpen className="h-8 w-8 text-[#007BFF]" />
                      <div>
                        <h3 className="text-xl font-semibold">{deck.name}</h3>
                        <p className="text-sm text-gray-500">{deck.language}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{deck.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}