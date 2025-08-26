'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Heart,
  Zap,
  Shield,
  Users
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Templates', href: '/templates' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'API', href: '/api' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' }
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Status', href: '/status' },
    { name: 'Community', href: '/community' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Security', href: '/security' }
  ]
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/formbuilderpro', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/formbuilderpro', icon: Linkedin },
  { name: 'GitHub', href: 'https://github.com/formbuilderpro', icon: Github },
  { name: 'Email', href: 'mailto:hello@formbuilderpro.com', icon: Mail }
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-2 text-xl font-bold">FormBuilder Pro</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Create beautiful forms in minutes, not hours. The most intuitive form builder 
              for professionals and growing teams.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center text-gray-400">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">SOC 2 Certified</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm">10,000+ Users</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src="/badges/ssl-secure.svg" 
                alt="SSL Secure" 
                className="h-8 opacity-60"
              />
              <img 
                src="/badges/gdpr-compliant.svg" 
                alt="GDPR Compliant" 
                className="h-8 opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 FormBuilder Pro. All rights reserved.
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-2 text-red-500 fill-current" />
              <span>in Europe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
