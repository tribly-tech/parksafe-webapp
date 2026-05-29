/**
 * Owner profile and account-level settings.
 */

import { supabase } from '../lib/supabase'
import { isOtpDevMode } from '../types/env'
import type { UpdateProfileInput, UpdateSettingsInput, UserProfile, UserSettings } from '@parksafe/types'
import { getDevProfile, getDevSettings, updateDevProfile, updateDevSettings } from './dev-store'

const DEFAULT_SETTINGS: UserSettings = {
  notifySms: true,
  notifyWhatsapp: true,
  marketingEmails: false,
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isOtpDevMode) {
    const profile = getDevProfile(userId)
    return {
      id: userId,
      displayName: profile?.displayName ?? 'Driver',
      email: profile?.email ?? null,
    }
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, display_name, email')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id as string,
    displayName: data.display_name as string,
    email: (data.email as string | null) ?? null,
  }
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  if (isOtpDevMode) {
    const updated = updateDevProfile(userId, {
      displayName: input.displayName,
      email: input.email,
    })
    return {
      success: true,
      profile: { id: userId, displayName: updated.displayName, email: updated.email },
    }
  }

  const updates: Record<string, string | null> = {}
  if (input.displayName !== undefined) updates['display_name'] = input.displayName
  if (input.email !== undefined) updates['email'] = input.email

  if (Object.keys(updates).length === 0) {
    const profile = await getUserProfile(userId)
    return profile ? { success: true, profile } : { success: false, error: 'User not found' }
  }

  updates['updated_at'] = new Date().toISOString()

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, display_name, email')
    .single()

  if (error || !data) {
    return { success: false, error: 'Failed to update profile' }
  }

  return {
    success: true,
    profile: {
      id: data.id as string,
      displayName: data.display_name as string,
      email: (data.email as string | null) ?? null,
    },
  }
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  if (isOtpDevMode) {
    return getDevSettings(userId)
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('notify_sms, notify_whatsapp, marketing_emails')
    .eq('user_id', userId)
    .single()

  if (error || !data) return DEFAULT_SETTINGS

  return {
    notifySms: data.notify_sms as boolean,
    notifyWhatsapp: data.notify_whatsapp as boolean,
    marketingEmails: data.marketing_emails as boolean,
  }
}

export async function updateUserSettings(
  userId: string,
  input: UpdateSettingsInput
): Promise<{ success: boolean; settings?: UserSettings; error?: string }> {
  if (isOtpDevMode) {
    const existing = getDevSettings(userId)
    const merged: UserSettings = {
      notifySms: input.notifySms ?? existing.notifySms,
      notifyWhatsapp: input.notifyWhatsapp ?? existing.notifyWhatsapp,
      marketingEmails: input.marketingEmails ?? existing.marketingEmails,
    }
    return { success: true, settings: updateDevSettings(userId, merged) }
  }

  const existing = await getUserSettings(userId)
  const merged: UserSettings = {
    notifySms: input.notifySms ?? existing.notifySms,
    notifyWhatsapp: input.notifyWhatsapp ?? existing.notifyWhatsapp,
    marketingEmails: input.marketingEmails ?? existing.marketingEmails,
  }

  const { data, error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: userId,
        notify_sms: merged.notifySms,
        notify_whatsapp: merged.notifyWhatsapp,
        marketing_emails: merged.marketingEmails,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select('notify_sms, notify_whatsapp, marketing_emails')
    .single()

  if (error || !data) {
    return { success: false, error: 'Failed to update settings' }
  }

  return {
    success: true,
    settings: {
      notifySms: data.notify_sms as boolean,
      notifyWhatsapp: data.notify_whatsapp as boolean,
      marketingEmails: data.marketing_emails as boolean,
    },
  }
}
