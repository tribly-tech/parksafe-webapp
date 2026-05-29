/**
 * Owner report history — received on their vehicles and sent to others.
 * Reporter PII is never returned.
 */

import { supabase } from '../lib/supabase'
import { issueLabel } from '../constants/issueLabels'
import { isOtpDevMode } from '../types/env'
import type {
  AlertVehicle,
  ContactEventSummary,
  MaskedVehicleSummary,
  ReportedVehicleEvent,
} from '@parksafe/types'
import { getDevReportsReceived, getDevReportsSent } from './dev-store'
import { decryptPlate } from './vehicle.service'

async function mapOwnerVehicle(
  row: Record<string, unknown> | null | undefined
): Promise<AlertVehicle | undefined> {
  if (!row) return undefined

  const plate = await decryptPlate(row.plate_encrypted as string)

  return {
    make: row.make as string,
    model: row.model as string,
    colour: row.colour as string,
    platePartial: row.plate_partial as string,
    ...(plate ? { plate } : {}),
  }
}

function resolveVehicleRow(event: Record<string, unknown>): Record<string, unknown> | null {
  const direct = event.vehicles as Record<string, unknown> | null | undefined
  if (direct) return direct

  const tag = event.tags as { vehicles?: Record<string, unknown> | null } | null | undefined
  return tag?.vehicles ?? null
}

/** Maps a contact_events row (with vehicle join) to a received-alert summary. */
export async function mapReceivedContactEvent(
  e: Record<string, unknown>
): Promise<ContactEventSummary> {
  const vehicle = await mapOwnerVehicle(resolveVehicleRow(e))

  return {
    id: e.id as string,
    issueType: e.issue_type as string,
    issueLabel: issueLabel(e.issue_type as string),
    channel: e.channel as string,
    createdAt: e.created_at as string,
    ...(vehicle ? { vehicle } : {}),
  }
}

const RECEIVED_EVENT_SELECT = `
  id,
  issue_type,
  channel,
  created_at,
  vehicles (
    make,
    model,
    colour,
    plate_partial,
    plate_encrypted
  ),
  tags (
    vehicles (
      make,
      model,
      colour,
      plate_partial,
      plate_encrypted
    )
  )
`

export async function getReportsReceived(userId: string): Promise<ContactEventSummary[]> {
  if (isOtpDevMode) {
    return getDevReportsReceived(userId)
  }

  const { data: tags } = await supabase.from('tags').select('id').eq('owner_id', userId)
  const tagIds = (tags ?? []).map(t => t.id as string)
  if (tagIds.length === 0) return []

  const { data: events, error } = await supabase
    .from('contact_events')
    .select(RECEIVED_EVENT_SELECT)
    .in('tag_id', tagIds)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !events) return []

  return Promise.all(events.map(e => mapReceivedContactEvent(e as Record<string, unknown>)))
}

export async function getReportsSent(userId: string): Promise<ReportedVehicleEvent[]> {
  if (isOtpDevMode) {
    return getDevReportsSent(userId)
  }

  const { data: events, error } = await supabase
    .from('contact_events')
    .select(
      `
      id,
      issue_type,
      channel,
      created_at,
      tags (
        vehicles (
          make,
          model,
          colour,
          plate_partial
        )
      )
    `
    )
    .eq('reporter_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !events) return []

  return events
    .map(e => {
      const tag = e.tags as { vehicles?: Record<string, unknown> | null } | null
      const vehicle = tag?.vehicles as Record<string, string> | null | undefined
      if (!vehicle) return null

      const summary: MaskedVehicleSummary = {
        make: vehicle.make as string,
        model: vehicle.model as string,
        colour: vehicle.colour as string,
        platePartial: vehicle.plate_partial as string,
      }

      return {
        id: e.id as string,
        issueType: e.issue_type as string,
        issueLabel: issueLabel(e.issue_type as string),
        channel: e.channel as string,
        createdAt: e.created_at as string,
        vehicle: summary,
      }
    })
    .filter((e): e is ReportedVehicleEvent => e !== null)
}
