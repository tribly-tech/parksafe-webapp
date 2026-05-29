/**
 * Owner registration — OTP verification, user creation, vehicle + tag activation.
 */

import crypto from 'node:crypto'
import { supabase } from '../lib/supabase'
import { hashPhone, toE164Indian } from '../lib/phone'
import { isOtpDevMode } from '../types/env'
import { verifyOtp } from './otp.service'
import { createVehicle } from './vehicle.service'
import {
  createDevSession,
  createDevUserId,
  createDevVehicle,
} from './dev-registration'
import { addDevVehicle, linkDevPhone, setDevProfile } from './dev-store'
import type { RegisterVehicleInput, Vehicle } from '@parksafe/types'

interface RegistrationResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  userId?: string
  vehicle?: Vehicle
  error?: string
}

/**
 * Derives a stable internal email for phone-only Supabase auth users.
 * Never exposed to end users.
 */
function phoneToInternalEmail(phoneE164: string): string {
  const hash = hashPhone(phoneE164).slice(0, 32)
  return `phone+${hash}@internal.parksafe.app`
}

/**
 * Creates or retrieves an auth user and returns a session for the client.
 */
export async function ensureAuthSession(
  phoneE164: string,
  displayName: string,
  metadata: Record<string, unknown>
): Promise<{ userId: string; accessToken: string; refreshToken: string } | { error: string }> {
  const email = phoneToInternalEmail(phoneE164)
  const password = crypto.randomBytes(24).toString('base64url')

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    phone: phoneE164,
    phone_confirm: true,
    password,
    user_metadata: { display_name: displayName, ...metadata },
  })

  let userId = created.user?.id

  if (createError) {
    const isDuplicate =
      createError.message.includes('already') ||
      createError.message.includes('registered') ||
      createError.status === 422

    if (!isDuplicate) {
      console.error('[registration.service] createUser failed:', createError.message)
      return { error: 'Failed to create account. Please try again.' }
    }

    const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      return { error: 'Failed to look up existing account.' }
    }

    const existing = listData.users.find(
      u => u.phone === phoneE164 || u.email === email
    )
    if (!existing) {
      return { error: 'Account exists but could not be retrieved. Contact support.' }
    }

    userId = existing.id

    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { display_name: displayName, ...metadata },
    })
  }

  if (!userId) {
    return { error: 'Failed to create account.' }
  }

  const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (!signInError && sessionData.session) {
    return {
      userId,
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
    }
  }

  if (createError) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password })
    if (updateError) {
      return { error: 'Failed to sign in. Please contact support.' }
    }

    const { data: retrySession, error: retryError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (retryError || !retrySession.session) {
      return { error: 'Failed to sign in after registration.' }
    }

    return {
      userId,
      accessToken: retrySession.session.access_token,
      refreshToken: retrySession.session.refresh_token,
    }
  }

  return { error: signInError?.message ?? 'Failed to create session.' }
}

/**
 * Upserts the public users profile row (display name + phone hash).
 */
async function upsertUserProfile(userId: string, displayName: string, phoneE164: string): Promise<void> {
  const { error } = await supabase.from('users').upsert(
    {
      id: userId,
      display_name: displayName,
      phone_hash: hashPhone(phoneE164),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error('[registration.service] users upsert failed:', error.message)
  }
}

/**
 * Links an unregistered QR tag to the new owner and vehicle.
 */
async function activateTag(
  tagCode: string,
  ownerId: string,
  vehicleId: string,
  whatsappEnabled: boolean
): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .update({
      owner_id: ownerId,
      vehicle_id: vehicleId,
      status: 'ACTIVE',
      notify_whatsapp: whatsappEnabled,
      notify_sms: true,
      activated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('tag_code', tagCode)
    .eq('status', 'UNREGISTERED')

  if (error) {
    console.error('[registration.service] tag activation failed:', error.message)
  }
}

/**
 * Completes owner registration after OTP verification.
 */
export async function registerVehicle(
  input: RegisterVehicleInput
): Promise<RegistrationResult> {
  const ownerPhoneE164 = toE164Indian(input.ownerPhone)
  const emergencyPhoneE164 = toE164Indian(input.emergencyPhone)

  const otpResult = await verifyOtp(ownerPhoneE164, input.otp)
  if (!otpResult.valid) {
    return { success: false, error: otpResult.message }
  }

  // Local dev — skip Supabase auth + DB; OTP verification is sufficient
  if (isOtpDevMode) {
    const userId = createDevUserId()
    const { accessToken, refreshToken } = createDevSession(userId)
    const vehicle = createDevVehicle(userId, {
      make: input.make,
      model: input.model,
      colour: input.colour,
      plate: input.plate,
    })
    setDevProfile(userId, input.ownerName)
    linkDevPhone(ownerPhoneE164, userId)
    addDevVehicle(userId, {
      make: input.make,
      model: input.model,
      colour: input.colour,
      plate: input.plate,
    }, vehicle)

    if (process.env.REGISTRATION_DEV_LOG === 'true') {
      console.log('[registration.dev] Vehicle registered locally', {
        userId,
        platePartial: vehicle.platePartial,
      })
    }

    return {
      success: true,
      accessToken,
      refreshToken,
      userId,
      vehicle,
    }
  }

  const sessionResult = await ensureAuthSession(ownerPhoneE164, input.ownerName, {
    emergency_contact_name: input.emergencyName,
    emergency_contact_phone: emergencyPhoneE164,
    whatsapp_enabled: input.whatsappEnabled,
    vehicle_type: input.vehicleType,
  })

  if ('error' in sessionResult) {
    return { success: false, error: sessionResult.error }
  }

  const { userId, accessToken, refreshToken } = sessionResult

  await upsertUserProfile(userId, input.ownerName, ownerPhoneE164)

  const vehicleResult = await createVehicle(userId, {
    make: input.make,
    model: input.model,
    colour: input.colour,
    plate: input.plate,
  })

  if (!vehicleResult.success || !vehicleResult.vehicle) {
    return { success: false, error: vehicleResult.error ?? 'Failed to register vehicle' }
  }

  if (input.tagCode) {
    await activateTag(input.tagCode, userId, vehicleResult.vehicle.id, input.whatsappEnabled)
  }

  return {
    success: true,
    accessToken,
    refreshToken,
    userId,
    vehicle: vehicleResult.vehicle,
  }
}
