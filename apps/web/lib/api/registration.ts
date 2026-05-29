import { apiFetch } from './client'
import type { RegisterVehicleInput, Vehicle } from '@parksafe/types'

interface RegisterVehicleResponse {
  message: string
  accessToken: string
  refreshToken: string
  userId: string
  vehicle: Vehicle
}

/**
 * Completes vehicle registration after OTP verification.
 */
export async function registerVehicle(
  input: RegisterVehicleInput
): Promise<RegisterVehicleResponse> {
  return apiFetch<RegisterVehicleResponse>('/registration', {
    method: 'POST',
    body: input as Record<string, unknown>,
  })
}
