import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ContactRequestSchema } from '@parksafe/types'
import { processContactRequest } from '../services/contact.service'
import { getOptionalUserId } from '../lib/optionalAuth'

export const contactRoutes = new Hono<{ Variables: { cooldownKey: string } }>()

/**
 * POST /contact/:tagId
 * Semi-public — requires OTP session but not an owner account.
 * Rate limiting middleware is applied at the router level (see index.ts).
 */
contactRoutes.post(
  '/:tagId',
  zValidator('json', ContactRequestSchema.omit({ tagId: true })),
  async c => {
    const tagId = c.req.param('tagId')
    const { issueType, channel, customNote } = c.req.valid('json')
    const sessionId = c.req.header('x-session-id') ?? c.req.header('cf-connecting-ip') ?? 'anon'
    const reporterUserId = (await getOptionalUserId(c.req.header('Authorization'))) ?? undefined

    const result = await processContactRequest({
      tagId,
      issueType,
      channel,
      customNote,
      sessionId,
      reporterUserId,
    })

    if (!result.success) {
      return c.json({ error: result.error }, result.status as 400 | 404 | 503)
    }

    return c.json({ success: true, messageId: result.messageId })
  }
)
