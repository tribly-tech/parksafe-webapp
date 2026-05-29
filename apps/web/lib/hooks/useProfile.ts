'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, getSettings, updateProfile, updateSettings } from '@/lib/api/profile'
import { useAuthStore } from '@/lib/store/authStore'
import type { UpdateProfileInput, UpdateSettingsInput } from '@parksafe/types'
import { DASHBOARD_QUERY_KEY } from './useDashboard'

const PROFILE_KEY = ['profile'] as const
const SETTINGS_KEY = ['settings'] as const

export function useProfile() {
  const token = useAuthStore(s => s.token)
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => getProfile(token ?? ''),
    enabled: Boolean(token),
    staleTime: 120_000,
  })

  const settingsQuery = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => getSettings(token ?? ''),
    enabled: Boolean(token),
    staleTime: 120_000,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input, token ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_KEY })
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY })
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: (input: UpdateSettingsInput) => updateSettings(input, token ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SETTINGS_KEY })
    },
  })

  return {
    profile: profileQuery.data,
    settings: settingsQuery.data,
    isLoading: profileQuery.isLoading || settingsQuery.isLoading,
    isError: profileQuery.isError || settingsQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    profileError: updateProfileMutation.error,
    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdatingSettings: updateSettingsMutation.isPending,
    settingsError: updateSettingsMutation.error,
  }
}
