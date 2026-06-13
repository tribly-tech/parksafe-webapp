/**
 * Admin API client — uses X-Admin-Api-Key instead of user JWT.
 */

import type {
  AdminAuthCheckResponse,
  CreateTagBatchResponse,
  TagBatchListResponse,
  TagBatchSummary,
  TagInventoryResponse,
} from '@parksafe/types'
import { ApiError } from './client'

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    return '/backend'
  }
  return process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'
}

interface AdminFetchOptions extends Omit<RequestInit, 'body'> {
  apiKey: string
  body?: Record<string, unknown>
}

async function adminFetch<T>(path: string, options: AdminFetchOptions): Promise<T> {
  const { apiKey, body, headers, ...rest } = options

  const init: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Api-Key': apiKey,
      ...headers,
    },
  }

  if (body !== undefined) {
    init.body = JSON.stringify(body)
  }

  const res = await fetch(`${getApiBase()}${path}`, init)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      (errorData as { error?: string }).error ?? `HTTP ${res.status}`,
      res.status,
      (errorData as { code?: string }).code
    )
  }

  return res.json() as Promise<T>
}

export async function verifyAdminApiKey(apiKey: string): Promise<void> {
  await adminFetch<AdminAuthCheckResponse>('/admin/auth/check', {
    apiKey,
    method: 'GET',
  })
}

export async function createTagBatch(
  apiKey: string,
  count: number
): Promise<TagBatchSummary> {
  const result = await adminFetch<CreateTagBatchResponse>('/admin/tags/batches', {
    apiKey,
    method: 'POST',
    body: { count },
  })
  return result.batch
}

export async function getTagBatchStatus(
  apiKey: string,
  batchId: string
): Promise<TagBatchSummary> {
  const result = await adminFetch<{ batch: TagBatchSummary }>(
    `/admin/tags/batches/${encodeURIComponent(batchId)}`,
    { apiKey, method: 'GET' }
  )
  return result.batch
}

export async function listTagBatches(
  apiKey: string,
  limit = 10
): Promise<TagBatchSummary[]> {
  const result = await adminFetch<TagBatchListResponse>(
    `/admin/tags/batches?limit=${limit}`,
    { apiKey, method: 'GET' }
  )
  return result.batches
}

export async function getTagInventory(apiKey: string): Promise<TagInventoryResponse> {
  return adminFetch<TagInventoryResponse>('/admin/tags/inventory', {
    apiKey,
    method: 'GET',
  })
}

export async function downloadTagBatchZip(
  apiKey: string,
  batchId: string
): Promise<{ blob: Blob; filename: string }> {
  const res = await fetch(
    `${getApiBase()}/admin/tags/batches/${encodeURIComponent(batchId)}/download`,
    {
      method: 'GET',
      headers: { 'X-Admin-Api-Key': apiKey },
    }
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Download failed' }))
    throw new ApiError(
      (errorData as { error?: string }).error ?? `HTTP ${res.status}`,
      res.status,
      (errorData as { code?: string }).code
    )
  }

  const disposition = res.headers.get('Content-Disposition') ?? ''
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match?.[1] ?? `parksafe-tags-${batchId.slice(0, 8)}.zip`
  const blob = await res.blob()

  return { blob, filename }
}
