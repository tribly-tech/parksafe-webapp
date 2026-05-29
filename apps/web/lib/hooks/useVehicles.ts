'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVehicles, createVehicle, deactivateVehicle } from '@/lib/api/vehicles'
import { useAuthStore } from '@/lib/store/authStore'
import type { CreateVehicleInput } from '@parksafe/types'
import { DASHBOARD_QUERY_KEY } from './useDashboard'

const VEHICLES_QUERY_KEY = ['vehicles'] as const

/**
 * React Query hook for owner vehicle management.
 * Automatically invalidates the cache after mutations.
 */
export function useVehicles() {
  const token = useAuthStore(s => s.token)
  const queryClient = useQueryClient()

  const vehiclesQuery = useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: () => getVehicles(token ?? ''),
    enabled: Boolean(token),
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateVehicleInput) => createVehicle(input, token ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (vehicleId: string) => deactivateVehicle(vehicleId, token ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY })
    },
  })

  return {
    vehicles: vehiclesQuery.data ?? [],
    isLoading: vehiclesQuery.isLoading,
    error: vehiclesQuery.error,
    refetch: vehiclesQuery.refetch,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deactivate: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
  }
}
