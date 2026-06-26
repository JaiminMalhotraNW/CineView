import { Component, type ErrorInfo, type ReactNode } from 'react'
import { theme } from '../core/themeClasses'

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
  state: SectionErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SectionErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={theme.boundary}>
          <p className={theme.boundaryText}>Failed to load content</p>
          <p className={`mt-2 text-xs ${theme.hint}`}>
            This section encountered an error.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}