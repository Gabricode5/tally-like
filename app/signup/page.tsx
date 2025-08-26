'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    try {
      setIsLoading(true)
      await signup(formData.email, formData.password, formData.firstName, formData.lastName)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Start building amazing forms in minutes
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-large border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
                placeholder="Doe"
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="john@example.com"
              required
            />

            {/* Password */}
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              placeholder="••••••••"
              helperText="Must be at least 8 characters"
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              placeholder="••••••••"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              Free forever plan
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              No credit card required
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
