import React from 'react'
import { clsx } from 'clsx'
import { AlertCircle, CheckCircle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    success, 
    helperText, 
    leftIcon, 
    rightIcon, 
    id, 
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            id={inputId}
            className={clsx(
              'block w-full rounded-lg border shadow-sm transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              'py-2.5 text-sm',
              error 
                ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
                : success 
                ? 'border-success-300 focus:border-success-500 focus:ring-success-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
          
          {/* Status icons */}
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-error-500" />
            </div>
          )}
          
          {success && !error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-success-500" />
            </div>
          )}
        </div>
        
        {/* Helper text and error messages */}
        {helperText && !error && !success && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
        
        {success && (
          <p className="mt-1 text-sm text-success-600">{success}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
