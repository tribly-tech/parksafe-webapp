import { describe, expect, it } from 'vitest'
import type { ContactEventSummary } from '@parksafe/types'
import {
  getAlertChannelKey,
  getAlertDateGroup,
  getAlertIssueDisplay,
  getMostRecentAlertDate,
  groupAlertsByDate,
  parseAlertDate,
} from '@/lib/utils/alertDisplay'

const NOW = new Date('2026-05-28T12:00:00.000Z')

function makeEvent(
  overrides: Partial<ContactEventSummary> & Pick<ContactEventSummary, 'id'>
): ContactEventSummary {
  return {
    issueType: 'WRONG_PARKING',
    issueLabel: 'Wrong parking',
    channel: 'WHATSAPP',
    createdAt: '2026-05-28T10:00:00.000Z',
    vehicle: {
      make: 'Maruti Suzuki',
      model: 'Swift',
      colour: 'Pearl White',
      plate: 'MH12AB1234',
      platePartial: 'MH**1234',
    },
    ...overrides,
  }
}

describe('alertDisplay', () => {
  it('parses valid and invalid dates', () => {
    expect(parseAlertDate('2026-05-28T10:00:00.000Z')).toBeInstanceOf(Date)
    expect(parseAlertDate('not-a-date')).toBeNull()
    expect(parseAlertDate(null)).toBeNull()
  })

  it('normalizes channel keys with fallback', () => {
    expect(getAlertChannelKey('whatsapp')).toBe('WHATSAPP')
    expect(getAlertChannelKey('SMS')).toBe('SMS')
    expect(getAlertChannelKey('')).toBe('UNKNOWN')
    expect(getAlertChannelKey(undefined)).toBe('UNKNOWN')
  })

  it('resolves known and unknown issue types', () => {
    const known = getAlertIssueDisplay('LIGHTS_ON', 'Lights on')
    expect(known.emoji).toBe('💡')
    expect(known.label).toBeTruthy()

    const unknown = getAlertIssueDisplay('CUSTOM_ISSUE', 'Custom alert')
    expect(unknown.emoji).toBe('📋')
    expect(unknown.label).toBe('Custom alert')
    expect(unknown.isEmergency).toBe(false)
  })

  it('uses owner-facing copy for received blocking alerts', () => {
    const received = getAlertIssueDisplay('BLOCKING_VEHICLE', 'Blocking vehicle', {
      perspective: 'received',
      translate: key =>
        ({
          DASHBOARD_ALERT_RECEIVED_BLOCKING_LABEL: 'Blocking another driver',
          DASHBOARD_ALERT_RECEIVED_BLOCKING_DESC:
            "Your vehicle is occupying someone else's parking spot",
        })[key] ?? key,
    })

    expect(received.label).toBe('Blocking another driver')
    expect(received.description).toBe("Your vehicle is occupying someone else's parking spot")
  })

  it('keeps reporter-facing copy for sent alerts', () => {
    const sent = getAlertIssueDisplay('BLOCKING_VEHICLE', 'Blocking vehicle')
    expect(sent.label).toBe('Blocking my vehicle')
    expect(sent.description).toBe('Vehicle is blocking my spot')
  })

  it('flags emergency issues', () => {
    const emergency = getAlertIssueDisplay('EMERGENCY', 'Emergency')
    expect(emergency.isEmergency).toBe(true)
  })

  it('groups alerts by date buckets', () => {
    const today = new Date(NOW)
    today.setHours(10, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 5)

    const older = new Date(today)
    older.setDate(older.getDate() - 20)

    expect(getAlertDateGroup(today, NOW)).toBe('today')
    expect(getAlertDateGroup(yesterday, NOW)).toBe('yesterday')
    expect(getAlertDateGroup(lastWeek, NOW)).toBe('thisWeek')
    expect(getAlertDateGroup(older, NOW)).toBe('earlier')
  })

  it('groups events and skips empty sections', () => {
    const events = [
      makeEvent({ id: '1', createdAt: '2026-05-28T10:00:00.000Z' }),
      makeEvent({ id: '2', createdAt: '2026-05-27T10:00:00.000Z' }),
      makeEvent({ id: '3', createdAt: 'invalid-date' }),
    ]

    const groups = groupAlertsByDate(events, NOW)
    expect(groups.map(g => g.group)).toEqual(['today', 'yesterday', 'earlier'])
    expect(groups[0]?.events).toHaveLength(1)
    expect(groups[2]?.events).toHaveLength(1)
  })

  it('finds the most recent valid alert date', () => {
    const events = [
      makeEvent({ id: '1', createdAt: '2026-05-20T10:00:00.000Z' }),
      makeEvent({ id: '2', createdAt: '2026-05-28T09:00:00.000Z' }),
      makeEvent({ id: '3', createdAt: 'invalid-date' }),
    ]

    const latest = getMostRecentAlertDate(events)
    expect(latest?.toISOString()).toBe('2026-05-28T09:00:00.000Z')
  })
})
