import { api } from '../../../config/api'
import type {
  CashFlow,
  CreateTransactionPayload,
  DateRange,
  Transaction,
  TransactionFilters,
  TransactionType,
  UpdateTransactionPayload,
} from '../types'

export async function getTransactions({ type, startDate, endDate }: TransactionFilters): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>('/api/finance/transactions', {
    params: { type, startDate, endDate },
  })
  return data
}

export async function getCashFlow(range: DateRange): Promise<CashFlow> {
  const { data } = await api.get<CashFlow>('/api/finance/cash-flow', { params: range })
  return data
}

export async function createTransaction(
  type: TransactionType,
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const path = type === 'INCOME' ? 'incomes' : 'expenses'
  const { data } = await api.post<Transaction>(`/api/finance/${path}`, payload)
  return data
}

export async function updateTransaction(id: string, payload: UpdateTransactionPayload): Promise<Transaction> {
  const { data } = await api.put<Transaction>(`/api/finance/transactions/${id}`, payload)
  return data
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/api/finance/transactions/${id}`)
}

export async function deleteTransactionsByPeriod(range: DateRange): Promise<void> {
  await api.delete('/api/finance/transactions', { params: range })
}
