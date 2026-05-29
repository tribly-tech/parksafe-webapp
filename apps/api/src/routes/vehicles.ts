import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { CreateVehicleSchema } from '@parksafe/types'
import {
  getVehiclesByOwner,
  createVehicle,
  deleteVehicle,
} from '../services/vehicle.service'

export const vehicleRoutes = new Hono<{ Variables: { userId: string } }>()

/**
 * GET /vehicles
 * Authenticated — returns all vehicles belonging to the authenticated owner.
 */
vehicleRoutes.get('/', async c => {
  const userId = c.get('userId')
  const vehicles = await getVehiclesByOwner(userId)
  return c.json({ vehicles })
})

/**
 * POST /vehicles
 * Authenticated — creates a new vehicle for the authenticated owner.
 */
vehicleRoutes.post('/', zValidator('json', CreateVehicleSchema), async c => {
  const userId = c.get('userId')
  const input = c.req.valid('json')

  const result = await createVehicle(userId, input)

  if (!result.success) {
    return c.json({ error: result.error ?? 'Failed to create vehicle' }, 400)
  }

  return c.json({ vehicle: result.vehicle }, 201)
})

/**
 * DELETE /vehicles/:vehicleId
 * Authenticated — marks a vehicle inactive (soft-delete).
 */
vehicleRoutes.delete('/:vehicleId', async c => {
  const userId = c.get('userId')
  const vehicleId = c.req.param('vehicleId')

  const result = await deleteVehicle(vehicleId, userId)

  if (!result.success) {
    return c.json({ error: result.error ?? 'Failed to delete vehicle' }, 400)
  }

  return c.json({ success: true })
})
