/**
 * Tag inventory aggregates for admin dashboard.
 */

import { count, desc, eq, sql } from 'drizzle-orm'
import { tagBatches, tags } from '@parksafe/db'
import { getDb } from '../lib/db'

export type TagInventoryStatsRow = {
  totalGenerated: number
  inStock: number
  sold: number
  active: number
  inactive: number
}

export type BatchInventoryRow = {
  batchId: string
  requestedCount: number
  completedCount: number
  batchStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: Date
  tagCount: number
  inStock: number
  sold: number
}

export async function getTagInventoryStats(): Promise<TagInventoryStatsRow | null> {
  const db = getDb()
  if (!db) return null

  const rows = await db
    .select({
      totalGenerated: count(),
      inStock: sql<number>`count(*) filter (where ${tags.status} = 'UNREGISTERED')`.mapWith(Number),
      sold: sql<number>`count(*) filter (where ${tags.status} in ('ACTIVE', 'INACTIVE'))`.mapWith(
        Number
      ),
      active: sql<number>`count(*) filter (where ${tags.status} = 'ACTIVE')`.mapWith(Number),
      inactive: sql<number>`count(*) filter (where ${tags.status} = 'INACTIVE')`.mapWith(Number),
    })
    .from(tags)

  const row = rows[0]
  if (!row) {
    return {
      totalGenerated: 0,
      inStock: 0,
      sold: 0,
      active: 0,
      inactive: 0,
    }
  }

  return row
}

export async function getBatchInventoryRows(limit = 20): Promise<BatchInventoryRow[]> {
  const db = getDb()
  if (!db) return []

  return db
    .select({
      batchId: tagBatches.id,
      requestedCount: tagBatches.requestedCount,
      completedCount: tagBatches.completedCount,
      batchStatus: tagBatches.status,
      createdAt: tagBatches.createdAt,
      tagCount: count(tags.id),
      inStock: sql<number>`count(${tags.id}) filter (where ${tags.status} = 'UNREGISTERED')`.mapWith(
        Number
      ),
      sold: sql<number>`count(${tags.id}) filter (where ${tags.status} in ('ACTIVE', 'INACTIVE'))`.mapWith(
        Number
      ),
    })
    .from(tagBatches)
    .leftJoin(tags, eq(tags.batchId, tagBatches.id))
    .groupBy(
      tagBatches.id,
      tagBatches.requestedCount,
      tagBatches.completedCount,
      tagBatches.status,
      tagBatches.createdAt
    )
    .orderBy(desc(tagBatches.createdAt))
    .limit(limit)
}
