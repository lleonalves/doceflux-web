import { Edit2 } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { formatCurrency } from '../../../lib/format'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onToggleActive?: (product: Product) => void
  isToggling?: boolean
}

export function ProductCard({ product, onEdit, onToggleActive, isToggling }: ProductCardProps) {
  const description = product.description?.trim()

  return (
    <Card tone="cream" className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 truncate text-lg leading-tight font-semibold" title={product.name}>{product.name}</h2>
        <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          title="Clique para alternar status"
          disabled={isToggling}
          onClick={() => onToggleActive?.(product)}
          className={`shrink-0 cursor-pointer rounded-full border-2 border-cacao px-2.5 py-0.5 text-xs font-bold disabled:cursor-wait disabled:opacity-60 ${
            product.active ? 'bg-sage/25 text-sage-dark' : 'bg-cacao/10 text-cacao/70'
          }`}
        >
          {product.active ? 'Ativo' : 'Inativo'}
        </button>
        <button
          type="button"
          onClick={() => onEdit(product)}
          aria-label={`Editar ${product.name}`}
          className="flex size-8 items-center justify-center rounded-lg border-2 border-cacao bg-beige shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Edit2 size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>
        </div>
      </div>

      {description ? (
        <p className="line-clamp-2 min-h-[2.5rem] text-sm break-words text-cacao/80">{description}</p>
      ) : (
        <p className="min-h-[2.5rem] text-sm text-cacao/60 italic">Sem descrição</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <p className="font-display text-2xl font-bold text-rose-deep tabular-nums">
          {formatCurrency(product.price)}
        </p>
        <p
          className={`text-sm font-bold ${product.stockQuantity > 0 ? 'text-sage-dark' : 'text-rose-deep'}`}
        >
          {product.stockQuantity > 0 ? `${product.stockQuantity} em estoque` : 'Sem estoque'}
        </p>
      </div>
    </Card>
  )
}
