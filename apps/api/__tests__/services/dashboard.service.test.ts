import { describe, expect, it } from 'vitest'
import { getDashboardSummary } from '../../src/services/dashboard.service'
import { addDevVehicle, setDevProfile, incrementDevReports } from '../../src/services/dev-store'
import { createDevVehicle } from '../../src/services/dev-registration'

describe('dashboard.service', () => {
  it('returns dashboard summary in dev mode', async () => {
    const userId = '00000000-0000-0000-0000-000000000100'
    setDevProfile(userId, 'Aditya')
    addDevVehicle(
      userId,
      { make: 'Honda', model: 'City', colour: 'White', plate: 'MH02AB1234' },
      createDevVehicle(userId, {
        make: 'Honda',
        model: 'City',
        colour: 'White',
        plate: 'MH02AB1234',
      })
    )

    const summary = await getDashboardSummary(userId)

    expect(summary.displayName).toBe('Aditya')
    expect(summary.activeVehicles).toBe(1)
    expect(summary.safeDays).toBeGreaterThanOrEqual(0)
    expect(summary.reportsReceived).toBe(0)
    expect(summary.rewards).toHaveLength(4)
    expect(summary.rewards.some(r => r.id === 'streak-7')).toBe(false)
    expect(summary.rewards.some(r => r.id === 'zero-reports' && r.unlocked)).toBe(true)
  })

  it('counts vehicles reported for authenticated reporters', async () => {
    const userId = '00000000-0000-0000-0000-000000000101'
    setDevProfile(userId, 'Reporter')
    incrementDevReports(userId)
    incrementDevReports(userId)

    const summary = await getDashboardSummary(userId)

    expect(summary.vehiclesReported).toBe(2)
    expect(summary.rewards.find(r => r.id === 'community-helper')?.progress).toBe(40)
  })
})
