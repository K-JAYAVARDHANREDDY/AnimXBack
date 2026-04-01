'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: React.ReactNode
  animationName?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AnimationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`Animation Error [${this.props.animationName}]:`, error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div className="text-center">
            <p className="text-xs font-semibold text-red-400">
              {this.props.animationName || 'Animation'} failed to render
            </p>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[180px]">
              {this.state.error?.message?.slice(0, 60) || 'Unknown error'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
