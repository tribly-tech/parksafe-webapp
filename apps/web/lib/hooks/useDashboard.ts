'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '@/lib/api/dashboard'
import { useAuthStore } from '@/lib/store/authStore'
import { ApiError } from '@/lib/api/client'

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const

export function useDashboard() {
  const token = useAuthStore(s => s.token)

  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => getDashboardSummary(token ?? ''),
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false
      return failureCount < 2
    },
  })

  return {
    summary: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isFetching && !query.isLoading,
  }
}
