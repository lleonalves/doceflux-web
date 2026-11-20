/** Contratos de /api/finance (TransactionResponse, CashFlowResponse e requests do backend). */

export type TransactionType = 'INCOME' | 'EXPENSE'

export type TransactionTypeFilter = 'all' | TransactionType

export interface Transaction {
  id: string
  type: TransactionType
  description: string
  amount: number
  /** LocalDate ISO (YYYY-MM-DD). */
  date: string
  category: string | null
  /** Preenchido em receitas vinculadas a um pedido (inclusive as geradas automaticamente). */
  orderId: string | null
  createdAt: string
  updatedAt: string
}

export interface CashFlow {
  startDate: string
  endDate: string
  totalIncome: number
  totalExpense: number
  balance: number
}

/** Período inclusivo, em datas ISO (YYYY-MM-DD). */
export interface DateRange {
  startDate: string
  endDate: string
}

export interface TransactionFilters extends DateRange {
  type?: TransactionType
}

/** Payload de POST /api/finance/incomes e /expenses (sem tipo, loja nem pedido). */
export interface CreateTransactionPayload {
  description: string
  amount: number
  date: string
  category?: string
}

/** Payload de PUT /api/finance/transactions/{id}. */
export type UpdateTransactionPayload = CreateTransactionPayload
