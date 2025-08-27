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
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Modèles', href: '/templates' },
    { name: 'Intégrations', href: '/integrations' },
    { name: 'API', href: '/api' }
  ],
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carrières', href: '/careers' },
    { name: 'Presse', href: '/press' },
    { name: 'Partenaires', href: '/partners' }
  ],
  support: [
    { name: 'Centre d\'aide', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Statut', href: '/status' },
    { name: 'Communauté', href: '/community' }
  ],
  legal: [
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Politique des cookies', href: '/cookies' },
    { name: 'RGPD', href: '/gdpr' },
    { name: 'Sécurité', href: '/security' }
  ]
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/formify', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/formify', icon: Linkedin },
  { name: 'GitHub', href: 'https://github.com/formify', icon: Github },
  { name: 'Email', href: 'mailto:hello@formify.com', icon: Mail }
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-2 text-xl font-bold">Formify</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Créez des formulaires intelligents en quelques minutes. La plateforme la plus intuitive 
              pour créer des formulaires professionnels avec l'aide de l'IA.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Produit
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
              Entreprise
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
              Légal
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

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© 2024 Formify. Tous droits réservés.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>Sécurisé et conforme RGPD</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                <span>IA intégrée</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span>10 000+ utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
