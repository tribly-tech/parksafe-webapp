'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface OdometerCounterProps {
  value: number
  maxDigits?: number
  className?: string
  animate?: boolean
}

/** Single rolling digit cylinder — skeuomorphic odometer style. */
function OdometerDigit({
  digit,
  animate,
  delayMs,
}: {
  digit: number
  animate: boolean
  delayMs: number
}) {
  const [display, setDisplay] = useState(animate ? 0 : digit)

  useEffect(() => {
    if (!animate) {
      setDisplay(digit)
      return
    }
    const timeout = window.setTimeout(() => setDisplay(digit), delayMs)
    return () => window.clearTimeout(timeout)
  }, [digit, animate, delayMs])

  return (
    <div
      className="relative h-14 w-10 overflow-hidden rounded-lg bg-white shadow-[inset_0_2px_6px_rgba(27,182,88,0.10)]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 flex flex-col items-center transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${-display * 3.5}rem)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="flex h-14 w-full items-center justify-center text-2xl font-bold tabular-nums text-[#166534]"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Mechanical odometer display — rolls digits on load for smooth reveal.
 */
export function OdometerCounter({
  value,
  maxDigits = 3,
  className,
  animate = true,
}: OdometerCounterProps) {
  const clamped = Math.min(10 ** maxDigits - 1, Math.max(0, value))
  const digits = useMemo(() => {
    const str = String(clamped).padStart(maxDigits, '0')
    return str.split('').map(Number)
  }, [clamped, maxDigits])

  return (
    <div
      className={cn('flex items-center gap-1.5 bg-[#dcfce7] p-2 shadow-[0_0_0_1.5px_#86efac]', className)}
      style={{ borderRadius: '16px' }}
      role="img"
      aria-label={String(clamped)}
    >
      {digits.map((d, i) => (
        <OdometerDigit
          key={`${maxDigits}-${i}`}
          digit={d}
          animate={animate}
          delayMs={i * 120}
        />
      ))}
    </div>
  )
}
