'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Check, Crown, Users, Zap } from 'lucide-react'
import { getPlanPrice, getPlanFeatures } from '@/lib/plans'

const plans = [
  {
    name: 'Gratuit',
    plan: 'FREE' as const,
    description: 'Parfait pour commencer',
    icon: Zap,
    popular: false
  },
  {
    name: 'Pro',
    plan: 'PRO' as const,
    description: 'Pour les professionnels et équipes en croissance',
    icon: Crown,
    popular: true
  },
  {
    name: 'Team',
    plan: 'TEAM' as const,
    description: 'Pour les équipes et organisations',
    icon: Users,
    popular: false
  }
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Commencez gratuitement et passez à la vitesse supérieure quand vous en avez besoin. 
            Pas de frais cachés, pas de surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annuel <span className="text-green-600 font-medium">(-17%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price = getPlanPrice(plan.plan, isAnnual)
            const features = getPlanFeatures(plan.plan)
            const Icon = plan.icon

            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <Icon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {price === 0 ? 'Gratuit' : `€${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-gray-500 ml-2">
                          /{isAnnual ? 'an' : 'mois'}
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {price === 0 ? 'Commencer gratuitement' : 'Commencer l\'essai'}
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Inclus :</h4>
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Tous les plans incluent une période d'essai de 14 jours
          </p>
          <p className="text-sm text-gray-500">
            Pas de carte de crédit requise pour commencer • Annulation à tout moment
          </p>
        </div>
      </div>
    </section>
  )
}
