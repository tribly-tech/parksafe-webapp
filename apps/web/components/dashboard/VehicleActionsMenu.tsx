'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { MoreVertical, PauseCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

interface VehicleActionsMenuProps {
  vehicleLabel: string
  onDeactivate: () => void
  disabled?: boolean
}

/** Kebab menu for vehicle card actions — currently supports marking inactive. */
export function VehicleActionsMenu({
  vehicleLabel,
  onDeactivate,
  disabled = false,
}: VehicleActionsMenuProps) {
  const t = useTranslations()
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleDeactivate = () => {
    setOpen(false)
    onDeactivate()
  }

  return (
    <div ref={containerRef} className="absolute right-4 top-4">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('DASHBOARD_VEHICLE_MENU_ARIA', { vehicle: vehicleLabel })}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-button text-neutral-400 transition-colors',
          'hover:bg-neutral-100 hover:text-neutral-600',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
          'disabled:opacity-50'
        )}
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('DASHBOARD_VEHICLE_MENU_ARIA', { vehicle: vehicleLabel })}
          className="absolute right-0 top-full z-10 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleDeactivate}
            disabled={disabled}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            <PauseCircle className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
            {t('DASHBOARD_VEHICLE_MAKE_INACTIVE')}
          </button>
        </div>
      )}
    </div>
  )
}
