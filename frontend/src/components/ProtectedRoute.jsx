import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user, ready, mustChangePassword } = useAuth()
  const location = useLocation()

  if (!ready) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (mustChangePassword && location.pathname !== '/change-password') return <Navigate to="/change-password" replace />
  return <Outlet />
}

export function LoginRoute() {
  const { user, ready } = useAuth()
  if (!ready) return null
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export function AdminRoute() {
  const { role, ready } = useAuth()
  if (!ready) return null
  return role === 'HR_ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
