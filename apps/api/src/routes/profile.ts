import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { UpdateProfileSchema, UpdateSettingsSchema } from '@parksafe/types'
import {
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
} from '../services/profile.service'

export const profileRoutes = new Hono<{ Variables: { userId: string } }>()

profileRoutes.get('/', async c => {
  const userId = c.get('userId')
  const profile = await getUserProfile(userId)

  if (!profile) {
    return c.json({ error: 'Profile not found' }, 404)
  }

  return c.json({ profile })
})

profileRoutes.patch('/', zValidator('json', UpdateProfileSchema), async c => {
  const userId = c.get('userId')
  const input = c.req.valid('json')
  const result = await updateUserProfile(userId, input)

  if (!result.success) {
    return c.json({ error: result.error ?? 'Update failed' }, 400)
  }

  return c.json({ profile: result.profile })
})

profileRoutes.get('/settings', async c => {
  const userId = c.get('userId')
  const settings = await getUserSettings(userId)
  return c.json({ settings })
})

profileRoutes.patch('/settings', zValidator('json', UpdateSettingsSchema), async c => {
  const userId = c.get('userId')
  const input = c.req.valid('json')
  const result = await updateUserSettings(userId, input)

  if (!result.success) {
    return c.json({ error: result.error ?? 'Update failed' }, 400)
  }

  return c.json({ settings: result.settings })
})
