import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { fetchSession } from '../features/auth/authApi'
import { useAuthStore } from '../store/useAuthStore'

/**
 * Libera as rotas privadas quando há token local. A validade é confirmada no backend
 * (GET /api/auth/me); um 401 é tratado pelo interceptor do Axios, que faz logout.
 */
export function RequireAuth() {
  const token = useAuthStore((state) => state.token)

  useQuery({
    queryKey: ['auth', 'session', token],
    queryFn: fetchSession,
    enabled: token !== null,
    retry: false,
  })

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export function PublicOnly() {
  const token = useAuthStore((state) => state.token)
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />
}
