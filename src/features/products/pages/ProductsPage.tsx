import { useQuery } from '@tanstack/react-query'
import { CakeSlice, CheckCircle2, Package, SearchX, TriangleAlert, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { shouldRetry } from '../../../lib/queryRetry'
import { ProductCard } from '../components/ProductCard'
import { ProductFilters } from '../components/ProductFilters'
import { ProductSkeleton } from '../components/ProductSkeleton'
import { countActive, filterProducts } from '../productFilters'
import { getProducts } from '../services/productService'
import type { ProductStatusFilter } from '../types'

const SKELETON_COUNT = 8
const gridClass = 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <Card tone="beige" className="flex items-center gap-3 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-cacao bg-cream">
        <Icon size={20} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
      </span>
      <div>
        <p className="text-sm font-bold text-cacao/80">{label}</p>
        <p className="font-display text-2xl leading-none font-bold tabular-nums">{value}</p>
      </div>
    </Card>
  )
}

export function ProductsPage() {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    retry: shouldRetry,
  })
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<ProductStatusFilter>('all')

  const visibleProducts = useMemo(
    () => (data ? filterProducts(data, search, status) : []),
    [data, search, status],
  )

  const clearFilters = (): void => {
    setSearch('')
    setStatus('all')
  }

  const isEmptyCatalog = data !== undefined && data.length === 0
  const hasNoMatches = data !== undefined && data.length > 0 && visibleProducts.length === 0

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo de Produtos</h1>
          <p className="text-sm text-cacao/80">Gerencie os produtos da sua confeitaria</p>
        </div>
        <button
          type="button"
          aria-disabled="true"
          title="Disponível em breve"
          className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream opacity-80 shadow-cozy-sm"
        >
          Novo Produto
          <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-bold text-rose-deep">
            Em breve
          </span>
        </button>
      </div>

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
          <SummaryCard icon={Package} label="Total de produtos" value={data.length} />
          <SummaryCard icon={CheckCircle2} label="Produtos ativos" value={countActive(data)} />
        </div>
      )}

      {data && data.length > 0 && (
        <ProductFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />
      )}

      {isPending && (
        <div role="status" aria-live="polite" className="space-y-4">
          <p className="font-semibold text-cacao/80">A carregar a vitrine de doces...</p>
          <div className={gridClass}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <Card tone="beige" role="alert" className="flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            Não foi possível carregar os produtos.
          </p>
          <p className="text-sm text-cacao/80">
            {data ? 'Exibindo a última lista carregada. ' : ''}Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isFetching ? 'Tentando...' : 'Tentar novamente'}
          </button>
        </Card>
      )}

      {isEmptyCatalog && !isError && (
        <Card tone="beige" className="flex flex-col items-center gap-2 py-10 text-center">
          <CakeSlice size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">A vitrine está vazia. Adicione o seu primeiro doce!</p>
        </Card>
      )}

      {hasNoMatches && (
        <Card tone="beige" className="flex flex-col items-center gap-3 py-10 text-center">
          <SearchX size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Nenhum produto corresponde à sua busca.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 rounded-xl border-2 border-cacao bg-cream px-4 font-bold shadow-cozy-sm transition hover:-translate-y-0.5"
          >
            Limpar filtros
          </button>
        </Card>
      )}

      {visibleProducts.length > 0 && (
        <div className={gridClass}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
