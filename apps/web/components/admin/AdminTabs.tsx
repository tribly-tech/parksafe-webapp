'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

export type AdminTabId = 'generate' | 'inventory'

interface AdminTabsProps {
  activeTab: AdminTabId
  onTabChange: (tab: AdminTabId) => void
}

/** Segmented tab control for admin — Generate and Inventory. */
export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const t = useTranslations()

  const tabs: { id: AdminTabId; label: string }[] = [
    { id: 'generate', label: t('ADMIN_TAB_GENERATE') },
    { id: 'inventory', label: t('ADMIN_TAB_INVENTORY') },
  ]

  return (
    <div
      role="tablist"
      aria-label={t('ADMIN_TABS_ARIA')}
      className="grid grid-cols-2 gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1"
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-white text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
