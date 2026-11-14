import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(120, 'Máximo de 120 caracteres'),
  price: z.number({ error: 'Informe um preço válido' }).min(0.01, 'Preço mínimo é R$ 0,01'),
  stockQuantity: z
      .number({ error: 'Informe a quantidade' })
      .int('Use um número inteiro')
      .min(0, 'Estoque não pode ser negativo'),
  imageUrl: z.union([z.literal(''), z.url('URL inválida')]).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
}

export function ProductForm({ defaultValues, onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', imageUrl: '', ...defaultValues },
  })

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-bold">Nome</label>
          <input
              id="name"
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
          <label htmlFor="imageUrl" className="text-sm font-bold">URL da imagem (opcional)</label>
          <input
              id="imageUrl"
              type="url"
              placeholder="https://..."
              {...register('imageUrl')}
              className="rounded-lg border-2 border-cacao bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-soft"
          />
          {errors.imageUrl && <span className="text-xs text-rose-deep">{errors.imageUrl.message}</span>}
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
              disabled={isSubmitting}
              className="rounded-lg border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60"
          >
            Salvar
          </button>
        </div>
      </form>
  )
}