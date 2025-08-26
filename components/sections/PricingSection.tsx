'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Check, Crown, Users, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Freemium',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 forms',
      '50 responses per month',
      'Basic form fields',
      'Standard templates',
      'Email support',
      'Made with FormBuilder Pro branding'
    ],
    cta: 'Get Started Free',
    popular: false,
    icon: Zap
  },
  {
    name: 'Pro',
    price: '€10',
    period: '/month',
    description: 'For professionals and growing teams',
    features: [
      'Unlimited forms',
      'Unlimited responses',
      'Advanced form fields',
      'Custom templates',
      'Priority support',
      'Remove branding',
      'Export to CSV/Excel',
      'Basic analytics',
      'Custom CSS',
      'Webhook integrations'
    ],
    cta: 'Start Pro Trial',
    popular: true,
    icon: Crown
  },
  {
    name: 'Team',
    price: '€30',
    period: '/month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Team collaboration',
      'Advanced analytics',
      'Custom domains',
      'API access',
      'SSO integration',
      'Advanced security',
      'Dedicated support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false,
    icon: Users
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade when you need more. No hidden fees, no surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
              <span className="ml-1 text-primary-600 font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-soft border-2 p-8 transition-all duration-300 hover:shadow-large ${
                plan.popular 
                  ? 'border-primary-500 scale-105' 
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    plan.popular ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      plan.popular ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full ${
                  plan.popular 
                    ? 'bg-primary-600 hover:bg-primary-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-600">
                Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I downgrade?
              </h4>
              <p className="text-gray-600">
                Your data is always safe. If you downgrade, you'll keep all your forms and responses, but may hit limits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your first payment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h4>
              <p className="text-gray-600">
                No setup fees! You only pay the monthly subscription price. Start building forms immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Enterprise Features?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Custom solutions for large organizations with specific requirements, compliance needs, and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Contact Enterprise Sales
              </Button>
              <Button size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
