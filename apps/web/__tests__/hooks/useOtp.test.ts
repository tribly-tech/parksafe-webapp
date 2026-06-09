import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useOtp } from '@/lib/hooks/useOtp'

vi.mock('@/lib/api/auth', () => ({
  requestOtp: vi.fn(),
  verifyOtp: vi.fn(),
}))

const { requestOtp, verifyOtp } = await import('@/lib/api/auth')

describe('useOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in idle phase', () => {
    const { result } = renderHook(() => useOtp())
    expect(result.current.phase).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  it('transitions to waiting phase after successful OTP request', async () => {
    vi.mocked(requestOtp).mockResolvedValueOnce({ message: 'OTP sent' })

    const { result } = renderHook(() => useOtp())
    await act(async () => {
      await result.current.request({ phone: '+919876500001' })
    })

    expect(result.current.phase).toBe('waiting')
    expect(result.current.error).toBeNull()
    expect(result.current.attemptsRemaining).toBe(3)
  })

  it('transitions to error phase on OTP request failure', async () => {
    vi.mocked(requestOtp).mockRejectedValueOnce(new Error('Rate limited'))

    const { result } = renderHook(() => useOtp())
    await act(async () => {
      await result.current.request({ phone: '+919876500001' })
    })

    expect(result.current.phase).toBe('error')
    expect(result.current.error).toBe('Rate limited')
  })

  it('transitions to verified on successful verification', async () => {
    vi.mocked(verifyOtp).mockResolvedValueOnce({ message: 'OTP verified.', verified: true })

    const { result } = renderHook(() => useOtp())
    let verified = false
    await act(async () => {
      verified = await result.current.verify({ phone: '+919876500001', otp: '123456' })
    })

    expect(verified).toBe(true)
    expect(result.current.phase).toBe('verified')
  })

  it('resets state on reset() call', async () => {
    vi.mocked(requestOtp).mockResolvedValueOnce({ message: 'OTP sent' })

    const { result } = renderHook(() => useOtp())
    await act(async () => {
      await result.current.request({ phone: '+919876500001' })
    })

    act(() => result.current.reset())

    expect(result.current.phase).toBe('idle')
    expect(result.current.error).toBeNull()
  })
})
