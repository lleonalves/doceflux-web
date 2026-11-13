import { Search } from 'lucide-react'
import type { ProductStatusFilter } from '../types'

const statusOptions: readonly { value: ProductStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
]

interface ProductFiltersProps {
  search: string
  status: ProductStatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: ProductStatusFilter) => void
}

export function ProductFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <label htmlFor="product-search" className="mb-1 block text-sm font-bold">
          Buscar produto
        </label>
        <div className="relative">
          <Search
            size={18}
            strokeWidth={2.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-cacao/60"
          />
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nome do produto"
            autoComplete="off"
            className="min-h-11 w-full rounded-xl border-2 border-cacao bg-cream py-2 pr-3 pl-10"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-bold">Situação</legend>
        <div className="flex gap-2">
          {statusOptions.map(({ value, label }) => (
            <label
              key={value}
              className="flex min-h-11 cursor-pointer items-center rounded-xl border-2 border-cacao bg-cream px-3 text-sm font-bold transition has-checked:bg-rose-deep has-checked:text-cream has-checked:shadow-cozy-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-rose-soft"
            >
              <input
                type="radio"
                name="product-status"
                value={value}
                checked={status === value}
                onChange={() => onStatusChange(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
