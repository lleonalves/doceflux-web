import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CakeSlice, CheckCircle2, Package, SearchX, TriangleAlert, Plus, type LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { shouldRetry } from '../../../lib/queryRetry'
import { ProductCard } from '../components/ProductCard'
import { ProductFilters } from '../components/ProductFilters'
import { ProductSkeleton } from '../components/ProductSkeleton'
import { countActive, filterProducts } from '../productFilters'
import { createProduct, getProducts, toggleProductActive, updateProduct } from '../services/productService'
import type { Product, ProductStatusFilter, UpdateProductPayload } from '../types'
import { ProductForm } from '../components/ProductForm'

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

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    retry: shouldRetry,
  })

  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<ProductStatusFilter>('all')
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFormOpen, setIsFormOpen] = useState(() => searchParams.get('new') === 'true')

  // Atalhos da Home (?new=true): abrem o modal uma vez e limpam o parâmetro.
  useEffect(() => {
    if (searchParams.has('new')) {
      setSearchParams(
        (params) => {
          params.delete('new')
          return params
        },
        { replace: true },
      )
    }
  }, [searchParams, setSearchParams])

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const closeForm = (): void => {
    setIsFormOpen(false)
    setEditingProduct(null)
    createMutation.reset()
    updateMutation.reset()
  }

  const openCreate = (): void => {
    closeForm()
    setIsFormOpen(true)
  }

  const openEdit = (product: Product): void => {
    closeForm()
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const onSaved = (): void => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    closeForm()
  }

  const createMutation = useMutation({ mutationFn: createProduct, onSuccess: onSaved })
  const updateMutation = useMutation({
    mutationFn: (values: UpdateProductPayload) => updateProduct(editingProduct!.id, values),
    onSuccess: onSaved,
  })
  const toggleMutation = useMutation({
    mutationFn: (product: Product) => toggleProductActive(product.id, !product.active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
  const activeMutation = editingProduct ? updateMutation : createMutation
  const formError = activeMutation.isError
    ? (activeMutation.error as { response?: { data?: { message?: string } } }).response?.data?.message ??
      'Não foi possível salvar o produto. Tente novamente.'
    : null

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
              onClick={openCreate}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-rose-deep px-5 font-bold text-cream shadow-cozy hover:bg-[#7a2834] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        {isFormOpen && (
            <div className="fixed inset-0 bg-cacao/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-cream border-2 border-cacao shadow-cozy rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl text-cacao mb-4 font-display">
                  {editingProduct ? 'Editar Doce' : 'Cadastrar Novo Doce'}
                </h2>
                <ProductForm
                    defaultValues={
                      editingProduct
                        ? {
                            name: editingProduct.name,
                            price: editingProduct.price,
                            stockQuantity: editingProduct.stockQuantity,
                            description: editingProduct.description ?? '',
                          }
                        : undefined
                    }
                    onSubmit={(formData) =>
                      editingProduct
                        ? updateMutation.mutate(formData)
                        : createMutation.mutate(formData)
                    }
                    onCancel={closeForm}
                    isPending={activeMutation.isPending}
                    errorMessage={formError}
                />
              </div>
            </div>
        )}

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
                  <ProductCard key={product.id} product={product} onEdit={openEdit}
                      onToggleActive={(p) => toggleMutation.mutate(p)}
                      isToggling={toggleMutation.isPending && toggleMutation.variables?.id === product.id}
                  />
              ))}
            </div>
        )}
      </div>
  )
}