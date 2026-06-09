/**
 * In-memory admin store for OTP dev mode without DATABASE_URL.
 * Mirrors tag_batches + tags for local /admin testing.
 */

import { randomUUID } from 'node:crypto'
import type { TagBatchSummary, TagInventoryResponse } from '@parksafe/types'
import type { BatchTagRow, TagBatchRow } from '../repositories/tagBatches.repository'
import type { BatchInventoryRow, TagInventoryStatsRow } from '../repositories/tagInventory.repository'

type DevTagRow = BatchTagRow & { batchId: string | null }

const batches = new Map<string, TagBatchRow>()
const tags = new Map<string, DevTagRow>()
const tagsByCode = new Map<string, DevTagRow>()

let seeded = false

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000)
}

function mapBatchToSummary(batch: TagBatchRow): TagBatchSummary {
  const { requestedCount, completedCount, status, startedAt } = batch
  const progressPercent =
    requestedCount > 0 ? Math.min(100, Math.round((completedCount / requestedCount) * 100)) : 0

  let estimatedSecondsRemaining: number | null = null
  if (status === 'COMPLETED') {
    estimatedSecondsRemaining = 0
  } else if (status === 'PENDING' || status === 'PROCESSING') {
    estimatedSecondsRemaining = Math.max(
      1,
      Math.ceil((requestedCount - completedCount) / 120)
    )
  }

  return {
    id: batch.id,
    requestedCount: batch.requestedCount,
    completedCount: batch.completedCount,
    status: batch.status,
    errorMessage: batch.errorMessage,
    progressPercent,
    estimatedSecondsRemaining,
    startedAt: batch.startedAt?.toISOString() ?? null,
    completedAt: batch.completedAt?.toISOString() ?? null,
    createdAt: batch.createdAt.toISOString(),
  }
}

function insertTag(
  tagCode: string,
  batchId: string,
  status: DevTagRow['status'],
  createdAt: Date
): void {
  if (tagsByCode.has(tagCode)) return

  const row: DevTagRow = {
    id: randomUUID(),
    tagCode,
    status,
    createdAt,
    batchId,
  }
  tags.set(row.id, row)
  tagsByCode.set(tagCode, row)
}

function addBatchTags(
  batchId: string,
  count: number,
  soldCount: number,
  createdAt: Date
): void {
  const inactiveSold = Math.floor(soldCount / 3)
  const activeSold = soldCount - inactiveSold

  for (let i = 0; i < count; i++) {
    let status: DevTagRow['status'] = 'UNREGISTERED'
    if (i < activeSold) status = 'ACTIVE'
    else if (i < soldCount) status = 'INACTIVE'

    insertTag(randomUUID(), batchId, status, createdAt)
  }
}

/** Idempotent — seeds realistic admin inventory mock data once per process. */
export function seedAdminDevData(): void {
  if (seeded) return
  seeded = true

  const batch1Id = '10000000-0000-0000-0000-000000000001'
  const batch2Id = '10000000-0000-0000-0000-000000000002'
  const batch3Id = '10000000-0000-0000-0000-000000000003'

  const batch1Created = daysAgo(30)
  batches.set(batch1Id, {
    id: batch1Id,
    requestedCount: 100,
    completedCount: 100,
    status: 'COMPLETED',
    errorMessage: null,
    startedAt: batch1Created,
    completedAt: batch1Created,
    createdAt: batch1Created,
  })
  addBatchTags(batch1Id, 100, 25, batch1Created)

  const batch2Created = daysAgo(7)
  batches.set(batch2Id, {
    id: batch2Id,
    requestedCount: 50,
    completedCount: 50,
    status: 'COMPLETED',
    errorMessage: null,
    startedAt: batch2Created,
    completedAt: batch2Created,
    createdAt: batch2Created,
  })
  addBatchTags(batch2Id, 50, 8, batch2Created)

  const batch3Created = daysAgo(1)
  batches.set(batch3Id, {
    id: batch3Id,
    requestedCount: 75,
    completedCount: 75,
    status: 'COMPLETED',
    errorMessage: null,
    startedAt: batch3Created,
    completedAt: batch3Created,
    createdAt: batch3Created,
  })
  addBatchTags(batch3Id, 75, 0, batch3Created)

  console.log('[admin-dev-seed] Mock admin data: 3 batches, 225 tags (192 in stock, 33 sold)')
}

