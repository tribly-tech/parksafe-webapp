/**
 * apps/api/src/services/contact.service.ts
 * Contact relay business logic — owner phone resolution, note filtering, dispatch, audit.
 * Owner phone is resolved server-side only and NEVER returned to the client.
 */

import crypto from 'node:crypto'
import type { ChannelType, IssueType } from '@parksafe/types'
import { supabase } from '../lib/supabase'
import { getTagByCode } from './tag.service'
import { dispatchRelay } from './relay.service'
import { auditContactEvent } from './audit.service'
import { filterNote } from './profanity.service'
import { isOtpDevMode } from '../types/env'
import { incrementDevReports } from './dev-store'

interface ContactRequestInput {
  tagId: string
  issueType: IssueType
  channel: ChannelType
  customNote?: string | undefined
  sessionId: string
  reporterUserId?: string | undefined
}

interface ContactRequestResult {
  success: boolean
  messageId?: string
  error?: string
  status: number
}

/**
 * Resolves the owner's phone number for relay dispatch.
 * Uses Supabase Vault RPC when available — placeholder until vault integration is complete.
 * @param tagId - Internal tag UUID linked to the owner account
 */
export async function resolveOwnerPhone(tagId: string): Promise<string | null> {
  const { data: ownerData } = await supabase
    .from('users')
    .select('phone_hash')
    .eq('id', tagId)
    .single()

  // Vault RPC will replace this cast once decrypt_owner_phone is wired up
  const row = ownerData as { owner_phone?: string } | null
  return row?.owner_phone ?? null
}

/**
 * Processes a reporter contact request end-to-end.
 * Validates tag status, resolves owner phone, filters note, dispatches relay, and audits.
 */
export async function processContactRequest(
  input: ContactRequestInput
): Promise<ContactRequestResult> {
  const { tagId, issueType, channel, customNote, sessionId, reporterUserId } = input

  const tagResult = await getTagByCode(tagId)

  if (!tagResult.found || !tagResult.tag) {
    return { success: false, error: 'Tag not found', status: 404 }
  }

  if (tagResult.tag.status !== 'ACTIVE') {
    return { success: false, error: 'Tag is not active', status: 400 }
  }

  if (!tagResult.tag.availableChannels.includes(channel)) {
    return {
      success: false,
      error: `Channel ${channel} is not enabled for this tag`,
      status: 400,
    }
  }

  const ownerPhone = await resolveOwnerPhone(tagResult.tag.tagId)

  if (!ownerPhone) {
    return {
      success: false,
      error: 'Unable to reach vehicle owner at this time',
      status: 503,
    }
  }

  const filteredNote = filterNote(customNote)

  const relayResult = await dispatchRelay({
    ownerPhone,
    issueType,
    channel,
    customNote: filteredNote,
  })

  if (isOtpDevMode && reporterUserId) {
    incrementDevReports(reporterUserId)
  }

  void auditContactEvent({
    tagId: tagResult.tag.tagId,
    vehicleId: undefined,
    reporterSessionId: sessionId,
    reporterUserId,
    issueType,
    channel,
    customNote: filteredNote,
    relaySuccess: relayResult.success,
  })

  if (!relayResult.success) {
    return {
      success: false,
      error: 'Failed to deliver message. Please try again.',
      status: 503,
    }
  }

  return {
    success: true,
    messageId: relayResult.providerMessageId ?? crypto.randomUUID(),
    status: 200,
  }
}
