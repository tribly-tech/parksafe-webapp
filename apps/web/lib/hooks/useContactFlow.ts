'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useContactStore } from '@/lib/store/contactStore'
import { sendContactMessage } from '@/lib/api/contact'
import { ApiError } from '@/lib/api/client'
import { track } from '@/lib/utils/analytics'
import { useAuthStore } from '@/lib/store/authStore'
import type { IssueType, ChannelType } from '@parksafe/types'

interface SubmitContactOptions {
  tagId: string
  issue: IssueType
  channel: ChannelType
  successPath: string
}

/**
 * Orchestrates contact flow side effects (submit, analytics).
 * Navigation between steps is URL-driven; this hook handles API calls.
 */
export function useContactFlow() {
  const t = useTranslations()
  const router = useRouter()
  const token = useAuthStore(s => s.token)

  const selectedIssue = useContactStore(s => s.selectedIssue)
  const selectedChannel = useContactStore(s => s.selectedChannel)
  const isSubmitting = useContactStore(s => s.isSubmitting)
  const error = useContactStore(s => s.error)
  const customNote = useContactStore(s => s.customNote)

  const setTagId = useContactStore(s => s.setTagId)
  const selectIssue = useContactStore(s => s.selectIssue)
  const selectChannel = useContactStore(s => s.selectChannel)
  const setError = useContactStore(s => s.setError)
  const setSubmitting = useContactStore(s => s.setSubmitting)
  const reset = useContactStore(s => s.reset)

  const mapContactError = useCallback(
    (err: unknown): string => {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          return err.message || t('CONTACT_ERROR_RATE_LIMIT')
        }
        if (err.status === 400) {
          return err.message || t('CONTACT_ERROR_CHANNEL_DISABLED')
        }
        if (err.status === 503) {
          return err.message || t('CONTACT_ERROR_DELIVERY_FAILED')
        }
        return err.message || t('GLOBAL_ERROR_GENERIC')
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return t('CONTACT_ERROR_OFFLINE')
      }

      return t('GLOBAL_ERROR_GENERIC')
    },
    [t]
  )

  const submitContact = useCallback(
    async ({ tagId, issue, channel, successPath }: SubmitContactOptions): Promise<boolean> => {
      setSubmitting(true)
      setError(null)

      try {
        const sessionId =
          sessionStorage.getItem('ps-session-id') ??
          (() => {
            const id = crypto.randomUUID()
            sessionStorage.setItem('ps-session-id', id)
            return id
          })()

        const note = useContactStore.getState().customNote

        await sendContactMessage(
          {
            tagId,
            issueType: issue,
            channel,
            customNote: note || undefined,
          },
          sessionId,
          token ?? undefined
        )

        track({
          event: 'contact_sent',
          properties: { channel, issueType: issue },
        })

        const sentAt = new Date().toISOString()
        useContactStore.getState().setSentAt(sentAt)
        useContactStore.getState().setStep('success')
        const params = new URLSearchParams({
          issue,
          channel,
          sentAt,
        })
        router.push(`${successPath}?${params.toString()}`)
        return true
      } catch (err) {
        if (err instanceof ApiError) {
          track({
            event: 'contact_failed',
            properties: { channel, issueType: issue, status: err.status },
          })
        }
        setError(mapContactError(err))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [router, mapContactError, setSubmitting, setError, token]
  )

  const selectChannelAndSubmit = useCallback(
    async (options: SubmitContactOptions) => {
      selectChannel(options.channel)
      return submitContact(options)
    },
    [selectChannel, submitContact]
  )

  return {
    selectedIssue,
    selectedChannel,
    customNote,
    isSubmitting,
    error,
    setTagId,
    selectIssue,
    selectChannel,
    selectChannelAndSubmit,
    setError,
    reset,
    submitContact,
  }
}
