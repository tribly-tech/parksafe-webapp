import { getTagInfo } from '@/lib/api/tags'
import { routes } from '@/lib/routes'

export type QrEntryTarget =
  | { kind: 'register'; tagId: string }
  | { kind: 'contact'; tagId: string }
  | { kind: 'inactive'; tagId: string }

/**
 * Decides where a scanned QR should land.
 * Unregistered / unknown tags → owner registration; active tags → reporter contact flow.
 */
export async function resolveQrEntry(tagId: string): Promise<QrEntryTarget> {
  const tag = await getTagInfo(tagId)

  if (!tag || tag.status === 'UNREGISTERED') {
    return { kind: 'register', tagId }
  }

  if (tag.status === 'INACTIVE') {
    return { kind: 'inactive', tagId }
  }

  return { kind: 'contact', tagId }
}

export function qrEntryPath(entry: QrEntryTarget): string {
  switch (entry.kind) {
    case 'register':
      return routes.register({ tag: entry.tagId })
    case 'inactive':
      return routes.contact.tag(entry.tagId)
    case 'contact':
      return routes.contact.tag(entry.tagId)
  }
}
