import { api } from '../../../config/api'
import type { Product } from '../types'

/**
 * O backend devolve a lista completa (sem paginação). O filtro opcional `?active=`
 * não é usado: busca e filtros são aplicados localmente sobre os dados carregados.
 */
export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/api/products')
  return data
}
