import { Card } from '../../../components/ui/Card'
import { formatCurrency } from '../../../lib/format'
import type { Product } from '../types'

export function ProductCard({ product }: { product: Product }) {
  const description = product.description?.trim()

  return (
    <Card tone="cream" className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 text-lg leading-tight font-semibold break-words">{product.name}</h2>
        <span
          className={`shrink-0 rounded-full border-2 border-cacao px-2.5 py-0.5 text-xs font-bold ${
            product.active ? 'bg-sage/25 text-sage-dark' : 'bg-cacao/10 text-cacao/70'
          }`}
        >
          {product.active ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      {description ? (
        <p className="line-clamp-2 text-sm break-words text-cacao/80">{description}</p>
      ) : (
        <p className="text-sm text-cacao/60 italic">Sem descrição</p>
      )}

      <p className="mt-auto pt-3 font-display text-2xl font-bold text-rose-deep tabular-nums">
        {formatCurrency(product.price)}
      </p>
    </Card>
  )
}
