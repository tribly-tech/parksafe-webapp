import { describe, it, expect } from 'vitest'
import { IssueType } from '@parksafe/types'
import { buildContactPaths, devContactPaths } from './paths'

describe('buildContactPaths', () => {
  it('builds distinct URLs for step 1 and step 2', () => {
    const paths = buildContactPaths('/contact/test-tag-uuid-001')

    expect(paths.issue()).toBe('/contact/test-tag-uuid-001')
    expect(paths.channel(IssueType.BLOCKING_VEHICLE)).toBe(
      '/contact/test-tag-uuid-001/channel?issue=BLOCKING_VEHICLE'
    )
    expect(paths.success()).toBe('/contact/test-tag-uuid-001/success')
  })

  it('dev paths use /contact base without tagId segment', () => {
    expect(devContactPaths.issue()).toBe('/contact')
    expect(devContactPaths.channel(IssueType.EMERGENCY)).toBe(
      '/contact/channel?issue=EMERGENCY'
    )
    expect(devContactPaths.success()).toBe('/contact/success')
  })
})
