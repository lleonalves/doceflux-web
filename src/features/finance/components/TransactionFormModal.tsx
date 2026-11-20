import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Transaction, TransactionType } from '../types'

function todayIso(): string {
  const now = new Date()
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const transactionSchema = z.object({
  description: z.string().trim().min(1, 'Descrição é obrigatória').max(255, 'Máximo de 255 caracteres'),
  amount: z
    .number({ error: 'Informe o valor' })
    .positive('O valor deve ser maior que zero')
    .max(9999999999.99, 'Valor muito alto')
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6, 'Use no máximo 2 casas decimais'),
  date: z.string().min(1, 'Data é obrigatória'),
  category: z.string().trim().max(60, 'Máximo de 60 caracteres'),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormModalProps {
  /** Tipo usado na criação; ignorado quando `transaction` é informada. */
  type: TransactionType
  transaction?: Transaction
  onSubmit: (values: TransactionFormValues) => void
  onCancel: () => void
  isPending?: boolean
  errorMessage?: string | null
}

const inputClass =
  'min-h-11 w-full rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft'
const errorClass = 'text-xs font-bold text-rose-deep'

export function TransactionFormModal({
  type,
  transaction,
  onSubmit,
  onCancel,
  isPending,
  errorMessage,
}: TransactionFormModalProps) {
  const effectiveType = transaction?.type ?? type
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description ?? '',
      amount: transaction?.amount,
      date: transaction?.date ?? todayIso(),
      category: transaction?.category ?? '',
    },
  })

  const title = transaction
    ? 'Editar lançamento'
    : effectiveType === 'INCOME'
      ? 'Nova Entrada'
      : 'Nova Despesa'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cacao/40 p-4 backdrop-blur-sm">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border-2 border-cacao bg-cream p-6 shadow-cozy">
        <h2 className="mb-4 font-display text-2xl text-cacao">{title}</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border-2 border-cacao bg-rose-soft/20 px-3 py-2 text-sm font-bold break-words text-rose-deep"
            >
              {errorMessage}
            </div>
          )}

          {transaction?.orderId && (
            <p className="rounded-lg border-2 border-cacao bg-beige px-3 py-2 text-sm text-cacao/80">
              Este lançamento está vinculado a um pedido. A edição altera apenas o registro financeiro e não
              modifica o pedido original.
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="tx-description" className="text-sm font-bold">
              Descrição
            </label>
            <input id="tx-description" type="text" maxLength={255} {...register('description')} className={inputClass} />
            {errors.description && <span className={errorClass}>{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <label htmlFor="tx-amount" className="text-sm font-bold">
                Valor (R$)
              </label>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                {...register('amount', { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.amount && <span className={errorClass}>{errors.amount.message}</span>}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <label htmlFor="tx-date" className="text-sm font-bold">
                Data
              </label>
              <input id="tx-date" type="date" {...register('date')} className={inputClass} />
              {errors.date && <span className={errorClass}>{errors.date.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tx-category" className="text-sm font-bold">
              Categoria (opcional)
            </label>
            <input id="tx-category" type="text" maxLength={60} {...register('category')} className={inputClass} />
            {errors.category && <span className={errorClass}>{errors.category.message}</span>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border-2 border-cacao bg-beige px-4 py-2 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
            >
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
