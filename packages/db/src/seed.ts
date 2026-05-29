/**
 * packages/db/src/seed.ts
 * Development seed — populates the DB with safe mock data for local testing.
 *
 * PRIVACY RULE: NO real PII ever. All data is fictional.
 * Use masked plates, anonymised names, and fake session IDs.
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env['DATABASE_URL'] ?? '')
const db = drizzle(client, { schema })

async function seed() {
  console.log('Seeding database with mock data...')

  // Mock vehicles — NO real plates, NO real owners
  await db.insert(schema.vehicles).values([
    {
      id: '00000000-0000-0000-0000-000000000001',
      ownerId: '00000000-0000-0000-0000-000000000010',
      make: 'Maruti',
      model: 'Swift',
      colour: 'White',
      plateEncrypted: 'ENCRYPTED_MH02AB0001', // Placeholder — real value from pgcrypto
      platePartial: 'MH**0001',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      ownerId: '00000000-0000-0000-0000-000000000010',
      make: 'Hyundai',
      model: 'Creta',
      colour: 'Silver',
      plateEncrypted: 'ENCRYPTED_KA05CD0002',
      platePartial: 'KA**0002',
      isActive: true,
    },
  ])

  // Mock tags
  await db.insert(schema.tags).values([
    {
      id: '00000000-0000-0000-0000-000000000101',
      tagCode: 'test-tag-uuid-001',
      vehicleId: '00000000-0000-0000-0000-000000000001',
      ownerId: '00000000-0000-0000-0000-000000000010',
      status: 'ACTIVE',
      notifySms: true,
      notifyWhatsapp: true,
      callEnabled: false,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      tagCode: 'inactive-tag-uuid',
      vehicleId: '00000000-0000-0000-0000-000000000002',
      ownerId: '00000000-0000-0000-0000-000000000010',
      status: 'INACTIVE',
      notifySms: false,
      notifyWhatsapp: false,
      callEnabled: false,
    },
  ])

  console.log('Seed complete.')
  await client.end()
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
