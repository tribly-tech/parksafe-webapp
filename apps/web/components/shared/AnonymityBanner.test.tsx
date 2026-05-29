import { renderWithIntl } from '@/__tests__/utils/renderWithIntl'
import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AnonymityBanner } from './AnonymityBanner'

describe('AnonymityBanner', () => {
  it('renders with the privacy notice text', () => {
    renderWithIntl(<AnonymityBanner />)
    expect(screen.getByText(/Anonymous & Secure/)).toBeInTheDocument()
    expect(screen.getByText(/Your info stays private/)).toBeInTheDocument()
  })

  it('has status role for accessibility', () => {
    renderWithIntl(<AnonymityBanner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
