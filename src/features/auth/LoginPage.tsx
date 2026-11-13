import { useMutation } from '@tanstack/react-query'
import { useState, type SubmitEventHandler } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { getLoginErrorMessage, login } from './authApi'

export function LoginPage() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => setAuth(token, user),
  })

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (mutation.isPending) return
    mutation.reset() // limpa o erro da tentativa anterior
    mutation.mutate({ email: email.trim(), password })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-blue-600">DoceFlux</h1>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        {mutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            {getLoginErrorMessage(mutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
