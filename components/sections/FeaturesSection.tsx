'use client'

import React from 'react'
import { BarChart3, Download, Palette, Share2, Shield, Smartphone, Zap, MousePointer } from 'lucide-react';

const features = [
  {
    icon: MousePointer,
    title: 'Drag & Drop Builder',
    description: 'Créez des formulaires intuitifs avec notre interface drag & drop moderne.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Avancés',
    description: 'Analysez vos réponses avec des graphiques et insights détaillés.',
  },
  {
    icon: Shield,
    title: 'Sécurité Enterprise',
    description: 'Vos données sont protégées avec un chiffrement de niveau bancaire.',
  },
  {
    icon: Share2,
    title: 'Partage Facile',
    description: 'Partagez vos formulaires avec un simple lien ou intégration.',
  },
  {
    icon: Download,
    title: 'Export CSV',
    description: 'Exportez toutes vos réponses au format CSV pour analyse.',
  },
  {
    icon: Zap,
    title: 'IA Intégrée',
    description: 'Suggestions de champs et analyse intelligente avec OpenAI.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Créez, partagez et analysez vos formulaires avec des outils puissants et intuitifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
