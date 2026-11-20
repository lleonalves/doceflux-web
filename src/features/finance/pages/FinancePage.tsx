import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Scale,
  Trash2,
  TriangleAlert,
  Wallet,
  X,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Card } from '../../../components/ui/Card'
import { formatCurrency } from '../../../lib/format'
import { shouldRetry } from '../../../lib/queryRetry'
import { TransactionFormModal, type TransactionFormValues } from '../components/TransactionFormModal'
import {
  createTransaction,
  deleteTransaction,
  deleteTransactionsByPeriod,
  getCashFlow,
  getTransactions,
  updateTransaction,
} from '../services/financeService'
import type { DateRange, Transaction, TransactionType, TransactionTypeFilter } from '../types'

const SKELETON_COUNT = 5
const inputClass = 'min-h-11 w-full rounded-xl border-2 border-cacao bg-cream px-3 py-2'
const iconButtonClass =
  'flex size-9 items-center justify-center rounded-lg border-2 border-cacao shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60'

const typeFilters: { value: TransactionTypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'INCOME', label: 'Entradas' },
  { value: 'EXPENSE', label: 'Saídas' },
]

const pad = (n: number): string => String(n).padStart(2, '0')

/** Mês completo: do dia 1 ao último dia. */
function monthRange(year: number, month: number): DateRange {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return { startDate: `${year}-${pad(month + 1)}-01`, endDate: `${year}-${pad(month + 1)}-${pad(lastDay)}` }
}

function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function errorMessage(error: unknown, fallback: string): string {
  return (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? fallback
}

function SummaryCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number; tone: string }) {
  return (
    <Card tone="beige" className="flex items-center gap-3 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-cacao bg-cream text-rose-deep">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-cacao/80">{label}</p>
        <p className={`truncate font-display text-2xl leading-none font-bold tabular-nums ${tone}`}>
          {formatCurrency(value)}
        </p>
      </div>
    </Card>
  )
}

function TransactionSkeleton() {
  return (
    <Card tone="cream" aria-hidden="true" className="flex animate-pulse items-center justify-between gap-3 py-4">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-5 w-2/3 rounded-lg bg-beige" />
        <div className="h-4 w-1/3 rounded-lg bg-beige" />
      </div>
      <div className="h-6 w-24 rounded-lg bg-beige" />
    </Card>
  )
}

