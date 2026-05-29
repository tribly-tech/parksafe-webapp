import { apiFetch } from './client'
import type { DashboardSummary } from '@parksafe/types'

export async function getDashboardSummary(token: string): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>('/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
