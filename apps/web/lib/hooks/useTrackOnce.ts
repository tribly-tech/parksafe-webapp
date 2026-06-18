'use client'

import { useEffect, useRef } from 'react'

/** Fires a callback once per mount — used for one-time analytics events. */
export function useTrackOnce(callback: () => void): void {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    callback()
  }, [callback])
}
