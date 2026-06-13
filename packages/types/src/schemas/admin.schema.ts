import { z } from 'zod'

/** Maximum tags per admin bulk generation batch. */
export const MAX_TAG_BATCH_SIZE = 5000

export const TagBatchStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])
export type TagBatchStatus = z.infer<typeof TagBatchStatusSchema>

export const CreateTagBatchSchema = z.object({
  count: z
    .number()
    .int('Count must be a whole number')
    .min(1, 'Minimum 1 tag required')
    .max(MAX_TAG_BATCH_SIZE, `Maximum ${MAX_TAG_BATCH_SIZE.toLocaleString()} tags per batch`),
})

export type CreateTagBatchInput = z.infer<typeof CreateTagBatchSchema>

export const TagBatchSummarySchema = z.object({
  id: z.string().uuid(),
  requestedCount: z.number().int(),
  completedCount: z.number().int(),
  status: TagBatchStatusSchema,
  errorMessage: z.string().nullable(),
  estimatedSecondsRemaining: z.number().int().nullable(),
  progressPercent: z.number().int().min(0).max(100),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
})

export type TagBatchSummary = z.infer<typeof TagBatchSummarySchema>

export const CreateTagBatchResponseSchema = z.object({
  batch: TagBatchSummarySchema,
})

export type CreateTagBatchResponse = z.infer<typeof CreateTagBatchResponseSchema>

export const TagBatchListResponseSchema = z.object({
  batches: z.array(TagBatchSummarySchema),
})

export type TagBatchListResponse = z.infer<typeof TagBatchListResponseSchema>

export const AdminAuthCheckResponseSchema = z.object({
  authenticated: z.literal(true),
})

export type AdminAuthCheckResponse = z.infer<typeof AdminAuthCheckResponseSchema>

export const TagInventorySummarySchema = z.object({
  totalGenerated: z.number().int().min(0),
  inStock: z.number().int().min(0),
  sold: z.number().int().min(0),
  active: z.number().int().min(0),
  inactive: z.number().int().min(0),
  updatedAt: z.string(),
})

export type TagInventorySummary = z.infer<typeof TagInventorySummarySchema>

export const TagBatchInventoryRowSchema = z.object({
  batchId: z.string().uuid(),
  requestedCount: z.number().int(),
  completedCount: z.number().int(),
  batchStatus: TagBatchStatusSchema,
  createdAt: z.string(),
  tagCount: z.number().int().min(0),
  inStock: z.number().int().min(0),
  sold: z.number().int().min(0),
})

export type TagBatchInventoryRow = z.infer<typeof TagBatchInventoryRowSchema>

export const TagInventoryResponseSchema = z.object({
  summary: TagInventorySummarySchema,
  batches: z.array(TagBatchInventoryRowSchema),
})

export type TagInventoryResponse = z.infer<typeof TagInventoryResponseSchema>
