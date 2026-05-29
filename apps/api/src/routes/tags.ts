import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { UpdateTagSchema } from '@parksafe/types'
import { getTagByCode } from '../services/tag.service'
import { updateTag } from '../services/tag.service'
import { authMiddleware } from '../middleware/auth.middleware'

export const tagRoutes = new Hono<{ Variables: { userId: string } }>()

/**
 * GET /tags/:tagId
 * Public — returns masked vehicle info for the reporter contact flow.
 * Owner identity is NEVER included in this response.
 */
tagRoutes.get('/:tagId', async c => {
  const tagId = c.req.param('tagId')
  const result = await getTagByCode(tagId)

  if (!result.found || !result.tag) {
    return c.json({ error: 'Tag not found or not activated' }, 404)
  }

  return c.json(result.tag)
})

/**
 * PATCH /tags/:tagId
 * Authenticated — allows owner to update notification preferences.
 */
tagRoutes.patch('/:tagId', authMiddleware, zValidator('json', UpdateTagSchema), async c => {
  const tagId = c.req.param('tagId')
  const userId = c.get('userId')
  const updates = c.req.valid('json')

  const result = await updateTag(tagId, userId, updates)

  if (!result.success) {
    return c.json({ error: result.error ?? 'Update failed' }, 400)
  }

  return c.json({ success: true })
})
