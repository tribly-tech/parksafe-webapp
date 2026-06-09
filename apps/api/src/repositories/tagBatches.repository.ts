/**
 * Tag batch data access for admin QR generation.
 */

import { desc, eq } from 'drizzle-orm'
import { tagBatches, tags } from '@parksafe/db'
import { getDb } from '../lib/db'

export type TagBatchRow = {
  id: string
  requestedCount: number
  completedCount: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  errorMessage: string | null
  startedAt: Date | null
  completedAt: Date | null
  createdAt: Date
}

export type BatchTagRow = {
  id: string
  tagCode: string
  status: 'UNREGISTERED' | 'ACTIVE' | 'INACTIVE'
  createdAt: Date
}

export async function createTagBatch(requestedCount: number): Promise<TagBatchRow | null> {
  const db = getDb()
  if (!db) return null

  const rows = await db
    .insert(tagBatches)
    .values({ requestedCount })
    .returning()

  return rows[0] ?? null
}

export async function findTagBatchById(batchId: string): Promise<TagBatchRow | null> {
  const db = getDb()
  if (!db) return null

  const rows = await db.select().from(tagBatches).where(eq(tagBatches.id, batchId)).limit(1)
  return rows[0] ?? null
}

export async function listRecentTagBatches(limit = 10): Promise<TagBatchRow[]> {
  const db = getDb()
  if (!db) return []

  return db.select().from(tagBatches).orderBy(desc(tagBatches.createdAt)).limit(limit)
}

export async function markBatchProcessing(batchId: string): Promise<boolean> {
  const db = getDb()
  if (!db) return false

  const rows = await db
    .update(tagBatches)
    .set({ status: 'PROCESSING', startedAt: new Date() })
    .where(eq(tagBatches.id, batchId))
    .returning({ id: tagBatches.id })

  return rows.length > 0
}

export async function updateBatchProgress(
  batchId: string,
  completedCount: number
): Promise<boolean> {
  const db = getDb()
  if (!db) return false

  const rows = await db
    .update(tagBatches)
    .set({ completedCount })
    .where(eq(tagBatches.id, batchId))
    .returning({ id: tagBatches.id })

  return rows.length > 0
}

export async function markBatchCompleted(batchId: string): Promise<boolean> {
  const db = getDb()
  if (!db) return false

  const rows = await db
    .update(tagBatches)
    .set({ status: 'COMPLETED', completedAt: new Date() })
    .where(eq(tagBatches.id, batchId))
    .returning({ id: tagBatches.id })

  return rows.length > 0
}

export async function markBatchFailed(batchId: string, errorMessage: string): Promise<boolean> {
  const db = getDb()
  if (!db) return false

  const rows = await db
    .update(tagBatches)
    .set({
      status: 'FAILED',
      errorMessage,
      completedAt: new Date(),
    })
    .where(eq(tagBatches.id, batchId))
    .returning({ id: tagBatches.id })

  return rows.length > 0
}

export async function insertBatchTags(
  batchId: string,
  tagCodes: string[]
): Promise<number> {
  const db = getDb()
  if (!db || tagCodes.length === 0) return 0

  const rows = await db
    .insert(tags)
    .values(
      tagCodes.map(tagCode => ({
        tagCode,
        batchId,
        status: 'UNREGISTERED' as const,
      }))
    )
    .onConflictDoNothing({ target: tags.tagCode })
    .returning({ id: tags.id })

  return rows.length
}

export async function listTagsByBatchId(batchId: string): Promise<BatchTagRow[]> {
  const db = getDb()
  if (!db) return []

  return db
    .select({
      id: tags.id,
      tagCode: tags.tagCode,
      status: tags.status,
      createdAt: tags.createdAt,
    })
    .from(tags)
    .where(eq(tags.batchId, batchId))
    .orderBy(tags.createdAt)
}
