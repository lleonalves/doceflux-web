import { useQuery } from '@tanstack/react-query'
import { fetchSession } from './features/auth/authApi'
import { LoginPage } from './features/auth/LoginPage'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Revalida o token no backend; um 401 é tratado no interceptor (logout).
  useQuery({
    queryKey: ['auth', 'session', token],
    queryFn: fetchSession,
    enabled: token !== null,
    retry: false,
  })

  if (!token) return <LoginPage />

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600">DoceFlux Web</h1>
      <p className="mt-2 text-gray-700">
        {user?.storeName} — {user?.email}
      </p>
      <button
        type="button"
        onClick={logout}
        className="mt-4 rounded border border-gray-300 px-3 py-1"
      >
        Sair
      </button>
    </div>
  )
}

export default App
