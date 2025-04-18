import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen, MessageSquare, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      
      <header className="bg-[#007BFF] text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">MindFluent</h1>
          <div className="space-x-4">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-[#0056b3]">
              Login
            </Button>
            <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
              Sign Up
            </Button>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-bold mb-8">Master Languages Naturally</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Experience AI-powered language learning with personalized lessons, voice recognition, and instant feedback.
          </p>
          <Button className="bg-[#28A745] hover:bg-[#218838] text-white text-lg px-8 py-6">
            Start Learning Now
          </Button>
        </div>
      </header>

      
      <section className="py-24 container mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-16 text-gray-800">Why Choose MindFluent?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Brain className="h-12 w-12 text-[#007BFF]" />,
              title: "AI-Powered Learning",
              description: "Personalized learning paths adapted to your progress"
            },
            {
              icon: <MessageSquare className="h-12 w-12 text-[#007BFF]" />,
              title: "Voice Recognition",
              description: "Perfect your pronunciation with real-time feedback"
            },
            {
              icon: <BookOpen className="h-12 w-12 text-[#007BFF]" />,
              title: "Interactive Flashcards",
              description: "Memorize vocabulary effectively with smart flashcards"
            },
            {
              icon: <Trophy className="h-12 w-12 text-[#007BFF]" />,
              title: "Progress Tracking",
              description: "Monitor your improvement with detailed statistics"
            }
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      
      <section className="bg-[#007BFF] text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8">Ready to Start Your Language Journey?</h3>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of learners who are achieving their language goals with MindFluent.
          </p>
          <Button className="bg-[#28A745] hover:bg-[#218838] text-white text-lg px-8 py-6">
            Get Started Free
          </Button>
        </div>
      </section>

      
      <footer className="bg-[#F8F9FA] py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">MindFluent</h4>
              <p className="text-gray-600">Making language learning natural and effective.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Voice Recognition</li>
                <li>Grammar Correction</li>
                <li>Flashcards</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Twitter</li>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>© 2025 MindFluent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}