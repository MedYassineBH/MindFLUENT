"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, MessageSquare, Trophy } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-[#007BFF]" />,
      title: "Practice Speaking",
      description: "Improve your pronunciation with AI feedback",
      href: "/practice/speaking"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[#007BFF]" />,
      title: "Flashcards",
      description: "Review vocabulary and phrases",
      href: "/flashcards"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-[#007BFF]" />,
      title: "Grammar Check",
      description: "Get instant grammar corrections",
      href: "/grammar"
    },
    {
      icon: <Trophy className="h-8 w-8 text-[#007BFF]" />,
      title: "Progress",
      description: "Track your learning journey",
      href: "/progress"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-[#007BFF]">MindFluent</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back!</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="ml-3 text-xl font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-500">{feature.description}</p>
                <Button
                  className="w-full mt-4 bg-[#007BFF] hover:bg-[#0056b3]"
                  onClick={() => router.push(feature.href)}
                >
                  Start
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}