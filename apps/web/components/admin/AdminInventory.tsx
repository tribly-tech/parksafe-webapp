'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Package, RefreshCw, ShoppingBag, Tags } from 'lucide-react'
import { getTagInventory } from '@/lib/api/admin'
import { useAdminStore } from '@/lib/store/adminStore'
import { cn } from '@/lib/utils/cn'
import type { TagBatchInventoryRow, TagInventorySummary } from '@parksafe/types'

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  hint: string
  icon: React.ComponentType<{ className?: string }>
  accent: 'neutral' | 'primary' | 'success'
}) {
  const accentStyles = {
    neutral: 'border-neutral-200 bg-white text-neutral-900',
    primary: 'border-primary-500/30 bg-primary-50 text-primary-600',
    success: 'border-neutral-200 bg-white text-neutral-900',
  }

  return (
    <div className={cn('rounded-2xl border p-5', accentStyles[accent])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-600">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-neutral-900">
            {value.toLocaleString()}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">{hint}</p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
            accent === 'primary'
              ? 'border-primary-500/20 bg-white'
              : 'border-neutral-200 bg-neutral-50'
          )}
        >
          <Icon
            className={cn('h-5 w-5', accent === 'primary' ? 'text-primary-500' : 'text-neutral-600')}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

function BatchInventoryTable({ batches }: { batches: TagBatchInventoryRow[] }) {
  const t = useTranslations()

  if (batches.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-600">{t('ADMIN_INVENTORY_BATCHES_EMPTY')}</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-600">
            <th className="pb-3 pr-4 font-medium">{t('ADMIN_INVENTORY_COL_DATE')}</th>
            <th className="pb-3 pr-4 font-medium text-right">{t('ADMIN_INVENTORY_COL_GENERATED')}</th>
            <th className="pb-3 pr-4 font-medium text-right">{t('ADMIN_INVENTORY_COL_STOCK')}</th>
            <th className="pb-3 font-medium text-right">{t('ADMIN_INVENTORY_COL_SOLD')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {batches.map(batch => (
            <tr key={batch.batchId}>
              <td className="py-3 pr-4">
                <p className="font-medium text-neutral-900">
                  {new Date(batch.createdAt).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="mt-0.5 text-xs text-neutral-600">
                  {batch.batchId.slice(0, 8)} · {batch.batchStatus.toLowerCase()}
                </p>
              </td>
              <td className="py-3 pr-4 text-right tabular-nums text-neutral-900">
                {batch.tagCount.toLocaleString()}
              </td>
              <td className="py-3 pr-4 text-right tabular-nums text-neutral-900">
                {batch.inStock.toLocaleString()}
              </td>
              <td className="py-3 text-right tabular-nums text-neutral-900">
                {batch.sold.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SummarySection({ summary }: { summary: TagInventorySummary }) {
  const t = useTranslations()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label={t('ADMIN_INVENTORY_GENERATED')}
        value={summary.totalGenerated}
        hint={t('ADMIN_INVENTORY_GENERATED_HINT')}
        icon={Tags}
        accent="neutral"
      />
      <StatCard
        label={t('ADMIN_INVENTORY_STOCK')}
        value={summary.inStock}
        hint={t('ADMIN_INVENTORY_STOCK_HINT')}
        icon={Package}
        accent="primary"
      />
      <StatCard
        label={t('ADMIN_INVENTORY_SOLD')}
        value={summary.sold}
        hint={t('ADMIN_INVENTORY_SOLD_HINT')}
        icon={ShoppingBag}
        accent="success"
      />
    </div>
  )
}

/** Inventory tab — tag counts from the database. */
export function AdminInventory() {
  const t = useTranslations()
  const apiKey = useAdminStore(s => s.apiKey)

  const inventoryQuery = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: () => getTagInventory(apiKey!),
    enabled: Boolean(apiKey),
    refetchInterval: 30_000,
  })

  const summary = inventoryQuery.data?.summary
  const batches = inventoryQuery.data?.batches ?? []

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">{t('ADMIN_INVENTORY_TITLE')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              {t('ADMIN_INVENTORY_SUBTITLE')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void inventoryQuery.refetch()}
            disabled={inventoryQuery.isFetching}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            <RefreshCw
              className={cn('h-4 w-4', inventoryQuery.isFetching && 'animate-spin')}
              aria-hidden
            />
            {t('ADMIN_INVENTORY_REFRESH')}
          </button>
        </div>

        <div className="mt-6">
          {inventoryQuery.isLoading && (
            <p className="text-sm text-neutral-600">{t('GLOBAL_LOADING')}</p>
          )}
          {inventoryQuery.isError && (
            <p role="alert" className="text-sm text-error-500">
              {t('ADMIN_INVENTORY_ERROR')}
            </p>
          )}
          {summary && <SummarySection summary={summary} />}
        </div>

        {summary && summary.sold > 0 && (
          <p className="mt-4 text-xs text-neutral-600">
            {t('ADMIN_INVENTORY_SOLD_BREAKDOWN', {
              active: summary.active,
              inactive: summary.inactive,
            })}
          </p>
        )}

        {summary && (
          <p className="mt-2 text-xs text-neutral-500">
            {t('ADMIN_INVENTORY_UPDATED', {
              time: new Date(summary.updatedAt).toLocaleTimeString(),
            })}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="text-base font-semibold text-neutral-900">
          {t('ADMIN_INVENTORY_BATCHES_TITLE')}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
          {t('ADMIN_INVENTORY_BATCHES_SUBTITLE')}
        </p>
        <div className="mt-4">
          {inventoryQuery.isLoading ? (
            <p className="text-sm text-neutral-600">{t('GLOBAL_LOADING')}</p>
          ) : (
            <BatchInventoryTable batches={batches} />
          )}
        </div>
      </section>
    </div>
  )
}
