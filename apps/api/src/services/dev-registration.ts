/**
 * Local dev registration — no Supabase or database required.
 * Active when OTP_DEV_MODE=true (default in development).
 */

import crypto from 'node:crypto'
import type { CreateVehicleInput, Vehicle } from '@parksafe/types'

export const DEV_SESSION_PREFIX = 'dev-session:'

function maskPlate(plate: string): string {
  if (plate.length < 6) return '****'
  return `${plate.slice(0, 2)}**${plate.slice(-4)}`
}

export function createDevUserId(): string {
  return crypto.randomUUID()
}

export function createDevSession(userId: string): {
  accessToken: string
  refreshToken: string
} {
  return {
    accessToken: `${DEV_SESSION_PREFIX}${userId}`,
    refreshToken: `${DEV_SESSION_PREFIX}refresh-${userId}`,
  }
}

/** Parses a dev access token — returns userId or null if invalid. */
export function parseDevSessionToken(token: string): string | null {
  if (!token.startsWith(DEV_SESSION_PREFIX)) return null
  const userId = token.slice(DEV_SESSION_PREFIX.length)
  if (!userId || userId.startsWith('refresh-')) return null
  return userId
}

export function createDevVehicle(_ownerId: string, input: CreateVehicleInput): Vehicle {
  return {
    id: crypto.randomUUID(),
    make: input.make,
    model: input.model,
    colour: input.colour,
    plate: input.plate,
    platePartial: maskPlate(input.plate),
    isActive: true,
  }
}
