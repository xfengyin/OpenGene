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
        <div className="text-center p-8 bg-gray-900 rounded-xl border border-red-500/30">
          <div className="text-4xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">出错了</h2>
          <p className="text-gray-400 mb-4">{error?.message || '发生了未知错误'}</p>
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
              window.location.reload()
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition"
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
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-purple-500`}></div>
      <p className="mt-4 text-gray-400">{message}</p>
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
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition"
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
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  }

  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 ${colors[type]} rounded-lg shadow-lg z-50 animate-fade-in`}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">✕</button>
        )}
      </div>
    </div>
  )
}