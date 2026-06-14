import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import {
  setupIntegrationDb,
  teardownIntegrationDb,
  truncateAllTables,
} from '../helpers/integration-db'
import { createUser } from '../../src/repositories/users.repository'
import { insertVehicle } from '../../src/repositories/vehicles.repository'
import { getDb } from '../../src/lib/db'
import { tags } from '@parksafe/db'
import { eq } from 'drizzle-orm'

vi.mock('../../src/types/env', async importOriginal => {
  const actual = await importOriginal<typeof import('../../src/types/env')>()
  return {
    ...actual,
    isOtpDevMode: false,
  }
})

const { getTagByCode } = await import('../../src/services/tag.service')
const { deleteVehicle } = await import('../../src/services/vehicle.service')

describe('tag.service integration', () => {
  let ownerId: string
  let vehicleId: string
  let tagCode: string

  beforeAll(async () => {
    await setupIntegrationDb()
  })

  afterAll(async () => {
    await teardownIntegrationDb()
  })

  beforeEach(async () => {
    await truncateAllTables()
    tagCode = 'tag-lookup-test-001'

    const user = await createUser({
      displayName: 'Owner',
      phoneE164: '+919876543210',
    })
    ownerId = user.id

    const vehicle = await insertVehicle(ownerId, {
      make: 'Honda',
      model: 'City',
      colour: 'White',
      plate: 'MH12AB1234',
    })
    vehicleId = vehicle.id

    const db = getDb()
    if (db) {
      await db.insert(tags).values({
        tagCode,
        ownerId,
        vehicleId,
        status: 'ACTIVE',
        notifySms: true,
        notifyWhatsapp: true,
        callEnabled: false,
      })
    }
  })

  it('returns active tag with masked vehicle details', async () => {
    const result = await getTagByCode(tagCode)

    expect(result.found).toBe(true)
    expect(result.tag?.status).toBe('ACTIVE')
    expect(result.tag?.vehicle.make).toBe('Honda')
    expect(result.tag?.vehicle.platePartial).toBe('MH**1234')
  })

  it('returns inactive with no vehicle after the linked vehicle is deleted', async () => {
    const deleted = await deleteVehicle(vehicleId, ownerId)
    expect(deleted.success).toBe(true)

    const result = await getTagByCode(tagCode)
    expect(result.found).toBe(true)
    expect(result.tag?.status).toBe('INACTIVE')
    expect(result.tag?.vehicle).toEqual({
      make: '',
      model: '',
      colour: '',
      platePartial: '',
    })
    expect(result.tag?.availableChannels).toEqual([])

    const db = getDb()
    const row = await db?.select().from(tags).where(eq(tags.tagCode, tagCode)).limit(1)
    expect(row?.[0]?.status).toBe('INACTIVE')
  })

  it('returns inactive when owner/vehicle links are cleared but tag stayed active', async () => {
    const db = getDb()
    await db
      ?.update(tags)
      .set({ ownerId: null, vehicleId: null, status: 'ACTIVE' })
      .where(eq(tags.tagCode, tagCode))

    const result = await getTagByCode(tagCode)
    expect(result.found).toBe(true)
    expect(result.tag?.status).toBe('INACTIVE')
    expect(result.tag?.vehicle.make).toBe('')
  })
})
