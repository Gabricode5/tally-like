'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Menu, X, User, LogOut, Settings, Plus } from 'lucide-react'
import { UserMenu } from './UserMenu'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Templates', href: '/templates' },
    { name: 'Help', href: '/help' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">FormBuilder Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Form
                  </Button>
                </Link>
                <UserMenu user={user} onLogout={logout} />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {isAuthenticated ? (
              <div className="pt-4 space-y-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    New Form
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-error-600 hover:text-error-700"
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 space-y-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="w-full justify-center">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
