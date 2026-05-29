import { apiFetch } from './client'
import type {
  UpdateProfileInput,
  UpdateSettingsInput,
  UserProfile,
  UserSettings,
} from '@parksafe/types'

export async function getProfile(token: string): Promise<UserProfile> {
  const res = await apiFetch<{ profile: UserProfile }>('/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.profile
}

export async function updateProfile(
  input: UpdateProfileInput,
  token: string
): Promise<UserProfile> {
  const res = await apiFetch<{ profile: UserProfile }>('/profile', {
    method: 'PATCH',
    body: input as Record<string, unknown>,
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.profile
}

export async function getSettings(token: string): Promise<UserSettings> {
  const res = await apiFetch<{ settings: UserSettings }>('/profile/settings', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.settings
}

export async function updateSettings(
  input: UpdateSettingsInput,
  token: string
): Promise<UserSettings> {
  const res = await apiFetch<{ settings: UserSettings }>('/profile/settings', {
    method: 'PATCH',
    body: input as Record<string, unknown>,
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.settings
}
