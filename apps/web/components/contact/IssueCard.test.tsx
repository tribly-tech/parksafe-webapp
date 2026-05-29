import { renderWithIntl } from '@/__tests__/utils/renderWithIntl'
import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { IssueType } from '@parksafe/types'
import { IssueCard } from './IssueCard'

describe('IssueCard', () => {
  it('calls onSelect with issue type when clicked', () => {
    const onSelect = vi.fn()

    renderWithIntl(
      <IssueCard
        issueType={IssueType.BLOCKING_VEHICLE}
        emoji="🚗"
        label="Blocking my vehicle"
        description="Vehicle is blocking my spot"
        isSelected={false}
        isEmergency={false}
        onSelect={onSelect}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(IssueType.BLOCKING_VEHICLE)
  })

  it('reflects selected state via aria-pressed', () => {
    renderWithIntl(
      <IssueCard
        issueType={IssueType.EMERGENCY}
        emoji="⚠️"
        label="Emergency"
        description="Urgent attention needed"
        isSelected
        isEmergency
        onSelect={() => undefined}
      />
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
})
