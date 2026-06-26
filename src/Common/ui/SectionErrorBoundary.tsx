import { Component, type ErrorInfo, type ReactNode } from 'react'

type SectionErrorBoundaryProps = {
  children: ReactNode
}

type SectionErrorBoundaryState = {
  hasError: boolean
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SectionErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm font-medium text-zinc-300">
            Failed to load content
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            This section encountered an error.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}