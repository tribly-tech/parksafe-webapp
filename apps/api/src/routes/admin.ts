import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { stream } from 'hono/streaming'
import { CreateTagBatchSchema } from '@parksafe/types'
import { adminMiddleware } from '../middleware/admin.middleware'
import {
  buildBatchZipStream,
  getTagBatchStatus,
  listBatchTagSamples,
  listTagBatchHistory,
  startTagBatchGeneration,
} from '../services/admin-tag.service'
import { getTagInventory } from '../services/admin-inventory.service'

export const adminRoutes = new Hono()

adminRoutes.use('*', adminMiddleware)

/** GET /admin/auth/check — lightweight key validation for the admin UI */
adminRoutes.get('/auth/check', c => c.json({ authenticated: true as const }))

/** GET /admin/tags/inventory — tag stock summary and per-batch breakdown */
adminRoutes.get('/tags/inventory', async c => {
  const inventory = await getTagInventory()

  if (!inventory) {
    return c.json({ error: 'Database unavailable', code: 'INVENTORY_UNAVAILABLE' }, 503)
  }

  return c.json(inventory)
})

/** GET /admin/tags/batches — recent generation jobs */
adminRoutes.get('/tags/batches', async c => {
  const limit = Math.min(Number(c.req.query('limit') ?? 10), 50)
  const batches = await listTagBatchHistory(limit)
  return c.json({ batches })
})

/** POST /admin/tags/batches — start bulk QR tag generation */
adminRoutes.post('/tags/batches', zValidator('json', CreateTagBatchSchema), async c => {
  const { count } = c.req.valid('json')
  const result = await startTagBatchGeneration(count)

  if (!result.success) {
    return c.json({ error: result.error, code: 'BATCH_CREATE_FAILED' }, 503)
  }

  return c.json({ batch: result.batch }, 201)
})

/** GET /admin/tags/batches/:batchId — poll generation status */
adminRoutes.get('/tags/batches/:batchId', async c => {
  const batchId = c.req.param('batchId')
  const batch = await getTagBatchStatus(batchId)

  if (!batch) {
    return c.json({ error: 'Batch not found', code: 'BATCH_NOT_FOUND' }, 404)
  }

  return c.json({ batch })
})

/** GET /admin/tags/batches/:batchId/samples — first few tag codes for testing */
adminRoutes.get('/tags/batches/:batchId/samples', async c => {
  const batchId = c.req.param('batchId')
  const batch = await getTagBatchStatus(batchId)

  if (!batch) {
    return c.json({ error: 'Batch not found', code: 'BATCH_NOT_FOUND' }, 404)
  }

  if (batch.status !== 'COMPLETED') {
    return c.json({ error: 'Batch is not ready', code: 'BATCH_NOT_READY' }, 409)
  }

  const samples = await listBatchTagSamples(batchId, 5)
  return c.json({ batchId, samples })
})

/** GET /admin/tags/batches/:batchId/download — ZIP with QR PNGs + CSV inventory */
adminRoutes.get('/tags/batches/:batchId/download', async c => {
  const batchId = c.req.param('batchId')
  const result = await buildBatchZipStream(batchId)

  if (!result.success) {
    const status = result.status as 404 | 409 | 422 | 500
    return c.json({ error: result.error, code: 'BATCH_DOWNLOAD_FAILED' }, status)
  }

  c.header('Content-Type', 'application/zip')
  c.header('Content-Disposition', `attachment; filename="${result.filename}"`)

  return stream(c, async streamWriter => {
    for await (const chunk of result.stream) {
      await streamWriter.write(chunk)
    }
  })
})
