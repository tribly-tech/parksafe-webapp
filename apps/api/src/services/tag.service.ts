/**
 * apps/api/src/services/tag.service.ts
 * Tag lifecycle management: lookup, activate, deactivate, preference updates.
 * Public tag lookups return only masked vehicle data — never owner identity.
 */

import { supabase } from '../lib/supabase'
import type { TagInfo, UpdateTagInput } from '@parksafe/types'

interface TagLookupResult {
  found: boolean
  tag?: TagInfo
  error?: string
}

/**
 * Looks up a tag by its public tag code (from the QR URL).
 * Returns only the data safe for reporters — no owner PII.
 * @param tagCode - UUID embedded in the QR sticker URL
 */
export async function getTagByCode(tagCode: string): Promise<TagLookupResult> {
  const { data, error } = await supabase
    .from('tags')
    .select(
      `
      id,
      status,
      notify_sms,
      notify_whatsapp,
      call_enabled,
      vehicles (
        make,
        model,
        colour,
        plate_partial
      )
    `
    )
    .eq('tag_code', tagCode)
    .single()

  if (error || !data) {
    return { found: false }
  }

  // Build the safe public response — no owner phone, no full plate
  const vehicle = Array.isArray(data.vehicles) ? data.vehicles[0] : data.vehicles

  const availableChannels: Array<'SMS' | 'WHATSAPP' | 'CALL'> = []
  if (data.notify_sms) availableChannels.push('SMS')
  if (data.notify_whatsapp) availableChannels.push('WHATSAPP')
  if (data.call_enabled) availableChannels.push('CALL')

  return {
    found: true,
    tag: {
      tagId: data.id as string,
      status: data.status as TagInfo['status'],
      vehicle: {
        make: vehicle?.make as string,
        model: vehicle?.model as string,
        colour: vehicle?.colour as string,
        platePartial: vehicle?.plate_partial as string,
      },
      availableChannels,
    },
  }
}

/**
 * Updates tag notification preferences for the authenticated owner.
 * @param tagId - UUID of the tag to update
 * @param ownerId - Authenticated user ID (from JWT) — prevents unauthorized updates
 * @param updates - Partial preference updates
 */
export async function updateTag(
  tagId: string,
  ownerId: string,
  updates: UpdateTagInput
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('tags')
    .update({
      notify_sms: updates.notifySms,
      notify_whatsapp: updates.notifyWhatsapp,
      call_enabled: updates.callEnabled,
      status: updates.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tagId)
    .eq('owner_id', ownerId) // Ownership check enforced at query level

  if (error) {
    console.error('[tag.service] Update failed:', error.message)
    return { success: false, error: 'Failed to update tag' }
  }

  return { success: true }
}
