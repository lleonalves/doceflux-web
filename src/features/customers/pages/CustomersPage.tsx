import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, SearchX, TriangleAlert, UserRound, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { shouldRetry } from '../../../lib/queryRetry'
import { CustomerCard } from '../components/CustomerCard'
import { CustomerForm, type CustomerFormValues } from '../components/CustomerForm'
import { CustomerSkeleton } from '../components/CustomerSkeleton'
import { filterCustomers } from '../customerFilters'
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '../services/customerService'
import type { CreateCustomerPayload, Customer } from '../types'

const SKELETON_COUNT = 6
const gridClass = 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'

/** Campos opcionais vazios viram undefined para não gravar string vazia no backend. */
function toPayload(values: CustomerFormValues): CreateCustomerPayload {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email?.trim() || undefined,
    address: values.address?.trim() || undefined,
  }
}

export default function CustomersPage() {
  const queryClient = useQueryClient()
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    retry: shouldRetry,
  })

  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const onSaved = (): void => {
    queryClient.invalidateQueries({ queryKey: ['customers'] })
    closeForm()
  }
  const createMutation = useMutation({ mutationFn: createCustomer, onSuccess: onSaved })
  const updateMutation = useMutation({
    mutationFn: (payload: CreateCustomerPayload) => updateCustomer(editingCustomer!.id, payload),
    onSuccess: onSaved,
  })
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onMutate: () => setDeleteError(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
    onError: (error) =>
      setDeleteError(
        (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ??
          'Não foi possível excluir o cliente. Tente novamente.',
      ),
  })

  const handleDelete = (customer: Customer): void => {
    if (window.confirm(`Deseja realmente excluir o cliente "${customer.name}"?`)) {
      deleteMutation.mutate(customer.id)
    }
  }

  const activeMutation = editingCustomer ? updateMutation : createMutation
  const formError = activeMutation.isError
    ? (activeMutation.error as { response?: { data?: { message?: string } } }).response?.data?.message ??
      'Não foi possível salvar o cliente. Tente novamente.'
    : null

  function closeForm(): void {
    setIsFormOpen(false)
    setEditingCustomer(null)
    createMutation.reset()
    updateMutation.reset()
  }

  const openCreate = (): void => {
    closeForm()
    setIsFormOpen(true)
  }

  const openEdit = (customer: Customer): void => {
    closeForm()
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  const visibleCustomers = useMemo(() => (data ? filterCustomers(data, search) : []), [data, search])
  const isEmpty = data !== undefined && data.length === 0
  const hasNoMatches = data !== undefined && data.length > 0 && visibleCustomers.length === 0

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-cacao/80">Gerencie os clientes da sua confeitaria</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-cacao bg-rose-deep px-5 font-bold text-cream shadow-cozy transition-all hover:bg-[#7a2834] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {deleteError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border-2 border-cacao bg-beige px-4 py-3 font-bold text-rose-deep shadow-cozy-sm"
        >
          <p className="min-w-0 break-words">{deleteError}</p>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            aria-label="Fechar alerta"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-cacao bg-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cacao/40 p-4 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border-2 border-cacao bg-cream p-6 shadow-cozy">
            <h2 className="mb-4 font-display text-2xl text-cacao">
              {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <CustomerForm
              defaultValues={
                editingCustomer
                  ? {
                      name: editingCustomer.name,
                      phone: editingCustomer.phone,
                      email: editingCustomer.email ?? '',
                      address: editingCustomer.address ?? '',
                    }
                  : undefined
              }
              onSubmit={(values) =>
                editingCustomer
                  ? updateMutation.mutate(toPayload(values))
                  : createMutation.mutate(toPayload(values))
              }
              onCancel={closeForm}
              isPending={activeMutation.isPending}
              errorMessage={formError}
            />
          </div>
        </div>
      )}

      {data && data.length > 0 && (
        <>
          <Card tone="beige" className="flex items-center gap-3 py-3 lg:max-w-xs">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-cacao bg-cream">
              <Users size={20} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            </span>
            <div>
              <p className="text-sm font-bold text-cacao/80">Total de clientes</p>
              <p className="font-display text-2xl leading-none font-bold tabular-nums">{data.length}</p>
            </div>
          </Card>

          <div className="max-w-md">
            <label htmlFor="customer-search" className="mb-1 block text-sm font-bold">Buscar cliente</label>
            <div className="relative">
              <Search
                size={18}
                strokeWidth={2.5}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-cacao/60"
              />
              <input
                id="customer-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome ou telefone"
                autoComplete="off"
                className="min-h-11 w-full rounded-xl border-2 border-cacao bg-cream py-2 pr-3 pl-10"
              />
            </div>
          </div>
        </>
      )}

      {isPending && (
        <div role="status" aria-live="polite" className="space-y-4">
          <p className="font-semibold text-cacao/80">A carregar os clientes...</p>
          <div className={gridClass}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <CustomerSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <Card tone="beige" role="alert" className="flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            Não foi possível carregar os clientes.
          </p>
          <p className="text-sm text-cacao/80">
            {data ? 'Exibindo a última lista carregada. ' : ''}Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="min-h-11 rounded-xl border-2 border-cacao bg-rose-deep px-4 font-bold text-cream shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70"
          >
            {isFetching ? 'Tentando...' : 'Tentar novamente'}
          </button>
        </Card>
      )}

      {isEmpty && !isError && (
        <Card tone="beige" className="flex flex-col items-center gap-2 py-10 text-center">
          <UserRound size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Nenhum cliente cadastrado. Adicione o primeiro!</p>
        </Card>
      )}

      {hasNoMatches && (
        <Card tone="beige" className="flex flex-col items-center gap-3 py-10 text-center">
          <SearchX size={48} strokeWidth={2} aria-hidden="true" className="text-rose-soft" />
          <p className="text-lg font-semibold">Nenhum cliente corresponde à sua busca.</p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="min-h-11 rounded-xl border-2 border-cacao bg-cream px-4 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Limpar busca
          </button>
        </Card>
      )}

      {visibleCustomers.length > 0 && (
        <div className={gridClass}>
          {visibleCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={openEdit}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === customer.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
