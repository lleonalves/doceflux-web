import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Máximo de 50 caracteres'),
  price: z.number({ error: 'Informe um preço válido' }).min(0.01, 'Preço mínimo é R$ 0,01'),
  stockQuantity: z
      .number({ error: 'Informe a quantidade' })
      .int('Use um número inteiro')
      .min(0, 'Estoque não pode ser negativo'),
  description: z.string().max(140, 'Máximo de 140 caracteres').optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
  isPending?: boolean
  errorMessage?: string | null
}

export function ProductForm({ defaultValues, onSubmit, onCancel, isPending, errorMessage }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', description: '', ...defaultValues },
  })

  const nameLength = watch('name')?.length ?? 0
  const descriptionLength = watch('description')?.length ?? 0

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
      >
        {errorMessage && (
            <div role="alert" className="rounded-lg border-2 border-cacao bg-rose-soft/20 px-3 py-2 text-sm font-bold text-rose-deep">
              {errorMessage}
            </div>
        )}

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <label htmlFor="name" className="text-sm font-bold">Nome</label>
            <span className="text-xs text-cacao/60">{nameLength}/50</span>
          </div>
          <input
              id="name"
              maxLength={50}
              type="text"
              {...register('name')}
              className="rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft"
          />
          {errors.name && <span className="text-xs text-rose-deep">{errors.name.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="price" className="text-sm font-bold">Preço (R$)</label>
            <input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft"
            />
            {errors.price && <span className="text-xs text-rose-deep">{errors.price.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="stockQuantity" className="text-sm font-bold">Estoque</label>
            <input
                id="stockQuantity"
                type="number"
                {...register('stockQuantity', { valueAsNumber: true })}
                className="rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft"
            />
            {errors.stockQuantity && (
                <span className="text-xs text-rose-deep">{errors.stockQuantity.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <label htmlFor="description" className="text-sm font-bold">Descrição (opcional)</label>
            <span className="text-xs text-cacao/60">{descriptionLength}/140</span>
          </div>
          <textarea
              id="description"
              maxLength={140}
              rows={3}
              {...register('description')}
              className="rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft"
          />
          {errors.description && <span className="text-xs text-rose-deep">{errors.description.message}</span>}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border-2 border-cacao bg-beige px-4 py-2 font-bold shadow-cozy-sm transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Cancelar
          </button>
          <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="rounded-lg border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60"
          >
            {isSubmitting || isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
  )
}