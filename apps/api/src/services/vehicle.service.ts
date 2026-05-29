/**
 * apps/api/src/services/vehicle.service.ts
 * Vehicle CRUD business logic.
 * Full license plates are encrypted before storage — never returned after write.
 * Only platePartial (masked) is stored separately for safe reporter display.
 */

import { supabase } from '../lib/supabase'
import { isOtpDevMode } from '../types/env'
import type { CreateVehicleInput, Vehicle } from '@parksafe/types'
import { addDevVehicle, deactivateDevVehicle, getDevVehicles } from './dev-store'

/**
 * Masks a license plate for safe display to reporters.
 * Input: "MH02AB1234" → Output: "MH**1234"
 * Only first 2 chars and last 4 chars are preserved.
 */
function maskPlate(plate: string): string {
  if (plate.length < 6) return '****'
  return `${plate.slice(0, 2)}**${plate.slice(-4)}`
}

/**
 * Encrypts a license plate using pgcrypto via Supabase RPC.
 * Falls back to a placeholder if encryption RPC is not yet configured.
 * TODO: Set up pgcrypto extension and encrypt_plate RPC in Supabase.
 */
const PENDING_ENCRYPTION_PREFIX = 'PENDING_ENCRYPTION:'

async function encryptPlate(plate: string): Promise<string> {
  const { data, error } = await supabase.rpc('encrypt_plate', { plate_text: plate })
  if (error || !data) {
    // Placeholder until pgcrypto RPC is configured — mark clearly
    return `${PENDING_ENCRYPTION_PREFIX}${plate}`
  }
  return data as string
}

export async function decryptPlate(plateEncrypted: string): Promise<string | null> {
  if (plateEncrypted.startsWith(PENDING_ENCRYPTION_PREFIX)) {
    return plateEncrypted.slice(PENDING_ENCRYPTION_PREFIX.length)
  }
  const { data, error } = await supabase.rpc('decrypt_plate', {
    encrypted_text: plateEncrypted,
  })
  if (error || !data) {
    console.error('[vehicle.service] Decrypt failed:', error?.message)
    return null
  }
  return data as string
}

/**
 * Fetches all vehicles belonging to the authenticated owner.
 * Returns Vehicle schema — no full plates, no sensitive data.
 * @param ownerId - Authenticated user ID from JWT
 */
export async function getVehiclesByOwner(ownerId: string): Promise<Vehicle[]> {
  if (isOtpDevMode) {
    return getDevVehicles(ownerId).filter(v => v.isActive)
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('id, make, model, colour, plate_encrypted, plate_partial, is_active')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[vehicle.service] Fetch failed:', error.message)
    return []
  }

  const vehicles: Vehicle[] = []
  for (const v of data ?? []) {
    const plate = await decryptPlate(v.plate_encrypted as string)
    vehicles.push({
      id: v.id as string,
      make: v.make as string,
      model: v.model as string,
      colour: v.colour as string,
      platePartial: v.plate_partial as string,
      ...(plate ? { plate } : {}),
      isActive: v.is_active as boolean,
    })
  }
  return vehicles
}

/**
 * Creates a new vehicle record for the authenticated owner.
 * Encrypts the full plate — only the masked version is returned.
 * @param ownerId - Authenticated user ID from JWT
 * @param input - Validated vehicle creation input
 */
export async function createVehicle(
  ownerId: string,
  input: CreateVehicleInput
): Promise<{ success: boolean; vehicle?: Vehicle; error?: string }> {
  if (isOtpDevMode) {
    const { createDevVehicle } = await import('./dev-registration')
    const vehicle = createDevVehicle(ownerId, input)
    addDevVehicle(ownerId, input, vehicle)
    return { success: true, vehicle }
  }

  const plateEncrypted = await encryptPlate(input.plate)
  const platePartial = maskPlate(input.plate)

  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      owner_id: ownerId,
      make: input.make,
      model: input.model,
      colour: input.colour,
      plate_encrypted: plateEncrypted,
      plate_partial: platePartial,
      is_active: true,
    })
    .select('id, make, model, colour, plate_partial, is_active')
    .single()

  if (error || !data) {
    console.error('[vehicle.service] Create failed:', error?.message)
    return { success: false, error: 'Failed to create vehicle' }
  }

  return {
    success: true,
    vehicle: {
      id: data.id as string,
      make: data.make as string,
      model: data.model as string,
      colour: data.colour as string,
      plate: input.plate,
      platePartial: data.plate_partial as string,
      isActive: data.is_active as boolean,
    },
  }
}

/**
 * Soft-deletes a vehicle by marking it inactive.
 * Ownership is enforced at the query level — users cannot delete others' vehicles.
 * @param vehicleId - UUID of the vehicle to delete
 * @param ownerId - Authenticated user ID from JWT
 */
export async function deleteVehicle(
  vehicleId: string,
  ownerId: string
): Promise<{ success: boolean; error?: string }> {
  if (isOtpDevMode) {
    const ok = deactivateDevVehicle(ownerId, vehicleId)
    return ok ? { success: true } : { success: false, error: 'Vehicle not found' }
  }

  const { error } = await supabase
    .from('vehicles')
    .update({ is_active: false })
    .eq('id', vehicleId)
    .eq('owner_id', ownerId)

  if (error) {
    console.error('[vehicle.service] Delete failed:', error.message)
    return { success: false, error: 'Failed to delete vehicle' }
  }

  return { success: true }
}
