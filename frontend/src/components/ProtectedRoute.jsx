import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export function AdminRoute() {
  const { role } = useAuth()
  return role === 'HR_ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
