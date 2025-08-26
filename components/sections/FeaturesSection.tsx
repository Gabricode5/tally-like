'use client'

import React from 'react'
import { 
  DragDrop, 
  Share2, 
  BarChart3, 
  Zap, 
  Shield, 
  Smartphone, 
  Download, 
  Palette 
} from 'lucide-react'

const features = [
  {
    icon: DragDrop,
    title: 'Drag & Drop Builder',
    description: 'Create forms visually with our intuitive drag-and-drop interface. No coding required.',
    color: 'primary'
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your forms via link, embed on your website, or integrate with your favorite tools.',
    color: 'success'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track responses, view completion rates, and analyze data with beautiful charts and insights.',
    color: 'warning'
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Set up email notifications, webhooks, and automated workflows to streamline your process.',
    color: 'secondary'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with SSL encryption, GDPR compliance, and secure data storage.',
    color: 'error'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'All forms are automatically optimized for mobile devices and work perfectly on any screen.',
    color: 'primary'
  },
  {
    icon: Download,
    title: 'Export & Integrations',
    description: 'Export responses to CSV, Excel, or integrate with Google Sheets, Zapier, and more.',
    color: 'success'
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Remove branding, add your logo, and customize colors to match your brand identity.',
    color: 'warning'
  }
]

const getColorClasses = (color: string) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    error: 'bg-error-100 text-error-600'
  }
  return colors[color as keyof typeof colors] || colors.primary
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Build Amazing Forms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple contact forms to complex surveys, our platform provides all the tools 
            you need to create, share, and analyze forms that drive results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg ${getColorClasses(feature.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of creators who are already building better forms and collecting more responses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-3">
                Start Building Free
              </button>
              <button className="btn-secondary px-8 py-3">
                View Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