export function isAdminDevStoreActive(): boolean {
  return seeded
}

export function adminDevCreateBatch(requestedCount: number): TagBatchRow {
  const id = randomUUID()
  const now = new Date()
  const batch: TagBatchRow = {
    id,
    requestedCount,
    completedCount: 0,
    status: 'PENDING',
    errorMessage: null,
    startedAt: null,
    completedAt: null,
    createdAt: now,
  }
  batches.set(id, batch)
  return batch
}

export async function adminDevProcessBatch(batchId: string, requestedCount: number): Promise<void> {
  const batch = batches.get(batchId)
  if (!batch) return

  batch.status = 'PROCESSING'
  batch.startedAt = new Date()

  const chunkSize = 50
  let completed = 0
  while (completed < requestedCount) {
    const size = Math.min(chunkSize, requestedCount - completed)
    for (let i = 0; i < size; i++) {
      insertTag(randomUUID(), batchId, 'UNREGISTERED', new Date())
    }
    completed += size
    batch.completedCount = completed
    await new Promise(resolve => setTimeout(resolve, 150))
  }

  batch.status = 'COMPLETED'
  batch.completedAt = new Date()
}

export function adminDevFindBatch(batchId: string): TagBatchRow | null {
  return batches.get(batchId) ?? null
}

export function adminDevListBatches(limit: number): TagBatchRow[] {
  return [...batches.values()]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export function adminDevListTagsByBatch(batchId: string): BatchTagRow[] {
  return [...tags.values()]
    .filter(t => t.batchId === batchId)
    .map(({ id, tagCode, status, createdAt }) => ({ id, tagCode, status, createdAt }))
}

export function adminDevGetBatchSummary(batchId: string): TagBatchSummary | null {
  const batch = batches.get(batchId)
  return batch ? mapBatchToSummary(batch) : null
}

export function adminDevListBatchSummaries(limit: number): TagBatchSummary[] {
  return adminDevListBatches(limit).map(mapBatchToSummary)
}

export function adminDevGetInventoryStats(): TagInventoryStatsRow {
  const all = [...tags.values()]
  return {
    totalGenerated: all.length,
    inStock: all.filter(t => t.status === 'UNREGISTERED').length,
    sold: all.filter(t => t.status === 'ACTIVE' || t.status === 'INACTIVE').length,
    active: all.filter(t => t.status === 'ACTIVE').length,
    inactive: all.filter(t => t.status === 'INACTIVE').length,
  }
}

export function adminDevGetBatchInventoryRows(limit: number): BatchInventoryRow[] {
  return adminDevListBatches(limit).map(batch => {
    const batchTags = [...tags.values()].filter(t => t.batchId === batch.id)
    return {
      batchId: batch.id,
      requestedCount: batch.requestedCount,
      completedCount: batch.completedCount,
      batchStatus: batch.status,
      createdAt: batch.createdAt,
      tagCount: batchTags.length,
      inStock: batchTags.filter(t => t.status === 'UNREGISTERED').length,
      sold: batchTags.filter(t => t.status === 'ACTIVE' || t.status === 'INACTIVE').length,
    }
  })
}

export function adminDevGetInventory(): TagInventoryResponse {
  const stats = adminDevGetInventoryStats()
  return {
    summary: {
      ...stats,
      updatedAt: new Date().toISOString(),
    },
    batches: adminDevGetBatchInventoryRows(20).map(row => ({
      batchId: row.batchId,
      requestedCount: row.requestedCount,
      completedCount: row.completedCount,
      batchStatus: row.batchStatus,
      createdAt: row.createdAt.toISOString(),
      tagCount: row.tagCount,
      inStock: row.inStock,
      sold: row.sold,
    })),
  }
}

/** Resets store — for tests only. */
export function resetAdminDevStore(): void {
  batches.clear()
  tags.clear()
  tagsByCode.clear()
  seeded = false
}
