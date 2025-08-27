'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Play, Zap, Shield, Users } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Nouveau : Suggestions IA pour vos formulaires
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Créez des formulaires intelligents
            <span className="block text-blue-600">en quelques minutes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Formify vous aide à créer des formulaires professionnels, sondages et questionnaires 
            avec notre constructeur intuitif. Collectez des réponses, analysez les données et 
            développez votre entreprise facilement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button size="xl" className="group bg-blue-600 hover:bg-blue-700">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <button className="inline-flex items-center px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors">
              <Play className="w-5 h-5 mr-2" />
              Voir la démo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              Pas de carte de crédit requise
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Rejoignez 10 000+ créateurs
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Configuration en 2 minutes
            </div>
          </div>
        </div>

        {/* Hero Image/Preview */}
        <div className="mt-16 relative">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Mock form preview */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Sondage de satisfaction client</h3>
                  <p className="text-gray-600">Aidez-nous à améliorer notre service en partageant votre expérience</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment évaluez-vous notre service ?</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">★</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Que pouvons-nous améliorer ?</label>
                    <div className="h-20 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Zone de texte pour les commentaires</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nous recommanderiez-vous ?</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input type="radio" name="recommend" className="mr-2" />
                        <span className="text-sm">Oui</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="recommend" className="mr-2" />
                        <span className="text-sm">Non</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
