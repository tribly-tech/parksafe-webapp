import { apiFetch } from './client'
import type { Vehicle, CreateVehicleInput } from '@parksafe/types'

interface VehicleListResponse {
  vehicles: Vehicle[]
}

interface CreateVehicleResponse {
  vehicle: Vehicle
}

/**
 * Fetches all vehicles for the authenticated owner.
 * @param token - Supabase JWT
 */
export async function getVehicles(token: string): Promise<Vehicle[]> {
  const res = await apiFetch<VehicleListResponse>('/vehicles', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.vehicles
}

/**
 * Creates a new vehicle for the authenticated owner.
 * @param input - Validated vehicle creation data
 * @param token - Supabase JWT
 */
export async function createVehicle(
  input: CreateVehicleInput,
  token: string
): Promise<Vehicle> {
  const res = await apiFetch<CreateVehicleResponse>('/vehicles', {
    method: 'POST',
    body: input as Record<string, unknown>,
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.vehicle
}

/**
 * Marks a vehicle inactive (soft-delete).
 * @param vehicleId - UUID of the vehicle to deactivate
 * @param token - Supabase JWT
 */
export async function deactivateVehicle(vehicleId: string, token: string): Promise<void> {
  await apiFetch(`/vehicles/${vehicleId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
