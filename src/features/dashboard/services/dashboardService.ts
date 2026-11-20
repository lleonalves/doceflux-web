import { api } from '../../../config/api'
import type { DashboardSummary } from '../types'

export async function getDashboardSummary(startDate: string, endDate: string): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/api/dashboard/summary', { params: { startDate, endDate } })
  return data
}
