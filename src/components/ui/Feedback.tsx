'use client'

import { useState, useEffect, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-stripe-border rounded-stripe-xl shadow-stripe-elevated">
          <div className="text-4xl mb-4">😵</div>
          <h2 
            className="text-xl font-light text-stripe-ruby mb-2"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            出错了
          </h2>
          <p className="text-stripe-body mb-4" style={{ fontFeatureSettings: '"ss01" on' }}>{error?.message || '发生了未知错误'}</p>
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
              window.location.reload()
            }}
            className="stripe-btn-primary text-sm"
          >
            重新加载
          </button>
        </div>
      </div>
    ) as ReactNode
  }

  return children
}

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ message = '加载中...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-stripe-border border-t-stripe-purple`}></div>
      <p className="mt-4 text-stripe-body text-sm" style={{ fontFeatureSettings: '"ss01" on' }}>{message}</p>
    </div>
  )
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = '🔍', title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 
        className="text-xl font-light text-stripe-heading mb-2"
        style={{ fontFeatureSettings: '"ss01" on' }}
      >
        {title}
      </h3>
      {description && <p className="text-stripe-body mb-4" style={{ fontFeatureSettings: '"ss01" on' }}>{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="stripe-btn-primary text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const bgColors = {
    success: 'bg-stripe-success',
    error: 'bg-stripe-ruby',
    warning: 'bg-stripe-lemon',
    info: 'bg-stripe-purple'
  }

  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 px-5 py-3 ${bgColors[type]} text-white rounded-stripe shadow-stripe-elevated z-50 animate-fade-in text-sm`} style={{ fontFeatureSettings: '"ss01" on' }}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">✕</button>
        )}
      </div>
    </div>
  )
}