export function FinancePage() {
  const queryClient = useQueryClient()
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const [mode, setMode] = useState<'month' | 'custom'>('month')
  const [ref, setRef] = useState({ year: currentYear, month: currentMonth })
  const [custom, setCustom] = useState<DateRange>(() => monthRange(currentYear, currentMonth))
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all')

  const [formState, setFormState] = useState<{ type: TransactionType; transaction?: Transaction } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const range = mode === 'month' ? monthRange(ref.year, ref.month) : custom
  const rangeValid = Boolean(range.startDate && range.endDate && range.startDate <= range.endDate)
  const monthLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
      new Date(ref.year, ref.month, 1),
    )
    return label.charAt(0).toUpperCase() + label.slice(1)
  }, [ref])

  const cashFlowQuery = useQuery({
    queryKey: ['cash-flow', range],
    queryFn: () => getCashFlow(range),
    enabled: rangeValid,
    retry: shouldRetry,
  })
  const transactionsQuery = useQuery({
    queryKey: ['transactions', range, typeFilter],
    queryFn: () => getTransactions({ ...range, type: typeFilter === 'all' ? undefined : typeFilter }),
    enabled: rangeValid,
    retry: shouldRetry,
  })

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: ['transactions'] })
    void queryClient.invalidateQueries({ queryKey: ['cash-flow'] })
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const saveMutation = useMutation({
    mutationFn: ({ values, type, id }: { values: TransactionFormValues; type: TransactionType; id?: string }) => {
      const payload = {
        description: values.description.trim(),
        amount: values.amount,
        date: values.date,
        category: values.category.trim() || undefined,
      }
      return id ? updateTransaction(id, payload) : createTransaction(type, payload)
    },
    onSuccess: () => {
      invalidate()
      closeForm()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onMutate: () => setActionError(null),
    onSuccess: invalidate,
    onError: (error) => setActionError(errorMessage(error, 'Não foi possível excluir o lançamento.')),
  })
  const clearMutation = useMutation({
    mutationFn: deleteTransactionsByPeriod,
    onMutate: () => setActionError(null),
    onSuccess: invalidate,
    onError: (error) => setActionError(errorMessage(error, 'Não foi possível zerar o período.')),
  })

  function closeForm(): void {
    setFormState(null)
    saveMutation.reset()
  }

  const handleDelete = (transaction: Transaction): void => {
    if (window.confirm(`Excluir "${transaction.description}"? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate(transaction.id)
    }
  }

  const handleClearPeriod = (): void => {
    const message =
      `Apagar TODOS os lançamentos de ${formatIsoDate(range.startDate)} a ${formatIsoDate(range.endDate)}? ` +
      'Os pedidos não serão alterados. Esta ação não pode ser desfeita.'
    if (window.confirm(message)) clearMutation.mutate(range)
  }

  const shiftMonth = (delta: number): void => {
    const date = new Date(ref.year, ref.month + delta, 1)
    setRef({ year: date.getFullYear(), month: date.getMonth() })
  }

  const transactions = transactionsQuery.data ?? []
  const cashFlow = cashFlowQuery.data
  const isLoading = rangeValid && (transactionsQuery.isPending || cashFlowQuery.isPending)
  const isError = transactionsQuery.isError || cashFlowQuery.isError
  const retry = (): void => {
    void transactionsQuery.refetch()
    void cashFlowQuery.refetch()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Financeiro</h1>
          <p className="text-sm text-cacao/80">Entradas, saídas e saldo da sua confeitaria</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormState({ type: 'INCOME' })}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-sage-dark px-5 font-bold text-cream shadow-cozy transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <Plus size={20} aria-hidden="true" />
            Nova Entrada
          </button>
          <button
            type="button"
            onClick={() => setFormState({ type: 'EXPENSE' })}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-rose-deep px-5 font-bold text-cream shadow-cozy transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <Plus size={20} aria-hidden="true" />
            Nova Despesa
          </button>
        </div>
      </div>

      {actionError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border-2 border-cacao bg-beige px-4 py-3 font-bold text-rose-deep shadow-cozy-sm"
        >
          <p className="min-w-0 break-words">{actionError}</p>
          <button
            type="button"
            onClick={() => setActionError(null)}
            aria-label="Fechar alerta"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-cacao bg-cream shadow-cozy-sm"
          >
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      )}

      {formState && (
        <TransactionFormModal
          type={formState.type}
          transaction={formState.transaction}
          onSubmit={(values) =>
            saveMutation.mutate({ values, type: formState.type, id: formState.transaction?.id })
          }
          onCancel={closeForm}
          isPending={saveMutation.isPending}
          errorMessage={
            saveMutation.isError ? errorMessage(saveMutation.error, 'Não foi possível salvar o lançamento.') : null
          }
        />
      )}

      <Card tone="beige" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {mode === 'month' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Mês anterior"
                className={`${iconButtonClass} bg-cream`}
              >
                <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <span className="min-w-40 text-center text-lg font-bold">{monthLabel}</span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Próximo mês"
                className={`${iconButtonClass} bg-cream`}
              >
                <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="fin-start" className="mb-1 block text-sm font-bold">
                  De
                </label>
                <input
                  id="fin-start"
                  type="date"
                  value={custom.startDate}
                  onChange={(event) => setCustom((c) => ({ ...c, startDate: event.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="fin-end" className="mb-1 block text-sm font-bold">
                  Até
                </label>
                <input
                  id="fin-end"
                  type="date"
                  value={custom.endDate}
                  onChange={(event) => setCustom((c) => ({ ...c, endDate: event.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMode(mode === 'month' ? 'custom' : 'month')}
            className="min-h-11 rounded-xl border-2 border-cacao bg-cream px-4 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {mode === 'month' ? 'Período Personalizado' : 'Navegar por mês'}
          </button>

          <div className="ml-auto min-w-40">
            <label htmlFor="fin-type" className="sr-only">
              Filtrar por tipo
            </label>
            <select
              id="fin-type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TransactionTypeFilter)}
              className={inputClass}
            >
              {typeFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!rangeValid && (
          <p role="alert" className="text-sm font-bold text-rose-deep">
            Informe um período válido (a data inicial não pode ser posterior à final).
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<ArrowUpCircle size={20} strokeWidth={2.5} aria-hidden="true" />}
          label="Total de Entradas"
          value={cashFlow?.totalIncome ?? 0}
          tone="text-sage-dark"
        />
        <SummaryCard
          icon={<ArrowDownCircle size={20} strokeWidth={2.5} aria-hidden="true" />}
          label="Total de Saídas"
          value={cashFlow?.totalExpense ?? 0}
          tone="text-rose-deep"
        />
        <SummaryCard
          icon={<Scale size={20} strokeWidth={2.5} aria-hidden="true" />}
          label="Saldo do Período"
          value={cashFlow?.balance ?? 0}
          tone={(cashFlow?.balance ?? 0) < 0 ? 'text-rose-deep' : 'text-cacao'}
        />
      </div>

      {isLoading && (
        <div role="status" aria-live="polite" className="space-y-3">
          <p className="font-semibold text-cacao/80">Contando as moedinhas...</p>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <TransactionSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <Card tone="beige" role="alert" className="flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            Não foi possível carregar o financeiro.
          </p>
          <button
            type="button"
            onClick={retry}
            className="min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Tentar novamente
          </button>
        </Card>
      )}

      {rangeValid && transactionsQuery.isSuccess && transactions.length === 0 && (
        <Card tone="beige" className="flex flex-col items-center gap-2 py-10 text-center">
          <Wallet size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Nenhum lançamento neste período.</p>
          <p className="text-sm text-cacao/80">Use "Nova Entrada" ou "Nova Despesa" para registrar.</p>
        </Card>
      )}

      {transactions.length > 0 && (
        <ul className="space-y-3">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'INCOME'
            return (
              <li key={transaction.id}>
                <Card tone="cream" className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold break-words" title={transaction.description}>
                      {transaction.description}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-cacao/80">
                      <time dateTime={transaction.date}>{formatIsoDate(transaction.date)}</time>
                      {transaction.category && <span className="truncate">· {transaction.category}</span>}
                      {transaction.orderId && (
                        <span className="rounded-full border-2 border-cacao bg-beige px-2 py-0.5 text-xs font-bold">
                          Pedido #{transaction.orderId.slice(0, 8)}
                        </span>
                      )}
                    </p>
                  </div>
                  <p
                    className={`font-display text-xl font-bold tabular-nums ${isIncome ? 'text-sage-dark' : 'text-rose-deep'}`}
                  >
                    {isIncome ? '+' : '−'} {formatCurrency(transaction.amount)}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormState({ type: transaction.type, transaction })}
                      aria-label={`Editar ${transaction.description}`}
                      className={`${iconButtonClass} bg-beige`}
                    >
                      <Edit2 size={14} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(transaction)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === transaction.id}
                      aria-label={`Excluir ${transaction.description}`}
                      className={`${iconButtonClass} bg-cream text-rose-deep hover:bg-rose-deep hover:text-cream`}
                    >
                      <Trash2 size={14} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      {rangeValid && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClearPeriod}
            disabled={clearMutation.isPending}
            className="text-sm font-bold text-rose-deep underline disabled:opacity-60"
          >
            {clearMutation.isPending ? 'Zerando...' : 'Zerar Período'}
          </button>
        </div>
      )}
    </div>
  )
}
