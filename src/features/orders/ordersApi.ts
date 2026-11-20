import { api } from '../../config/api'
import type { ChangeOrderStatusPayload, CreateOrderPayload, Order, OrderStatus } from './types'

/** O backend devolve a lista completa (sem paginação) e sem ordenação garantida. */
export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/api/orders')
  return data
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/api/orders/${id}`)
  return data
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>('/api/orders', payload)
  return data
}

export async function changeOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const payload: ChangeOrderStatusPayload = { status }
  const { data } = await api.patch<Order>(`/api/orders/${id}/status`, payload)
  return data
}

/** Erros do backend vêm como ProblemDetail (`detail`). */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  return (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? fallback
}
