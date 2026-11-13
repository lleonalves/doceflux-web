import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card tone="beige" className="max-w-sm text-center">
        <p className="font-display text-5xl font-bold text-rose-deep">404</p>
        <h1 className="mt-2 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-1 text-sm text-cacao/80">O endereço acessado não existe.</p>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition hover:-translate-y-0.5"
        >
          Voltar ao início
        </Link>
      </Card>
    </main>
  )
}
