import React from "react";
import { Progress } from "@/components/ui/progress"; // Assuming you're using shadcn/ui

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-[#A91D3A]">Suivi de Progrès</h1>
        <p className="text-gray-700 mb-6">
          Consultez vos statistiques d’apprentissage et suivez vos progrès dans chaque compétence linguistique.
        </p>

        <div className="space-y-6">
          {/* Example Progress Item */}
          <div>
            <h2 className="font-medium text-gray-800">Grammaire</h2>
            <Progress value={75} className="h-4 rounded-xl bg-gray-200" />
          </div>

          <div>
            <h2 className="font-medium text-gray-800">Vocabulaire</h2>
            <Progress value={60} className="h-4 rounded-xl bg-gray-200" />
          </div>

          <div>
            <h2 className="font-medium text-gray-800">Compréhension orale</h2>
            <Progress value={45} className="h-4 rounded-xl bg-gray-200" />
          </div>

          {/* Add more progress bars as needed */}
        </div>
      </div>
    </div>
  );
}
