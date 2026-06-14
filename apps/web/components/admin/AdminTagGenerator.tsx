'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Check, Copy, Download, ExternalLink, Loader2, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createTagBatch,
  downloadTagBatchZip,
  getTagBatchSamples,
  getTagBatchStatus,
  listTagBatches,
} from '@/lib/api/admin'
import { ApiError } from '@/lib/api/client'
import { useAdminStore } from '@/lib/store/adminStore'
import { cn } from '@/lib/utils/cn'
import { MAX_TAG_BATCH_SIZE, type TagBatchSample, type TagBatchSummary } from '@parksafe/types'

const POLL_INTERVAL_MS = 1500

function formatEta(seconds: number | null, t: (key: string, values?: Record<string, string | number>) => string): string {
  if (seconds === null) return t('ADMIN_ETA_CALCULATING')
  if (seconds <= 0) return t('ADMIN_ETA_DONE')
  if (seconds < 60) return t('ADMIN_ETA_SECONDS', { count: seconds })
  const minutes = Math.ceil(seconds / 60)
  return t('ADMIN_ETA_MINUTES', { count: minutes })
}

function statusLabel(status: TagBatchSummary['status'], t: (key: string) => string): string {
  switch (status) {
    case 'PENDING':
      return t('ADMIN_STATUS_PENDING')
    case 'PROCESSING':
      return t('ADMIN_STATUS_PROCESSING')
    case 'COMPLETED':
      return t('ADMIN_STATUS_COMPLETED')
    case 'FAILED':
      return t('ADMIN_STATUS_FAILED')
  }
}

