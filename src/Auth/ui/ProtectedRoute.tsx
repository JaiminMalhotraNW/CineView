import type { ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import { Navigate, useLocation } from 'react-router-dom'
import { authStore } from '../data/AuthStore'

type ProtectedRouteProps = {
  children: ReactNode
}

export const ProtectedRoute = observer(function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location = useLocation()

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
})