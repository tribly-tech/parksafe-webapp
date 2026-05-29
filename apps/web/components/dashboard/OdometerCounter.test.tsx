import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OdometerCounter } from './OdometerCounter'

describe('OdometerCounter', () => {
  it('renders padded value for accessibility', () => {
    render(<OdometerCounter value={42} animate={false} />)
    expect(screen.getByRole('img', { name: '42' })).toBeInTheDocument()
  })

  it('clamps values above max digits', () => {
    render(<OdometerCounter value={9999} maxDigits={3} animate={false} />)
    expect(screen.getByRole('img', { name: '999' })).toBeInTheDocument()
  })
})
