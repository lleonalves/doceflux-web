/** Contratos de GET /api/orders (OrderResponse / OrderItemResponse do backend). */

export type OrderStatus = 'PENDING' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED'

export type OrderItemType = 'CATALOG' | 'CUSTOM'

export interface OrderItem {
  id: string
  itemType: OrderItemType
  /** Nulo em itens CUSTOM (sem produto do catálogo). */
  productId: string | null
  name: string
  description: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  description: string | null
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  /** Instant em ISO-8601 (UTC). */
  createdAt: string
  updatedAt: string
}
