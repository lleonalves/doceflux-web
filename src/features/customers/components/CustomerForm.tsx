import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const customerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(120, 'Máximo de 120 caracteres'),
  phone: z.string().trim().min(1, 'Telefone é obrigatório').max(20, 'Máximo de 20 caracteres'),
  email: z.union([z.literal(''), z.email('E-mail inválido').max(160, 'Máximo de 160 caracteres')]).optional(),
  address: z.string().max(255, 'Máximo de 255 caracteres').optional(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>
  onSubmit: (values: CustomerFormValues) => void
  onCancel: () => void
  isPending?: boolean
  errorMessage?: string | null
}

const inputClass =
  'rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft'

export function CustomerForm({ defaultValues, onSubmit, onCancel, isPending, errorMessage }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', phone: '', email: '', address: '', ...defaultValues },
  })

  const busy = isSubmitting || isPending
  const count = (field: keyof CustomerFormValues) => watch(field)?.length ?? 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {errorMessage && (
        <div role="alert" className="rounded-lg border-2 border-cacao bg-rose-soft/20 px-3 py-2 text-sm font-bold text-rose-deep">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor="name" className="text-sm font-bold">Nome</label>
          <span className="text-xs text-cacao/60">{count('name')}/120</span>
        </div>
        <input id="name" type="text" maxLength={120} {...register('name')} className={inputClass} />
        {errors.name && <span className="text-xs text-rose-deep">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor="phone" className="text-sm font-bold">Telefone / WhatsApp</label>
          <span className="text-xs text-cacao/60">{count('phone')}/20</span>
        </div>
        <input id="phone" type="tel" maxLength={20} {...register('phone')} className={inputClass} />
        {errors.phone && <span className="text-xs text-rose-deep">{errors.phone.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor="email" className="text-sm font-bold">E-mail (opcional)</label>
          <span className="text-xs text-cacao/60">{count('email')}/160</span>
        </div>
        <input id="email" type="email" maxLength={160} {...register('email')} className={inputClass} />
        {errors.email && <span className="text-xs text-rose-deep">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor="address" className="text-sm font-bold">Endereço (opcional)</label>
          <span className="text-xs text-cacao/60">{count('address')}/255</span>
        </div>
        <textarea id="address" rows={3} maxLength={255} {...register('address')} className={inputClass} />
        {errors.address && <span className="text-xs text-rose-deep">{errors.address.message}</span>}
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border-2 border-cacao bg-beige px-4 py-2 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          {busy ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
