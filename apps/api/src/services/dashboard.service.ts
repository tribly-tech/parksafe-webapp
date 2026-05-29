/**
 * Dashboard aggregation — driving score, report counts, rewards, contact history.
 * All queries are scoped to the authenticated owner; no reporter PII is returned.
 */

import { supabase } from '../lib/supabase'
import { isOtpDevMode } from '../types/env'
import type { ContactEventSummary, DashboardSummary, Reward } from '@parksafe/types'
import {
  getDevProfile,
  getDevReportedCount,
  getDevReportsReceived,
  getDevVehicles,
} from './dev-store'
import { mapReceivedContactEvent } from './reports.service'

const MS_PER_DAY = 86_400_000

function daysBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime()
  return Math.max(0, Math.floor(diff / MS_PER_DAY))
}

/**
 * Computes consecutive safe days (no contact events on owner's vehicles).
 */
function computeSafeDays(
  accountCreatedAt: Date,
  lastContactAt: Date | null
): number {
  const now = new Date()
  if (!lastContactAt) {
    return Math.min(999, daysBetween(accountCreatedAt, now))
  }
  return Math.min(999, daysBetween(lastContactAt, now))
}

function buildRewards(
  safeDays: number,
  reportsReceived: number,
  vehiclesReported: number
): Reward[] {
  return [
    {
      id: 'streak-30',
      title: 'Monthly champion',
      description: '30 safe driving days in a row',
      unlocked: safeDays >= 30,
      progress: Math.min(100, Math.round((safeDays / 30) * 100)),
    },
    {
      id: 'zero-reports',
      title: 'Clean record',
      description: 'No alerts received on your vehicles',
      unlocked: reportsReceived === 0,
      progress: reportsReceived === 0 ? 100 : Math.max(0, 100 - reportsReceived * 10),
    },
    {
      id: 'community-helper',
      title: 'Community helper',
      description: 'Sent alerts for 5+ vehicles',
      unlocked: vehiclesReported >= 5,
      progress: Math.min(100, Math.round((vehiclesReported / 5) * 100)),
    },
    {
      id: 'parking-guardian',
      title: 'Parking guardian',
      description: '90+ days of safe driving',
      unlocked: safeDays >= 90,
      progress: Math.min(100, Math.round((safeDays / 90) * 100)),
    },
  ]
}

/**
 * Fetches the full dashboard summary for an authenticated owner.
 */
export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const fallbackName = 'Driver'

  if (isOtpDevMode) {
    const profile = getDevProfile(userId)
    const devVehicles = getDevVehicles(userId).filter(v => v.isActive)
    const safeDays = profile
      ? Math.min(999, daysBetween(profile.createdAt, new Date()))
      : 0
    const vehiclesReported = getDevReportedCount(userId)
    const reportsReceived = getDevReportsReceived(userId).length
    return {
      displayName: profile?.displayName ?? fallbackName,
      activeVehicles: devVehicles.length,
      safeDays,
      reportsReceived,
      vehiclesReported,
      rewards: buildRewards(safeDays, reportsReceived, vehiclesReported),
      recentContacts: [],
    }
  }

  const [userResult, vehiclesResult, tagsResult] = await Promise.all([
    supabase.from('users').select('display_name, created_at').eq('id', userId).single(),
    supabase
      .from('vehicles')
      .select('id')
      .eq('owner_id', userId)
      .eq('is_active', true),
    supabase.from('tags').select('id').eq('owner_id', userId),
  ])

  const displayName =
    (userResult.data?.display_name as string | undefined) ?? fallbackName
  const accountCreatedAt = userResult.data?.created_at
    ? new Date(userResult.data.created_at as string)
    : new Date()

  const activeVehicles = vehiclesResult.data?.length ?? 0
  const tagIds = (tagsResult.data ?? []).map(t => t.id as string)

  let reportsReceived = 0
  let vehiclesReported = 0
  let lastContactAt: Date | null = null
  let recentContacts: ContactEventSummary[] = []

  if (tagIds.length > 0) {
    const { count: receivedCount } = await supabase
      .from('contact_events')
      .select('id', { count: 'exact', head: true })
      .in('tag_id', tagIds)

    reportsReceived = receivedCount ?? 0

    const { data: lastEvent } = await supabase
      .from('contact_events')
      .select('created_at')
      .in('tag_id', tagIds)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lastEvent?.created_at) {
      lastContactAt = new Date(lastEvent.created_at as string)
    }

    const { data: receivedEvents, error: receivedError } = await supabase
      .from('contact_events')
      .select(
        `
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
      )
      .in('tag_id', tagIds)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!receivedError && receivedEvents) {
      recentContacts = await Promise.all(
        receivedEvents.map(e => mapReceivedContactEvent(e as Record<string, unknown>))
      )
    }
  }

  const { count: reportedCount } = await supabase
    .from('contact_events')
    .select('id', { count: 'exact', head: true })
    .eq('reporter_user_id', userId)

  vehiclesReported = reportedCount ?? 0

  const safeDays = computeSafeDays(accountCreatedAt, lastContactAt)
  const rewards = buildRewards(safeDays, reportsReceived, vehiclesReported)

  return {
    displayName,
    activeVehicles,
    safeDays,
    reportsReceived,
    vehiclesReported,
    rewards,
    recentContacts,
  }
}
