import { describe, expect, it } from 'vitest'
import {
  getGreetingTone,
  getMildAlertKey,
} from '@/components/dashboard/DashboardGreeting'

describe('DashboardGreeting', () => {
  it('maps alert count to greeting tone', () => {
    expect(getGreetingTone(0)).toBe('rewarding')
    expect(getGreetingTone(1)).toBe('mild')
    expect(getGreetingTone(3)).toBe('mild')
    expect(getGreetingTone(4)).toBe('cautious')
    expect(getGreetingTone(10)).toBe('cautious')
  })

  it('selects mild alert copy for singular vs plural', () => {
    expect(getMildAlertKey(1)).toBe('DASHBOARD_GREETING_MILD_ALERTS_ONE')
    expect(getMildAlertKey(2)).toBe('DASHBOARD_GREETING_MILD_ALERTS_MANY')
    expect(getMildAlertKey(3)).toBe('DASHBOARD_GREETING_MILD_ALERTS_MANY')
  })
})
