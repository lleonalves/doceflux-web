import { api } from '../../config/api'
import type { Order } from './types'

/** O backend devolve a lista completa (sem paginação) e sem ordenação garantida. */
export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/api/orders')
  return data
}
