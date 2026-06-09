/**
 * Admin tag inventory — aggregated counts from the database.
 *
 * Stock model:
 * - Generated: all tags in the system
 * - In stock: UNREGISTERED (printed, not yet registered by an owner)
 * - Sold: ACTIVE + INACTIVE (registered / claimed by an owner)
 */

import type { TagInventoryResponse } from '@parksafe/types'
import {
  getBatchInventoryRows,
  getTagInventoryStats,
} from '../repositories/tagInventory.repository'
import { getDb } from '../lib/db'
import { adminDevGetInventory } from './admin-dev-store'

export async function getTagInventory(): Promise<TagInventoryResponse | null> {
  if (!getDb()) {
    return adminDevGetInventory()
  }

  const [stats, batches] = await Promise.all([
    getTagInventoryStats(),
    getBatchInventoryRows(20),
  ])

  if (!stats) return null

  return {
    summary: {
      totalGenerated: stats.totalGenerated,
      inStock: stats.inStock,
      sold: stats.sold,
      active: stats.active,
      inactive: stats.inactive,
      updatedAt: new Date().toISOString(),
    },
    batches: batches.map(row => ({
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