function BatchSampleUrls({
  samples,
}: {
  samples: TagBatchSample[]
}) {
  const t = useTranslations()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = useCallback(async (sample: TagBatchSample) => {
    try {
      await navigator.clipboard.writeText(sample.contactUrl)
      setCopiedCode(sample.tagCode)
      window.setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      // Clipboard may be unavailable outside secure context
    }
  }, [])

  if (samples.length === 0) return null

  return (
    <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50/60 p-4">
      <p className="text-sm font-medium text-neutral-900">{t('ADMIN_BATCH_SAMPLES_TITLE')}</p>
      <p className="mt-1 text-xs leading-relaxed text-neutral-600">{t('ADMIN_BATCH_SAMPLES_HINT')}</p>
      <ul className="mt-3 space-y-2">
        {samples.map(sample => (
          <li
            key={sample.tagCode}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <code className="truncate text-xs text-neutral-800">{sample.contactUrl}</code>
            <div className="flex shrink-0 gap-2">
              <a
                href={sample.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                {t('ADMIN_BATCH_SAMPLES_OPEN')}
              </a>
              <button
                type="button"
                onClick={() => void handleCopy(sample)}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {copiedCode === sample.tagCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success-500" aria-hidden />
                    {t('ADMIN_BATCH_SAMPLES_COPIED')}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                    {t('ADMIN_BATCH_SAMPLES_COPY')}
                  </>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BatchProgressCard({
  batch,
  samples,
  onDownload,
  isDownloading,
}: {
  batch: TagBatchSummary
  samples: TagBatchSample[]
  onDownload: (batchId: string) => void
  isDownloading: boolean
}) {
  const t = useTranslations()
  const isActive = batch.status === 'PENDING' || batch.status === 'PROCESSING'
  const isFailed = batch.status === 'FAILED'
  const isComplete = batch.status === 'COMPLETED'

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-900">
            {t('ADMIN_BATCH_PROGRESS_TITLE', { count: batch.requestedCount })}
          </p>
          <p
            className={cn(
              'mt-0.5 text-sm',
              isFailed ? 'text-error-500' : 'text-neutral-600'
            )}
          >
            {statusLabel(batch.status, t)}
            {isActive && batch.estimatedSecondsRemaining !== null && (
              <> · {formatEta(batch.estimatedSecondsRemaining, t)}</>
            )}
          </p>
        </div>
        {isActive && (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary-500" aria-hidden />
        )}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-neutral-600">
          <span>
            {t('ADMIN_BATCH_COUNT', {
              completed: batch.completedCount,
              total: batch.requestedCount,
            })}
          </span>
          <span>{batch.progressPercent}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-neutral-100"
          role="progressbar"
          aria-valuenow={batch.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isFailed ? 'bg-error-500' : 'bg-primary-500'
            )}
            style={{ width: `${batch.progressPercent}%` }}
          />
        </div>
      </div>

      {isFailed && batch.errorMessage && (
        <p role="alert" className="mt-3 rounded-lg border border-error-500/20 bg-error-50 px-3 py-2 text-sm text-error-500">
          {batch.errorMessage}
        </p>
      )}

      {isComplete && (
        <>
          <BatchSampleUrls samples={samples} />
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full gap-2 shadow-none"
            disabled={isDownloading}
            onClick={() => onDownload(batch.id)}
          >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t('ADMIN_DOWNLOAD_PREPARING')}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" aria-hidden />
              {t('ADMIN_DOWNLOAD_ZIP')}
            </>
          )}
        </Button>
        </>
      )}
    </div>
  )
}

function HistoryRow({
  batch,
  onDownload,
}: {
  batch: TagBatchSummary
  onDownload: (batchId: string) => void
}) {
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900">
          {batch.requestedCount} {t('ADMIN_HISTORY_TAGS')}
        </p>
        <p className="mt-0.5 text-xs text-neutral-600">
          {new Date(batch.createdAt).toLocaleString()} · {statusLabel(batch.status, t)}
        </p>
      </div>
      {batch.status === 'COMPLETED' && (
        <button
          type="button"
          onClick={() => onDownload(batch.id)}
          className="inline-flex shrink-0 items-center rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          {t('ADMIN_DOWNLOAD_ZIP')}
        </button>
      )}
    </div>
  )
}

/** Main admin UI — bulk QR tag generation with progress and ZIP download. */
export function AdminTagGenerator() {
  const t = useTranslations()
  const apiKey = useAdminStore(s => s.apiKey)
  const queryClient = useQueryClient()
  const [countInput, setCountInput] = useState('50')
  const [formError, setFormError] = useState<string | null>(null)
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const autoDownloadedRef = useRef<string | null>(null)

  const historyQuery = useQuery({
    queryKey: ['admin', 'batches'],
    queryFn: () => listTagBatches(apiKey!, 10),
    enabled: Boolean(apiKey),
    refetchInterval: activeBatchId ? POLL_INTERVAL_MS : false,
  })

  const activeBatchQuery = useQuery({
    queryKey: ['admin', 'batch', activeBatchId],
    queryFn: () => getTagBatchStatus(apiKey!, activeBatchId!),
    enabled: Boolean(apiKey && activeBatchId),
    refetchInterval: query => {
      const status = query.state.data?.status
      if (status === 'COMPLETED' || status === 'FAILED') return false
      return POLL_INTERVAL_MS
    },
  })

  const activeBatchSamplesQuery = useQuery({
    queryKey: ['admin', 'batch-samples', activeBatchId],
    queryFn: () => getTagBatchSamples(apiKey!, activeBatchId!),
    enabled: Boolean(apiKey && activeBatchId && activeBatchQuery.data?.status === 'COMPLETED'),
  })

  useEffect(() => {
    const batch = activeBatchQuery.data
    if (!batch) return

    if (batch.status === 'COMPLETED' || batch.status === 'FAILED') {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] })
    }
  }, [activeBatchQuery.data, queryClient])

  const createMutation = useMutation({
    mutationFn: (count: number) => createTagBatch(apiKey!, count),
    onSuccess: batch => {
      setActiveBatchId(batch.id)
      setFormError(null)
      void queryClient.invalidateQueries({ queryKey: ['admin', 'batches'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] })
    },
    onError: err => {
      if (err instanceof ApiError) {
        setFormError(err.message)
      } else {
        setFormError(t('GLOBAL_ERROR_GENERIC'))
      }
    },
  })

  const handleGenerate = useCallback(() => {
    const parsed = Number.parseInt(countInput, 10)
    if (!Number.isFinite(parsed) || parsed < 1) {
      setFormError(t('ADMIN_ERROR_MIN_COUNT'))
      return
    }
    if (parsed > MAX_TAG_BATCH_SIZE) {
      setFormError(t('ADMIN_ERROR_MAX_COUNT', { max: MAX_TAG_BATCH_SIZE }))
      return
    }
    if (activeBatchQuery.data?.status === 'PENDING' || activeBatchQuery.data?.status === 'PROCESSING') {
      setFormError(t('ADMIN_ERROR_BATCH_IN_PROGRESS'))
      return
    }
    createMutation.mutate(parsed)
  }, [countInput, createMutation, activeBatchQuery.data?.status, t])

  const handleDownload = useCallback(
    async (batchId: string) => {
      if (!apiKey || downloadingId) return
      setDownloadingId(batchId)
      try {
        const { blob, filename } = await downloadTagBatchZip(apiKey, batchId)
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        anchor.click()
        URL.revokeObjectURL(url)
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : t('ADMIN_ERROR_DOWNLOAD')
        setFormError(message)
      } finally {
        setDownloadingId(null)
      }
    },
    [apiKey, downloadingId, t]
  )

  useEffect(() => {
    const batch = activeBatchQuery.data
    if (!batch || batch.status !== 'COMPLETED' || !apiKey) return
    if (autoDownloadedRef.current === batch.id) return

    autoDownloadedRef.current = batch.id
    void handleDownload(batch.id)
  }, [activeBatchQuery.data, apiKey, handleDownload])

  const activeBatch = activeBatchQuery.data
  const isGenerating =
    createMutation.isPending ||
    activeBatch?.status === 'PENDING' ||
    activeBatch?.status === 'PROCESSING'

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-primary-50">
          <QrCode className="h-5 w-5 text-primary-500" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">{t('ADMIN_GENERATE_TITLE')}</h2>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{t('ADMIN_GENERATE_SUBTITLE')}</p>

        <div className="mt-6 space-y-2">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <label
                htmlFor="tag-count"
                className="mb-1.5 block text-sm font-medium text-neutral-900"
              >
                {t('ADMIN_COUNT_LABEL')}
              </label>
              <Input
                id="tag-count"
                type="number"
                min={1}
                max={MAX_TAG_BATCH_SIZE}
                value={countInput}
                onChange={e => {
                  setCountInput(e.target.value)
                  setFormError(null)
                }}
                disabled={isGenerating}
                className="shadow-none"
              />
            </div>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-[52px] w-full gap-2 shadow-none sm:w-auto sm:min-w-[148px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t('ADMIN_GENERATING')}
                </>
              ) : (
                t('ADMIN_GENERATE_CTA')
              )}
            </Button>
          </div>
          <p className="text-xs text-neutral-600">{t('ADMIN_COUNT_HINT', { max: MAX_TAG_BATCH_SIZE })}</p>
        </div>

        {formError && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-error-500/20 bg-error-50 px-3 py-2 text-sm text-error-500"
          >
            {formError}
          </p>
        )}
      </section>

      {activeBatch && (
        <BatchProgressCard
          batch={activeBatch}
          samples={activeBatchSamplesQuery.data ?? []}
          onDownload={handleDownload}
          isDownloading={downloadingId === activeBatch.id}
        />
      )}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="text-base font-semibold text-neutral-900">{t('ADMIN_HISTORY_TITLE')}</h3>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{t('ADMIN_HISTORY_SUBTITLE')}</p>

        <div className="mt-4 divide-y divide-neutral-100">
          {historyQuery.isLoading && (
            <p className="text-sm text-neutral-600">{t('GLOBAL_LOADING')}</p>
          )}
          {historyQuery.isError && (
            <p role="alert" className="text-sm text-error-500">{t('ADMIN_HISTORY_ERROR')}</p>
          )}
          {historyQuery.data?.length === 0 && (
            <p className="text-sm text-neutral-600">{t('ADMIN_HISTORY_EMPTY')}</p>
          )}
          {historyQuery.data?.map(batch => (
            <HistoryRow key={batch.id} batch={batch} onDownload={handleDownload} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h3 className="text-sm font-semibold text-neutral-900">{t('ADMIN_DOWNLOAD_INFO_TITLE')}</h3>
        <ul className="mt-3 space-y-2 pl-4 text-sm leading-relaxed text-neutral-600">
          <li className="list-disc">{t('ADMIN_DOWNLOAD_INFO_QR')}</li>
          <li className="list-disc">{t('ADMIN_DOWNLOAD_INFO_CSV')}</li>
          <li className="list-disc">{t('ADMIN_DOWNLOAD_INFO_SHEETS')}</li>
        </ul>
      </section>
    </div>
  )
}
