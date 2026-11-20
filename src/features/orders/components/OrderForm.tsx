import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { formatCurrency } from '../../../lib/format'
import type { Customer } from '../../customers/types'
import type { Product } from '../../products/types'

const orderSchema = z.object({
  customerId: z.string().min(1, 'Selecione o cliente'),
  description: z.string().max(2000, 'Máximo de 2000 caracteres'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Selecione o produto'),
        quantity: z.number({ error: 'Informe a quantidade' }).int('Use um número inteiro').min(1, 'Mínimo 1'),
      }),
    )
    .min(1, 'Adicione ao menos um item'),
})

export type OrderFormValues = z.infer<typeof orderSchema>

interface OrderFormProps {
  customers: Customer[]
  products: Product[]
  onSubmit: (values: OrderFormValues) => void
  onCancel: () => void
  isPending?: boolean
  errorMessage?: string | null
}

const inputClass =
  'min-h-11 w-full rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft'
const errorClass = 'text-xs font-bold text-rose-deep'

export function OrderForm({ customers, products, onSubmit, onCancel, isPending, errorMessage }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerId: '', description: '', items: [{ productId: '', quantity: 1 }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = useWatch({ control, name: 'items' })
  const description = useWatch({ control, name: 'description' })

  const activeProducts = products.filter((product) => product.active)
  const subtotalOf = (index: number): number => {
    const item = items?.[index]
    const price = products.find((product) => product.id === item?.productId)?.price ?? 0
    return item && Number.isFinite(item.quantity) ? price * item.quantity : 0
  }
  const total = fields.reduce((sum, _field, index) => sum + subtotalOf(index), 0)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border-2 border-cacao bg-rose-soft/20 px-3 py-2 text-sm font-bold break-words text-rose-deep"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="customerId" className="text-sm font-bold">
          Cliente
        </label>
        <select id="customerId" {...register('customerId')} className={inputClass}>
          <option value="">Selecione...</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {errors.customerId && <span className={errorClass}>{errors.customerId.message}</span>}
      </div>

      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-1 text-sm font-bold">Itens</legend>
        {fields.map((field, index) => {
          const rowErrors = errors.items?.[index]
          return (
            <div key={field.id} className="flex min-w-0 flex-col gap-2 rounded-xl border-2 border-cacao bg-beige p-3">
              <div className="flex min-w-0 items-start gap-2">
                <div className="min-w-0 flex-1">
                  <select
                    aria-label={`Produto do item ${index + 1}`}
                    {...register(`items.${index}.productId`)}
                    className={inputClass}
                  >
                    <option value="">Produto...</option>
                    {activeProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — {formatCurrency(product.price)} (estoque: {product.stockQuantity})
                      </option>
                    ))}
                  </select>
                  {rowErrors?.productId && <span className={errorClass}>{rowErrors.productId.message}</span>}
                </div>
                <div className="w-20 shrink-0">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    aria-label={`Quantidade do item ${index + 1}`}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    className={inputClass}
                  />
                  {rowErrors?.quantity && <span className={errorClass}>{rowErrors.quantity.message}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label={`Remover item ${index + 1}`}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-cacao bg-cream text-rose-deep shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40"
                >
                  <Trash2 size={16} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs font-semibold text-cacao/80">Subtotal: {formatCurrency(subtotalOf(index))}</p>
            </div>
          )
        })}
        {typeof errors.items?.message === 'string' && <span className={errorClass}>{errors.items.message}</span>}
        <button
          type="button"
          onClick={() => append({ productId: '', quantity: 1 })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-cacao bg-beige px-4 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          Adicionar item
        </button>
      </fieldset>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor="description" className="text-sm font-bold">
            Observações (opcional)
          </label>
          <span className="text-xs text-cacao/60">{description?.length ?? 0}/2000</span>
        </div>
        <textarea id="description" rows={3} maxLength={2000} {...register('description')} className={inputClass} />
        {errors.description && <span className={errorClass}>{errors.description.message}</span>}
      </div>

      <p className="flex items-baseline justify-between border-t-2 border-cacao/20 pt-3">
        <span className="text-sm font-bold text-cacao/80">Total</span>
        <span className="font-display text-2xl font-bold text-rose-deep tabular-nums">{formatCurrency(total)}</span>
      </p>

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
          {isPending ? 'Registrando...' : 'Registrar pedido'}
        </button>
      </div>
    </form>
  )
}
