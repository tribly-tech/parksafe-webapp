'use client'

import { useQuery } from '@tanstack/react-query'
import { getReportsReceived, getReportsSent } from '@/lib/api/reports'
import { useAuthStore } from '@/lib/store/authStore'
import { ApiError } from '@/lib/api/client'

export const REPORTS_RECEIVED_KEY = ['reports', 'received'] as const
export const REPORTS_SENT_KEY = ['reports', 'sent'] as const

function useReportQuery<T>(
  queryKey: readonly string[],
  queryFn: () => Promise<T>
) {
  const token = useAuthStore(s => s.token)

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(token),
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false
      return failureCount < 2
    },
  })

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useReportsReceived() {
  const token = useAuthStore(s => s.token)
  return useReportQuery(REPORTS_RECEIVED_KEY, () => getReportsReceived(token ?? ''))
}

export function useReportsSent() {
  const token = useAuthStore(s => s.token)
  return useReportQuery(REPORTS_SENT_KEY, () => getReportsSent(token ?? ''))
}
