'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Zap, Shield, Users } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Build Amazing Forms?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators who are already building better forms, collecting more responses, 
            and growing their businesses with FormBuilder Pro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="xl" 
              className="bg-white text-primary-600 hover:bg-gray-100 group"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Setup in 2 Minutes</h3>
            <p className="text-primary-100">
              No complex configuration needed. Start building forms immediately.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
            <p className="text-primary-100">
              Bank-level security with SSL encryption and GDPR compliance.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">10,000+ Happy Users</h3>
            <p className="text-primary-100">
              Join a community of creators who trust FormBuilder Pro.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Our team is here to help you get started and make the most of FormBuilder Pro. 
            Contact us for personalized support and guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Contact Support
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
