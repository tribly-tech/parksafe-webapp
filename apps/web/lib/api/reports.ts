import { apiFetch } from './client'
import type { ContactEventSummary, ReportedVehicleEvent } from '@parksafe/types'

export async function getReportsReceived(token: string): Promise<ContactEventSummary[]> {
  const res = await apiFetch<{ events: ContactEventSummary[] }>('/dashboard/reports/received', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.events
}

export async function getReportsSent(token: string): Promise<ReportedVehicleEvent[]> {
  const res = await apiFetch<{ events: ReportedVehicleEvent[] }>('/dashboard/reports/sent', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.events
}
