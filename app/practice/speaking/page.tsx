"use client"

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Mic, Square, Play, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VoicePractice {
  id: string;
  text: string;
  audio_url: string;
  feedback: any;
  score: number;
  created_at: string;
}

const SAMPLE_PHRASES = [
  "The quick brown fox jumps over the lazy dog",
  "How are you today?",
  "I would like to practice my pronunciation",
  "Could you please speak more slowly?",
  "Thank you very much for your help"
];

export default function SpeakingPractice() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [practices, setPractices] = useState<VoicePractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    fetchPractices();
    setCurrentPhrase(SAMPLE_PHRASES[Math.floor(Math.random() * SAMPLE_PHRASES.length)]);
  }, []);

  async function fetchPractices() {
    try {
      const { data, error } = await supabase
        .from('voice_practices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPractices(data || []);
    } catch (error) {
      console.error('Error fetching practices:', error);
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        await processRecording(audioBlob);
      };

      audioChunks.current = [];
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  function stopRecording() {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  async function processRecording(audioBlob: Blob) {
    setProcessing(true);
    try {
      // Here we would normally send the audio to a speech recognition service
      // For now, we'll simulate the process with a random score
      const simulatedScore = Math.floor(Math.random() * 40) + 60; // Score between 60-100
      
      const { data, error } = await supabase
        .from('voice_practices')
        .insert([{
          text: currentPhrase,
          score: simulatedScore,
          feedback: {
            accuracy: simulatedScore,
            suggestions: simulatedScore < 80 ? [
              "Try to speak more clearly",
              "Pay attention to word stress",
              "Practice the difficult sounds more"
            ] : [
              "Great pronunciation!",
              "Keep practicing to maintain your skills"
            ]
          }
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPractices();
      setCurrentPhrase(SAMPLE_PHRASES[Math.floor(Math.random() * SAMPLE_PHRASES.length)]);
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-[#007BFF]">Speaking Practice</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4">Practice Phrase</h2>
                <p className="text-xl">{currentPhrase}</p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <Button
                  size="lg"
                  className={recording ? "bg-red-500 hover:bg-red-600" : "bg-[#007BFF] hover:bg-[#0056b3]"}
                  onClick={recording ? stopRecording : startRecording}
                  disabled={processing}
                >
                  {recording ? (
                    <>
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>

                {audioURL && (
                  <audio controls className="mt-4">
                    <source src={audioURL} type="audio/wav" />
                  </audio>
                )}

                {processing && (
                  <div className="text-center">
                    <p className="mb-2">Processing your recording...</p>
                    <Progress value={33} className="w-[60%] mx-auto" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Recent Practice Sessions</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {practices.map((practice) => (
              <Card key={practice.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Volume2 className="h-5 w-5 text-[#007BFF] mr-2" />
                      <span className="font-medium">Score: {practice.score}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(practice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{practice.text}</p>
                  {practice.feedback?.suggestions && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Feedback:</p>
                      <ul className="text-sm text-gray-600">
                        {practice.feedback.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="mb-1">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}