import { api } from '../../../config/api'
import type { CreateProductPayload, Product, UpdateProductPayload } from '../types'

/**
 * O backend devolve a lista completa (sem paginação). O filtro opcional `?active=`
 * não é usado: busca e filtros são aplicados localmente sobre os dados carregados.
 */
export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products')
  return data
}

export async function createProduct(product: CreateProductPayload): Promise<Product> {
  const { data } = await api.post<Product>('/api/products', product)
  return data
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  const { data } = await api.put<Product>(`/api/products/${id}`, payload)
  return data
}

/** O backend exige o novo valor no corpo: `active` é o estado desejado, não o atual. */
export async function toggleProductActive(id: string, active: boolean): Promise<Product> {
  const { data } = await api.patch<Product>(`/api/products/${id}/active`, { active })
  return data
}
