/**
 * apps/api/src/services/audit.service.ts
 * Logs contact events to the database for owner history and abuse detection.
 * CRITICAL: No reporter PII is ever stored — only hashed session identifiers.
 */

import crypto from 'node:crypto'
import { supabase } from '../lib/supabase'
import type { IssueType, ChannelType } from '@parksafe/types'

interface AuditContactEventOptions {
  tagId: string
  vehicleId?: string
  /** Raw session ID — HMAC-hashed before storage, never stored raw */
  reporterSessionId: string
  /** Authenticated reporter — optional, never includes phone */
  reporterUserId?: string
  issueType: IssueType
  channel: ChannelType
  customNote?: string
  relaySuccess: boolean
}

/**
 * Hashes a session ID using HMAC-SHA256.
 * Enables abuse pattern detection without exposing reporter identity.
 */
function hashSessionId(sessionId: string): string {
  return crypto
    .createHmac('sha256', process.env['SESSION_SIGNING_SECRET'] ?? '')
    .update(sessionId)
    .digest('hex')
}

/**
 * Records a contact event in the audit log.
 * Fires and forgets — relay dispatch should not block on audit writes.
 * @param opts - Contact event details (no raw PII)
 */
export async function auditContactEvent(opts: AuditContactEventOptions): Promise<void> {
  const sessionHash = hashSessionId(opts.reporterSessionId)

  const row: Record<string, unknown> = {
    tag_id: opts.tagId,
    vehicle_id: opts.vehicleId,
    reporter_session_hash: sessionHash,
    issue_type: opts.issueType,
    channel: opts.channel,
    custom_note: opts.customNote ?? null,
    relay_status: opts.relaySuccess ? 'DELIVERED' : 'FAILED',
  }
  if (opts.reporterUserId) {
    row['reporter_user_id'] = opts.reporterUserId
  }

  const { error } = await supabase.from('contact_events').insert(row)

  if (error) {
    // Audit failures must not surface to the user — log and continue
    console.error('[audit] Failed to write contact event:', error.message)
  }
}
