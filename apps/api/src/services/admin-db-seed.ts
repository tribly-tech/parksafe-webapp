/**
 * Seeds admin mock batches into Postgres when empty — dev only.
 */

import { randomUUID } from 'node:crypto'
import { count } from 'drizzle-orm'
import { tagBatches, tags } from '@parksafe/db'
import { getDb } from '../lib/db'

const BATCH_IDS = [
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
] as const

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000)
}

async function insertBatchTags(
  batchId: string,
  total: number,
  soldCount: number,
  createdAt: Date
): Promise<void> {
  const db = getDb()
  if (!db) return

  const inactiveSold = Math.floor(soldCount / 3)
  const activeSold = soldCount - inactiveSold
  const rows = []

  for (let i = 0; i < total; i++) {
    let status: 'UNREGISTERED' | 'ACTIVE' | 'INACTIVE' = 'UNREGISTERED'
    if (i < activeSold) status = 'ACTIVE'
    else if (i < soldCount) status = 'INACTIVE'

    rows.push({
      tagCode: randomUUID(),
      batchId,
      status,
      createdAt,
      ...(status !== 'UNREGISTERED' ? { activatedAt: createdAt } : {}),
    })
  }

  const chunkSize = 100
  for (let i = 0; i < rows.length; i += chunkSize) {
    await db
      .insert(tags)
      .values(rows.slice(i, i + chunkSize))
      .onConflictDoNothing({ target: tags.tagCode })
  }
}

/** Idempotent — seeds 3 mock batches when tag_batches is empty. */
export async function seedAdminDbMockData(): Promise<void> {
  const db = getDb()
  if (!db) return

  const countRows = await db.select({ value: count() }).from(tagBatches)
  const batchCount = countRows[0]?.value ?? 0
  if (batchCount > 0) return

  console.log('[admin-db-seed] Seeding mock admin batches…')

  const specs = [
    { id: BATCH_IDS[0], requestedCount: 100, soldCount: 25, daysAgo: 30 },
    { id: BATCH_IDS[1], requestedCount: 50, soldCount: 8, daysAgo: 7 },
    { id: BATCH_IDS[2], requestedCount: 75, soldCount: 0, daysAgo: 1 },
  ] as const

  for (const spec of specs) {
    const createdAt = daysAgo(spec.daysAgo)
    await db
      .insert(tagBatches)
      .values({
        id: spec.id,
        requestedCount: spec.requestedCount,
        completedCount: spec.requestedCount,
        status: 'COMPLETED',
        startedAt: createdAt,
        completedAt: createdAt,
        createdAt,
      })
      .onConflictDoNothing()

    await insertBatchTags(spec.id, spec.requestedCount, spec.soldCount, createdAt)
  }

  console.log('[admin-db-seed] Done — 3 batches, 225 tags (192 in stock, 33 sold)')
}
