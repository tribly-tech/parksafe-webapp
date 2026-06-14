/**
 * Tag lifecycle management — public lookups return masked data only.
 */
import type { TagInfo, UpdateTagInput } from '@parksafe/types'

import {
  deactivateTagById,
  findTagByCode,
  updateTagPreferences,
  createTag,
  getAllTags,
  deleteTag,
  createBulkTags,
  type TagWithVehicleRow,
} from '../repositories/tags.repository'

interface TagLookupResult {
  found: boolean
  tag?: TagInfo
  error?: string
}

/** Active tags must still have a linked owner and live vehicle row. */
function isTagRegistered(row: TagWithVehicleRow): boolean {
  return Boolean(row.ownerId && row.vehicleId && row.vehicleMake)
}

function emptyVehicle(): TagInfo['vehicle'] {
  return { make: '', model: '', colour: '', platePartial: '' }
}

function buildInactiveTagInfo(row: TagWithVehicleRow): TagInfo {
  return {
    tagId: row.id,
    status: 'INACTIVE',
    vehicle: emptyVehicle(),
    availableChannels: [],
  }
}

function buildActiveTagInfo(row: TagWithVehicleRow): TagInfo {
  const availableChannels: Array<'SMS' | 'WHATSAPP' | 'CALL'> = []
  if (row.notifySms) availableChannels.push('SMS')
  if (row.notifyWhatsapp) availableChannels.push('WHATSAPP')
  if (row.callEnabled) availableChannels.push('CALL')

  return {
    tagId: row.id,
    status: 'ACTIVE',
    vehicle: {
      make: row.vehicleMake ?? '',
      model: row.vehicleModel ?? '',
      colour: row.vehicleColour ?? '',
      platePartial: row.vehiclePlatePartial ?? '',
    },
    availableChannels,
  }
}

/**
 * Looks up a tag by its public tag code (from the QR URL).
 * Orphaned ACTIVE tags (vehicle/owner removed) are exposed as INACTIVE with no vehicle data.
 */
export async function getTagByCode(tagCode: string): Promise<TagLookupResult> {
  const row = await findTagByCode(tagCode)

  if (!row) {
    return { found: false }
  }

  if (row.status === 'UNREGISTERED') {
    return {
      found: true,
      tag: {
        tagId: row.id,
        status: 'UNREGISTERED',
        vehicle: emptyVehicle(),
        availableChannels: [],
      },
    }
  }

  if (row.status === 'INACTIVE') {
    return { found: true, tag: buildInactiveTagInfo(row) }
  }

  if (!isTagRegistered(row)) {
    void deactivateTagById(row.id)
    return { found: true, tag: buildInactiveTagInfo(row) }
  }

  return { found: true, tag: buildActiveTagInfo(row) }
}

/**
 * Updates tag notification preferences for the authenticated owner.
 */
export async function updateTag(
  tagId: string,
  ownerId: string,
  updates: UpdateTagInput
): Promise<{ success: boolean; error?: string }> {
  const ok = await updateTagPreferences(tagId, ownerId, {
    ...(updates.notifySms !== undefined ? { notifySms: updates.notifySms } : {}),
    ...(updates.notifyWhatsapp !== undefined ? { notifyWhatsapp: updates.notifyWhatsapp } : {}),
    ...(updates.callEnabled !== undefined ? { callEnabled: updates.callEnabled } : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
  })

  if (!ok) {
    return { success: false, error: 'Failed to update tag' }
  }

  return { success: true }
}

/**
 * Create a single QR tag.
 */
export async function createNewTag(tagCode: string) {
  const existing = await findTagByCode(tagCode)

  if (existing) {
    return {
      success: false,
      error: 'Tag already exists',
    }
  }

  const tag = await createTag(tagCode)

  return {
    success: true,
    tag,
  }
}

/**
 * List all QR tags.
 */
export async function listTags() {
  return await getAllTags()
}

/**
 * Delete a QR tag.
 */
export async function removeTag(tagCode: string) {
  const success = await deleteTag(tagCode)

  return {
    success,
  }
}

export async function createBulkQrTags(count: number) {
  const tagCodes: string[] = []

  const timestamp = Date.now()

  for (let i = 1; i <= count; i++) {
    tagCodes.push(`PS-${timestamp}-${i}`)
  }

  const rows = await createBulkTags(tagCodes)

  return {
    success: true,
    created: rows.length,
    tags: rows,
  }
}
