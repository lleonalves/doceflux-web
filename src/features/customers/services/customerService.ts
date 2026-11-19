import { api } from '../../../config/api'
import type { CreateCustomerPayload, Customer, UpdateCustomerPayload } from '../types'

/** Sem paginação no backend: a busca é aplicada localmente sobre a lista carregada. */
export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>('/api/customers')
  return data
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const { data } = await api.post<Customer>('/api/customers', payload)
  return data
}

export async function updateCustomer(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
  const { data } = await api.put<Customer>(`/api/customers/${id}`, payload)
  return data
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete(`/api/customers/${id}`)
}
