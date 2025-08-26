'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Manager',
    company: 'TechFlow Inc.',
    avatar: '/avatars/sarah.jpg',
    content: 'FormBuilder Pro has transformed how we collect customer feedback. The drag-and-drop interface is so intuitive, and the analytics help us make data-driven decisions.',
    rating: 5,
    plan: 'Pro'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Event Coordinator',
    company: 'EventPro Solutions',
    avatar: '/avatars/marcus.jpg',
    content: 'We use FormBuilder Pro for all our event registrations. The custom branding and seamless integrations with our CRM have saved us hours of manual work.',
    rating: 5,
    plan: 'Team'
  },
  {
    name: 'Emily Watson',
    role: 'HR Director',
    company: 'GreenTech',
    avatar: '/avatars/emily.jpg',
    content: 'Creating employee satisfaction surveys has never been easier. The templates are professional, and the response tracking gives us valuable insights into team morale.',
    rating: 5,
    plan: 'Pro'
  },
  {
    name: 'David Kim',
    role: 'Product Manager',
    company: 'InnovateLab',
    avatar: '/avatars/david.jpg',
    content: 'We switched from a competitor and couldn\'t be happier. The form builder is more powerful, the UI is cleaner, and the support team is incredibly responsive.',
    rating: 5,
    plan: 'Pro'
  },
  {
    name: 'Lisa Thompson',
    role: 'Consultant',
    company: 'Thompson Consulting',
    avatar: '/avatars/lisa.jpg',
    content: 'As a solo consultant, I need tools that are both powerful and easy to use. FormBuilder Pro hits the perfect balance. My clients love the professional forms.',
    rating: 5,
    plan: 'Freemium'
  },
  {
    name: 'James Wilson',
    role: 'Operations Manager',
    company: 'Global Logistics Co.',
    avatar: '/avatars/james.jpg',
    content: 'The webhook integrations and API access have automated our entire customer onboarding process. It\'s like having a full-time developer on our team.',
    rating: 5,
    plan: 'Team'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by 10,000+ Creators
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers are saying about FormBuilder Pro and how it's helping them grow their businesses.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary-400" />
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warning-500 fill-current" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testimonial.plan === 'Pro' 
                    ? 'bg-primary-100 text-primary-800'
                    : testimonial.plan === 'Team'
                    ? 'bg-secondary-100 text-secondary-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {testimonial.plan}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-primary-100">Forms Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2M+</div>
              <div className="text-primary-100">Responses Collected</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Thousands of Happy Customers
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start building better forms today and see why so many creators choose FormBuilder Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-3">
                Start Building Free
              </button>
              <button className="btn-secondary px-8 py-3">
                View Customer Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
