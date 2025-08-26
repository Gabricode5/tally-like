'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, LogOut, ChevronDown, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface UserMenuProps {
  user: any
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'PRO':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </span>
        )
      case 'TEAM':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
            <Crown className="w-3 h-3 mr-1" />
            Team
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Free
          </span>
        )
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2"
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.firstName || user.email} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-primary-600" />
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user?.firstName || user?.email?.split('@')[0]}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-large border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.firstName || user.email} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.firstName || 'User'
                  }
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                {getPlanBadge(user?.plan || 'FREEMIUM')}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link href="/dashboard">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <User className="w-4 h-4 mr-3 text-gray-400" />
                Dashboard
              </button>
            </Link>
            
            <Link href="/profile">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <Settings className="w-4 h-4 mr-3 text-gray-400" />
                Profile Settings
              </button>
            </Link>
            
            <Link href="/billing">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <Crown className="w-4 h-4 mr-3 text-gray-400" />
                Billing & Plans
              </button>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
