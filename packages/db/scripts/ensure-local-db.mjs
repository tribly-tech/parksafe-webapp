import postgres from 'postgres'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const envText = readFileSync(join(root, '.env'), 'utf8')
const get = (key) => envText.match(new RegExp(`^${key}=(.+)$`, 'm'))?.[1]?.trim()

const config = {
  host: get('DB_HOST') ?? 'localhost',
  port: Number(get('DB_PORT') ?? 5432),
  user: get('DB_USER') ?? 'postgres',
  password: get('DB_PASSWORD') ?? '',
  max: 1,
}

const dbName = get('DB_NAME') ?? 'parksafe'

const admin = postgres({ ...config, database: 'postgres' })
const exists = await admin`select 1 from pg_database where datname = ${dbName}`
if (exists.length === 0) {
  await admin.unsafe(`create database "${dbName}"`)
  console.log(`[local-db] Created database: ${dbName}`)
} else {
  console.log(`[local-db] Database already exists: ${dbName}`)
}
await admin.end()

const sql = postgres({ ...config, database: dbName })
await sql`select 1 as ok`
console.log(`[local-db] Connected on ${config.host}:${config.port}/${dbName}`)
await sql.end()
