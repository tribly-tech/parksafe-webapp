'use client'

import { useTrackOnce } from '@/lib/hooks/useTrackOnce'
import { track } from '@/lib/utils/analytics'

interface QrEntryTrackerProps {
  tagStatus: 'ACTIVE' | 'INACTIVE' | 'UNREGISTERED'
}

/** Fires qr_scanned once when a QR entry screen loads. */
export function QrEntryTracker({ tagStatus }: QrEntryTrackerProps) {
  useTrackOnce(() => {
    track({ event: 'qr_scanned', properties: { tagStatus } })
  })

  return null
}
