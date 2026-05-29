'use client'

import { useState, useCallback } from 'react'
import { requestOtp, verifyOtp } from '@/lib/api/auth'
import type { RequestOtpInput, VerifyOtpInput } from '@parksafe/types'

type OtpPhase = 'idle' | 'requesting' | 'waiting' | 'verifying' | 'verified' | 'error'

interface OtpState {
  phase: OtpPhase
  error: string | null
  attemptsRemaining: number | null
}

interface UseOtpReturn extends OtpState {
  request: (input: RequestOtpInput) => Promise<void>
  verify: (input: VerifyOtpInput) => Promise<boolean>
  reset: () => void
}

/**
 * Manages the full OTP request → verify lifecycle.
 * Tracks phase, errors, and remaining attempts for UI feedback.
 */
export function useOtp(): UseOtpReturn {
  const [state, setState] = useState<OtpState>({
    phase: 'idle',
    error: null,
    attemptsRemaining: null,
  })

  const request = useCallback(async (input: RequestOtpInput) => {
    setState({ phase: 'requesting', error: null, attemptsRemaining: null })
    try {
      await requestOtp(input)
      setState({ phase: 'waiting', error: null, attemptsRemaining: 3 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP'
      setState({ phase: 'error', error: message, attemptsRemaining: null })
    }
  }, [])

  const verify = useCallback(async (input: VerifyOtpInput): Promise<boolean> => {
    setState(prev => ({ ...prev, phase: 'verifying', error: null }))
    try {
      const res = await verifyOtp(input)
      if (res.verified) {
        setState({ phase: 'verified', error: null, attemptsRemaining: null })
        return true
      }
      return false
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed'
      // Parse remaining attempts from error message
      const match = /(\d+) attempt/.exec(message)
      const attemptsRemaining = match ? parseInt(match[1] ?? '0', 10) : null
      setState({ phase: 'error', error: message, attemptsRemaining })
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setState({ phase: 'idle', error: null, attemptsRemaining: null })
  }, [])

  return { ...state, request, verify, reset }
}
