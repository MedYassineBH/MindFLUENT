import React from "react";

export default function GrammarPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-[#A91D3A]">Grammaire</h1>
        <p className="text-gray-700 mb-6">
          Améliorez votre maîtrise de la grammaire grâce à des leçons interactives, des exemples clairs et des exercices corrigés.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Example */}
          <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#A91D3A] mb-2">Les temps verbaux</h2>
            <p className="text-gray-600">
              Apprenez les conjugaisons et utilisez les temps verbaux correctement à travers des activités dynamiques.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#A91D3A] mb-2">Les prépositions</h2>
            <p className="text-gray-600">
              Explorez l’usage des prépositions dans des contextes variés avec des mini-jeux.
            </p>
          </div>

          {/* Add more cards as needed */}
        </div>
      </div>
    </div>
  );
}
