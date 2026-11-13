import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CakeSlice, RefreshCw, TriangleAlert } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { OrderCard } from '../components/OrderCard'
import { OrderSkeleton } from '../components/OrderSkeleton'
import { getOrders } from '../ordersApi'

const MAX_RETRIES = 2
const SKELETON_COUNT = 6

/** Retenta só falhas transitórias (rede, timeout, 5xx); erros 4xx não melhoram ao repetir. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false
  if (axios.isAxiosError(error) && error.response && error.response.status < 500) return false
  return true
}

export function OrdersPage() {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    retry: shouldRetry,
  })

  // O backend não garante ordenação: mais recentes primeiro.
  const orders = data ? [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-beige px-4 font-bold shadow-cozy-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <RefreshCw
            size={18}
            strokeWidth={2.5}
            aria-hidden="true"
            className={isFetching ? 'animate-spin' : ''}
          />
          {isFetching ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {isPending && (
        <div role="status" aria-live="polite" className="space-y-4">
          <p className="font-semibold text-cacao/80">Buscando fornada de pedidos...</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <Card tone="beige" role="alert" className="flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            Não foi possível carregar os pedidos.
          </p>
          <p className="text-sm text-cacao/80">
            {data ? 'Exibindo a última lista carregada. ' : ''}Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            Tentar novamente
          </button>
        </Card>
      )}

      {data && orders.length === 0 && !isError && (
        <Card tone="beige" className="flex flex-col items-center gap-2 py-10 text-center">
          <CakeSlice size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Ainda não existem pedidos cadastrados.</p>
          <p className="text-sm text-cacao/80">Quando um pedido for criado, ele aparecerá aqui.</p>
        </Card>
      )}

      {orders.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
