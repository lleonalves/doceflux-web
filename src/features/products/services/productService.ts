import { api } from '../../../config/api'
import type { CreateProductPayload, Product } from '../types'

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
