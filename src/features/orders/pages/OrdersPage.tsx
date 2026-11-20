import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CakeSlice,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  Plus,
  RefreshCw,
  Search,
  SearchX,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Card } from '../../../components/ui/Card'
import { shouldRetry } from '../../../lib/queryRetry'
import { getCustomers } from '../../customers/services/customerService'
import { getProducts } from '../../products/services/productService'
import { OrderCard } from '../components/OrderCard'
import { OrderForm, type OrderFormValues } from '../components/OrderForm'
import { OrderSkeleton } from '../components/OrderSkeleton'
import { orderStatusPresentation } from '../orderStatus'
import { changeOrderStatus, createOrder, getApiErrorMessage, getOrders } from '../ordersApi'
import type { Order, OrderStatus } from '../types'

const SKELETON_COUNT = 6
const gridClass = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
const inputClass = 'min-h-11 w-full rounded-xl border-2 border-cacao bg-cream px-3 py-2'

type StatusFilter = OrderStatus | 'all'

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card tone="beige" className="flex items-center gap-3 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-cacao bg-cream text-rose-deep">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-cacao/80">{label}</p>
        <p className="font-display text-2xl leading-none font-bold tabular-nums">{value}</p>
      </div>
    </Card>
  )
}

export function OrdersPage() {
  const queryClient = useQueryClient()
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    retry: shouldRetry,
  })
  const customersQuery = useQuery({ queryKey: ['customers'], queryFn: getCustomers, retry: shouldRetry })
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts, retry: shouldRetry })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [statusError, setStatusError] = useState<string | null>(null)

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: ['orders'] })
    void queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      invalidate()
      closeForm()
    },
  })
  const statusMutation = useMutation({
    mutationFn: ({ order, status }: { order: Order; status: OrderStatus }) => changeOrderStatus(order.id, status),
    onMutate: () => setStatusError(null),
    onSuccess: () => {
      invalidate()
      void queryClient.invalidateQueries({ queryKey: ['transactions'] })
      void queryClient.invalidateQueries({ queryKey: ['cash-flow'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => setStatusError(getApiErrorMessage(error, 'Não foi possível alterar o status do pedido.')),
  })

  function closeForm(): void {
    setIsFormOpen(false)
    createMutation.reset()
  }

  const handleSubmit = (values: OrderFormValues): void => {
    createMutation.mutate({
      customerId: values.customerId,
      description: values.description.trim() || undefined,
      items: values.items,
    })
  }

  const handleChangeStatus = (order: Order, status: OrderStatus): void => {
    if (status === 'CANCELLED' && !window.confirm(`Cancelar o pedido de "${order.customerName}"?`)) return
    statusMutation.mutate({ order, status })
  }

  // O backend não garante ordenação: mais recentes primeiro.
  const orders = useMemo(
    () => (data ? [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
    [data],
  )
  const visibleOrders = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter(
      (order) =>
        (statusFilter === 'all' || order.status === statusFilter) &&
        (!term || order.customerName.toLowerCase().includes(term)),
    )
  }, [orders, search, statusFilter])
  const phoneByCustomer = useMemo(
    () => new Map((customersQuery.data ?? []).map((customer) => [customer.id, customer.phone])),
    [customersQuery.data],
  )

  const inProgress = orders.filter((o) => o.status === 'PENDING' || o.status === 'IN_PRODUCTION').length
  const completed = orders.filter((o) => o.status === 'COMPLETED').length
  const isEmpty = data !== undefined && data.length === 0
  const hasNoMatches = orders.length > 0 && visibleOrders.length === 0

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-sm text-cacao/80">Acompanhe as encomendas da sua confeitaria</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-beige px-4 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70"
          >
            <RefreshCw size={18} strokeWidth={2.5} aria-hidden="true" className={isFetching ? 'animate-spin' : ''} />
            {isFetching ? 'Atualizando...' : 'Atualizar'}
          </button>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-rose-deep px-5 font-bold text-cream shadow-cozy transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <Plus size={20} aria-hidden="true" />
            Novo Pedido
          </button>
        </div>
      </div>

      {statusError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border-2 border-cacao bg-beige px-4 py-3 font-bold text-rose-deep shadow-cozy-sm"
        >
          <p className="min-w-0 break-words">{statusError}</p>
          <button
            type="button"
            onClick={() => setStatusError(null)}
            aria-label="Fechar alerta"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-cacao bg-cream shadow-cozy-sm"
          >
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cacao/40 p-4 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-cacao bg-cream p-6 shadow-cozy">
            <h2 className="mb-4 font-display text-2xl text-cacao">Novo Pedido</h2>
            {customersQuery.isSuccess && productsQuery.isSuccess ? (
              <OrderForm
                customers={customersQuery.data}
                products={productsQuery.data}
                onSubmit={handleSubmit}
                onCancel={closeForm}
                isPending={createMutation.isPending}
                errorMessage={
                  createMutation.isError
                    ? getApiErrorMessage(createMutation.error, 'Não foi possível registrar o pedido. Tente novamente.')
                    : null
                }
              />
            ) : (
              <div className="space-y-3">
                <p className="font-semibold text-cacao/80">
                  {customersQuery.isError || productsQuery.isError
                    ? 'Não foi possível carregar clientes e produtos.'
                    : 'Carregando clientes e produtos...'}
                </p>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border-2 border-cacao bg-beige px-4 py-2 font-bold shadow-cozy-sm"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<ClipboardList size={20} strokeWidth={2.5} aria-hidden="true" />}
              label="Total de pedidos"
              value={orders.length}
            />
            <SummaryCard
              icon={<Hourglass size={20} strokeWidth={2.5} aria-hidden="true" />}
              label="Em andamento"
              value={inProgress}
            />
            <SummaryCard
              icon={<CheckCircle2 size={20} strokeWidth={2.5} aria-hidden="true" />}
              label="Concluídos"
              value={completed}
            />
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="order-search" className="mb-1 block text-sm font-bold">
                Buscar cliente
              </label>
              <div className="relative">
                <Search
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-cacao/60"
                />
                <input
                  id="order-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nome do cliente"
                  autoComplete="off"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="order-status" className="mb-1 block text-sm font-bold">
                Status
              </label>
              <select
                id="order-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className={inputClass}
              >
                <option value="all">Todos</option>
                {(Object.keys(orderStatusPresentation) as OrderStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {orderStatusPresentation[status].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {isPending && (
        <div role="status" aria-live="polite" className="space-y-4">
          <p className="font-semibold text-cacao/80">Buscando fornada de pedidos...</p>
          <div className={gridClass}>
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
            className="min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70"
          >
            {isFetching ? 'Tentando...' : 'Tentar novamente'}
          </button>
        </Card>
      )}

      {isEmpty && !isError && (
        <Card tone="beige" className="flex flex-col items-center gap-2 py-10 text-center">
          <CakeSlice size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Ainda não existem pedidos cadastrados.</p>
          <p className="text-sm text-cacao/80">Clique em "Novo Pedido" para registrar o primeiro.</p>
        </Card>
      )}

      {hasNoMatches && (
        <Card tone="beige" className="flex flex-col items-center gap-3 py-10 text-center">
          <SearchX size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Nenhum pedido corresponde aos filtros.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
            }}
            className="min-h-11 rounded-xl border-2 border-cacao bg-cream px-4 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Limpar filtros
          </button>
        </Card>
      )}

      {visibleOrders.length > 0 && (
        <div className={gridClass}>
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              phone={phoneByCustomer.get(order.customerId)}
              onChangeStatus={handleChangeStatus}
              isChangingStatus={statusMutation.isPending && statusMutation.variables.order.id === order.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
