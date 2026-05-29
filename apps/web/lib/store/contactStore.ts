'use client'

import { create } from 'zustand'
import type { IssueType, ChannelType } from '@parksafe/types'

type ContactStep = 'issue' | 'otp' | 'channel' | 'success'

interface ContactState {
  step: ContactStep
  tagId: string | null
  selectedIssue: IssueType | null
  selectedChannel: ChannelType | null
  customNote: string
  isSubmitting: boolean
  error: string | null
  /** ISO timestamp set when the relay succeeds — shown on the success screen */
  sentAt: string | null

  setTagId: (tagId: string) => void
  selectIssue: (issue: IssueType) => void
  selectChannel: (channel: ChannelType) => void
  setCustomNote: (note: string) => void
  setStep: (step: ContactStep) => void
  setSubmitting: (value: boolean) => void
  setError: (message: string | null) => void
  setSentAt: (iso: string) => void
  goBackToIssues: () => void
  reset: () => void
}

const initialState = {
  step: 'issue' as ContactStep,
  tagId: null,
  selectedIssue: null,
  selectedChannel: null,
  customNote: '',
  isSubmitting: false,
  error: null,
  sentAt: null,
}

/**
 * Contact flow state — tracks the multi-step reporter → owner contact journey.
 * Not persisted: state is ephemeral and resets when the flow completes.
 */
export const useContactStore = create<ContactState>()(set => ({
  ...initialState,

  setTagId: tagId => set({ tagId }),
  selectIssue: issue => set({ selectedIssue: issue }),
  selectChannel: channel => set({ selectedChannel: channel }),
  setCustomNote: note => set({ customNote: note }),
  setStep: step => set({ step }),
  setSubmitting: value => set({ isSubmitting: value }),
  setError: message => set({ error: message }),
  setSentAt: sentAt => set({ sentAt }),

  goBackToIssues: () =>
    set({
      step: 'issue',
      selectedChannel: null,
      error: null,
      isSubmitting: false,
      sentAt: null,
    }),

  /** Resets the entire contact flow — called after success or navigation away. */
  reset: () => set(initialState),
}))
