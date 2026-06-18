import { IssueType } from '@parksafe/types'
import { ISSUE_META } from '@/components/contact/issueMeta'
import { formatDate, relativeTime } from '@/lib/utils/formatters'

export type AlertDateGroup = 'today' | 'yesterday' | 'thisWeek' | 'earlier'

/** Shared shape for received and sent alert list items. */
export interface AlertListEvent {
  id: string
  issueType: string
  issueLabel: string
  channel: string
  createdAt: string
  vehicle?: {
    make: string
    model: string
    colour: string
    platePartial: string
    plate?: string | undefined
  } | undefined
}

export interface AlertIssueDisplay {
  emoji: string
  label: string
  description: string
  isEmergency: boolean
}

export interface AlertTimeDisplay {
  relative: string | null
  absolute: string | null
}

export interface GroupedAlerts {
  group: AlertDateGroup
  events: AlertListEvent[]
}

export const ALERT_DATE_GROUP_LABEL_KEYS = {
  today: 'DASHBOARD_ALERTS_GROUP_TODAY',
  yesterday: 'DASHBOARD_ALERTS_GROUP_YESTERDAY',
  thisWeek: 'DASHBOARD_ALERTS_GROUP_THIS_WEEK',
  earlier: 'DASHBOARD_ALERTS_GROUP_EARLIER',
} as const satisfies Record<AlertDateGroup, string>

const GROUP_ORDER: AlertDateGroup[] = ['today', 'yesterday', 'thisWeek', 'earlier']

/** Parses an ISO timestamp; returns null for missing or invalid values. */
export function parseAlertDate(iso: string | undefined | null): Date | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

export type AlertChannelKey = 'SMS' | 'WHATSAPP' | 'CALL' | 'UNKNOWN'

/** Normalizes API channel codes for translation lookup. */
export function getAlertChannelKey(channel: string | undefined | null): AlertChannelKey {
  switch (channel?.toUpperCase()) {
    case 'SMS':
      return 'SMS'
    case 'WHATSAPP':
      return 'WHATSAPP'
    case 'CALL':
      return 'CALL'
    default:
      return 'UNKNOWN'
  }
}

export type AlertPerspective = 'received' | 'sent'

const RECEIVED_ISSUE_TRANSLATION_KEYS: Partial<
  Record<IssueType, { labelKey: string; descriptionKey: string }>
> = {
  [IssueType.BLOCKING_VEHICLE]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_BLOCKING_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_BLOCKING_DESC',
  },
  [IssueType.WRONG_PARKING]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_WRONG_PARKING_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_WRONG_PARKING_DESC',
  },
  [IssueType.LIGHTS_ON]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_LIGHTS_ON_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_LIGHTS_ON_DESC',
  },
  [IssueType.DOOR_OPEN]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_DOOR_OPEN_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_DOOR_OPEN_DESC',
  },
  [IssueType.FLAT_TYRE]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_FLAT_TYRE_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_FLAT_TYRE_DESC',
  },
  [IssueType.FLUID_LEAKING]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_FLUID_LEAKING_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_FLUID_LEAKING_DESC',
  },
  [IssueType.VEHICLE_DAMAGE]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_DAMAGE_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_DAMAGE_DESC',
  },
  [IssueType.EMERGENCY]: {
    labelKey: 'DASHBOARD_ALERT_RECEIVED_EMERGENCY_LABEL',
    descriptionKey: 'DASHBOARD_ALERT_RECEIVED_EMERGENCY_DESC',
  },
}

/** Resolves issue emoji, label, and description with safe fallbacks. */
export function getAlertIssueDisplay(
  issueType: string | undefined | null,
  issueLabel: string | undefined | null,
  options?: {
    perspective?: AlertPerspective
    translate?: (key: string) => string
  }
): AlertIssueDisplay {
  const normalizedType = issueType?.toUpperCase() ?? ''
  const meta = ISSUE_META[normalizedType as IssueType]
  const fallbackLabel = issueLabel?.trim() || 'Unknown issue'

  if (options?.perspective === 'received' && options.translate) {
    const received = RECEIVED_ISSUE_TRANSLATION_KEYS[normalizedType as IssueType]
    if (received) {
      return {
        emoji: meta?.emoji ?? '📋',
        label: options.translate(received.labelKey),
        description: options.translate(received.descriptionKey),
        isEmergency: normalizedType === IssueType.EMERGENCY,
      }
    }
  }

  if (meta) {
    return {
      emoji: meta.emoji,
      label: meta.label,
      description: meta.description,
      isEmergency: normalizedType === IssueType.EMERGENCY,
    }
  }

  return {
    emoji: '📋',
    label: fallbackLabel,
    description: '',
    isEmergency: normalizedType === IssueType.EMERGENCY,
  }
}

/** Formats relative and absolute timestamps; omits invalid values. */
export function getAlertTimeDisplay(iso: string | undefined | null): AlertTimeDisplay {
  const date = parseAlertDate(iso)
  if (!date) return { relative: null, absolute: null }

  return {
    relative: relativeTime(iso!),
    absolute: formatDate(iso!),
  }
}

/** Buckets alerts for section headers (Today, Yesterday, etc.). */
export function getAlertDateGroup(date: Date, now = new Date()): AlertDateGroup {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 7)

  if (date >= startOfToday) return 'today'
  if (date >= startOfYesterday) return 'yesterday'
  if (date >= startOfWeek) return 'thisWeek'
  return 'earlier'
}

/** Groups alerts by recency while preserving API order within each group. */
export function groupAlertsByDate(
  events: AlertListEvent[],
  now = new Date()
): GroupedAlerts[] {
  const buckets = new Map<AlertDateGroup, AlertListEvent[]>()

  for (const event of events) {
    const date = parseAlertDate(event.createdAt)
    const group = date ? getAlertDateGroup(date, now) : 'earlier'
    const existing = buckets.get(group) ?? []
    existing.push(event)
    buckets.set(group, existing)
  }

  return GROUP_ORDER.filter(group => buckets.has(group)).map(group => ({
    group,
    events: buckets.get(group)!,
  }))
}

/** Returns the most recent alert timestamp, if any. */
export function getMostRecentAlertDate(events: AlertListEvent[]): Date | null {
  let latest: Date | null = null

  for (const event of events) {
    const date = parseAlertDate(event.createdAt)
    if (!date) continue
    if (!latest || date > latest) latest = date
  }

  return latest
}
