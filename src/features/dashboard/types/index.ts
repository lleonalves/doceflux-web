import type { OrderStatus } from '../../orders/types'

/** Contratos de GET /api/dashboard/summary (DashboardSummaryResponse do backend). */

export interface FinancialSummary {
  totalIncomes: number
  totalExpenses: number
  /** Receitas menos despesas; pode ser negativo. */
  netBalance: number
  transactionsCount: number
}

export interface OrderStatusCount {
  status: OrderStatus
  count: number
}

export interface OrdersSummary {
  /** Pedidos criados no período, em qualquer status. */
  totalOrders: number
  /** Pedidos criados no período, exceto cancelados. */
  validOrdersCount: number
  totalOrdersAmount: number
  averageTicket: number
  /** Todos os status vêm na lista, inclusive com contagem zero. */
  ordersByStatus: OrderStatusCount[]
}

/** Estado atual; não depende do período. */
export interface BusinessMetrics {
  totalCustomers: number
  activeProductsCount: number
}

export interface DashboardSummary {
  /** LocalDate ISO (YYYY-MM-DD). */
  startDate: string
  endDate: string
  financialSummary: FinancialSummary
  ordersSummary: OrdersSummary
  businessMetrics: BusinessMetrics
}
