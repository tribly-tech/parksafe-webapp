'use client'

import { useRef, useState, useCallback, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

interface OtpInputProps {
  /** Number of OTP digits — defaults to 6. */
  length?: number
  /** Called when all digits are filled in. */
  onComplete: (otp: string) => void
  /** Error message displayed below the inputs. */
  error?: string
  disabled?: boolean
}

/**
 * 6-digit OTP input with auto-advance focus, paste support, and auto-submit.
 * Accessibility: ARIA group label, per-digit labels, error announcement.
 * Touch targets are 48×48px to meet WCAG 2.5.5.
 */
export function OtpInput({ length = 6, onComplete, error, disabled = false }: OtpInputProps) {
  const t = useTranslations()
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null))

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return

      const newValues = [...values]
      // Accept only the last digit if multiple characters are somehow entered
      newValues[index] = value.slice(-1)
      setValues(newValues)

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      const complete = newValues.join('')
      if (complete.length === length) {
        onComplete(complete)
      }
    },
    [values, length, onComplete]
  )

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      // Move focus back on backspace from an empty input
      if (e.key === 'Backspace' && !values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    },
    [values]
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      if (!pasted) return

      const newValues = Array(length).fill('')
      pasted.split('').forEach((char, i) => {
        newValues[i] = char
      })
      setValues(newValues)

      const lastIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[lastIndex]?.focus()

      if (pasted.length === length) {
        onComplete(pasted)
      }
    },
    [length, onComplete]
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2" role="group" aria-label={t('ARIA_OTP_GROUP')}>
        {values.map((value, index) => (
          <input
            key={index}
            ref={el => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              'h-12 w-12 rounded-button border-2 text-center text-lg font-semibold text-neutral-900',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              error
                ? 'border-error-500 bg-error-50 focus:border-error-500'
                : value
                  ? 'border-primary-500 bg-primary-50 focus:border-primary-500'
                  : 'border-neutral-200 bg-white focus:border-primary-500',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-error-500" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}
