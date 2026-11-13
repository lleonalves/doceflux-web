import { useMutation } from '@tanstack/react-query'
import { useState, type SubmitEventHandler } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { getLoginErrorMessage, login } from './authApi'

const inputClass = 'min-h-11 w-full rounded-xl border-2 border-cacao bg-cream px-3 py-2'
const labelClass = 'block text-sm font-bold text-cacao'

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
    <main className="flex min-h-svh items-center justify-center bg-cream p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border-2 border-cacao bg-beige p-6 shadow-cozy"
      >
        <h1 className="text-3xl font-bold text-rose-deep">DoceFlux</h1>

        <div className="space-y-1">
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className={labelClass}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {mutation.isError && (
          <p role="alert" className="text-sm font-bold text-rose-deep">
            {getLoginErrorMessage(mutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="min-h-11 w-full rounded-xl border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
