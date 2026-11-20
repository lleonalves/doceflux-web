import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Plus, TriangleAlert, Wallet } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { formatCurrency } from '../../../lib/format'
import { shouldRetry } from '../../../lib/queryRetry'
import { orderStatusPresentation } from '../../orders/orderStatus'
import { getDashboardSummary } from '../services/dashboardService'

interface Range {
  startDate: string
  endDate: string
}

type PeriodOption = 'today' | 'week' | 'month' | 'custom'

const pad = (n: number): string => String(n).padStart(2, '0')
const toIso = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const todayRange = (): Range => ({ startDate: toIso(new Date()), endDate: toIso(new Date()) })

const last7DaysRange = (): Range => {
  const start = new Date()
  start.setDate(start.getDate() - 6)
  return { startDate: toIso(start), endDate: toIso(new Date()) }
}

const currentMonthRange = (): Range => {
  const now = new Date()
  return {
    startDate: toIso(new Date(now.getFullYear(), now.getMonth(), 1)),
    endDate: toIso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  }
}

const presetRanges: Record<Exclude<PeriodOption, 'custom'>, () => Range> = {
  today: todayRange,
  week: last7DaysRange,
  month: currentMonthRange,
}

const periodOptions: { value: PeriodOption; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Últimos 7 dias' },
  { value: 'month', label: 'Este Mês' },
  { value: 'custom', label: 'Personalizado' },
]

const inputClass = 'min-h-11 w-full rounded-xl border-2 border-cacao bg-cream px-3 py-2'
const tactile = 'transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'

function Indicator({
  label,
  value,
  tone = 'text-cacao',
  hint,
}: {
  label: string
  value: ReactNode
  tone?: string
  hint?: string
}) {
  return (
    <div className="min-w-0 rounded-2xl border-2 border-cacao bg-beige p-4 shadow-cozy-sm">
      <p className="truncate text-sm font-bold text-cacao/80">{label}</p>
      <p className={`truncate font-display text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
      {hint && <p className="truncate text-xs text-cacao/70">{hint}</p>}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-5">
      <p className="font-semibold text-cacao/80">Preparando o balcão...</p>
      <div aria-hidden="true" className="grid animate-pulse grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 rounded-2xl border-2 border-cacao bg-beige shadow-cozy-sm" />
        ))}
      </div>
      <div aria-hidden="true" className="grid animate-pulse grid-cols-1 gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Card key={index} tone="cream" className="h-48" />
        ))}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodOption>('month')
  const [custom, setCustom] = useState<Range>(currentMonthRange)

  const range = period === 'custom' ? custom : presetRanges[period]()
  const rangeValid = Boolean(range.startDate && range.endDate && range.startDate <= range.endDate)

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['dashboard', range.startDate, range.endDate],
    queryFn: () => getDashboardSummary(range.startDate, range.endDate),
    enabled: rangeValid,
    placeholderData: keepPreviousData,
    retry: shouldRetry,
  })

  const selectPeriod = (option: PeriodOption): void => {
    if (option === 'custom' && period !== 'custom') setCustom(range)
    setPeriod(option)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Início</h1>
        <Link
          to="/orders?new=true"
          className={`inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-rose-deep px-5 font-bold text-cream shadow-cozy ${tactile}`}
        >
          <Plus size={18} aria-hidden="true" />
          Novo Pedido
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Período">
          {periodOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => selectPeriod(value)}
              aria-pressed={period === value}
              className={`min-h-11 rounded-xl border-2 border-cacao px-4 font-bold shadow-cozy-sm ${tactile} ${
                period === value ? 'bg-rose-deep text-cream' : 'bg-cream'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-0">
              <label htmlFor="dash-start" className="mb-1 block text-sm font-bold">
                De
              </label>
              <input
                id="dash-start"
                type="date"
                value={custom.startDate}
                onChange={(event) => setCustom((r) => ({ ...r, startDate: event.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="dash-end" className="mb-1 block text-sm font-bold">
                Até
              </label>
              <input
                id="dash-end"
                type="date"
                value={custom.endDate}
                onChange={(event) => setCustom((r) => ({ ...r, endDate: event.target.value }))}
                className={inputClass}
              />
            </div>
            {!rangeValid && (
              <p role="alert" className="w-full text-sm font-bold text-rose-deep">
                Informe um período válido (a data inicial não pode ser posterior à final).
              </p>
            )}
          </div>
        )}
      </div>

      {rangeValid && isPending && <DashboardSkeleton />}

      {rangeValid && isError && (
        <Card tone="beige" role="alert" className="flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            Não foi possível carregar o resumo.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className={`min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm disabled:opacity-70 ${tactile}`}
          >
            {isFetching ? 'Tentando...' : 'Tentar novamente'}
          </button>
        </Card>
      )}

      {data && (
        <div
          aria-busy={isFetching}
          className={`space-y-5 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Indicator
              label="Saldo líquido"
              value={formatCurrency(data.financialSummary.netBalance)}
              tone={data.financialSummary.netBalance < 0 ? 'text-rose-deep' : 'text-sage-dark'}
              hint={`Saídas: ${formatCurrency(data.financialSummary.totalExpenses)}`}
            />
            <Indicator label="Entradas" value={formatCurrency(data.financialSummary.totalIncomes)} />
            <Indicator label="Pedidos válidos" value={data.ordersSummary.validOrdersCount} />
            <Indicator label="Ticket médio" value={formatCurrency(data.ordersSummary.averageTicket)} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card tone="cream" aria-labelledby="dash-orders" className="space-y-3">
              <h2 id="dash-orders" className="text-lg font-semibold">
                Acompanhamento de pedidos
              </h2>
              <ul className="space-y-2">
                {data.ordersSummary.ordersByStatus.map(({ status, count }) => {
                  const presentation = orderStatusPresentation[status]
                  return (
                    <li key={status}>
                      <Link
                        to={`/orders?status=${status}`}
                        className={`flex min-h-11 items-center justify-between gap-3 rounded-xl border-2 border-cacao px-3 py-2 font-bold shadow-cozy-sm ${tactile} ${presentation.badgeClass}`}
                      >
                        <span className="min-w-0 truncate">{presentation.label}</span>
                        <span className="font-display text-xl tabular-nums">{count}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Card>

            <Card tone="cream" aria-labelledby="dash-base" className="flex flex-col gap-4">
              <h2 id="dash-base" className="text-lg font-semibold">
                Sua confeitaria
              </h2>
              <dl className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <dt className="truncate text-sm font-bold text-cacao/80">Clientes cadastrados</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums">
                    {data.businessMetrics.totalCustomers}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="truncate text-sm font-bold text-cacao/80">Produtos ativos</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums">
                    {data.businessMetrics.activeProductsCount}
                  </dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  to="/products?new=true"
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-beige px-4 font-bold shadow-cozy-sm ${tactile}`}
                >
                  <Plus size={18} aria-hidden="true" />
                  Novo Produto
                </Link>
                <Link
                  to="/finance"
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-beige px-4 font-bold shadow-cozy-sm ${tactile}`}
                >
                  <Wallet size={18} aria-hidden="true" />
                  Ver Financeiro
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
