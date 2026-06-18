'use client'

import { useTagStatus } from '@/lib/hooks/useTagStatus'
import { track } from '@/lib/utils/analytics'
import { useTranslations } from 'next-intl'
import { cva } from 'class-variance-authority'

const tagToggleVariants = cva(
  'flex min-h-touch items-center justify-center rounded-button px-4 text-sm font-semibold transition-colors',
  {
    variants: {
      isActive: {
        true: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
        false: 'bg-primary-500 text-white hover:bg-primary-600',
      },
      isUpdating: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: { isActive: false, isUpdating: false },
  }
)

interface TagStatusToggleProps {
  tagId: string
  isActive: boolean
}

/**
 * Toggle for activating/pausing notifications on a specific tag.
 * Visually communicates active state via colour and label — no icon-only controls.
 */
export function TagStatusToggle({ tagId, isActive }: TagStatusToggleProps) {
  const t = useTranslations()
  const { updatePreferences, isUpdating } = useTagStatus(tagId)

  const handleToggle = async () => {
    const nextStatus = isActive ? 'INACTIVE' : 'ACTIVE'
    try {
      await updatePreferences({ status: nextStatus })
      track({
        event: nextStatus === 'ACTIVE' ? 'tag_activated' : 'tag_deactivated',
        properties: {},
      })
    } catch {
      // Error surfaced via mutation state upstream
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={isUpdating}
      aria-label={isActive ? t('DASHBOARD_TAG_TOGGLE_DEACTIVATE') : t('DASHBOARD_TAG_TOGGLE_ACTIVATE')}
      className={tagToggleVariants({ isActive, isUpdating })}
    >
      {isUpdating
        ? t('GLOBAL_UPDATING')
        : isActive
          ? t('DASHBOARD_TAG_STATUS_ACTIVE')
          : t('DASHBOARD_TAG_STATUS_INACTIVE')}
    </button>
  )
}
