import { renderWithIntl } from '@/__tests__/utils/renderWithIntl'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { RegisterForm } from './RegisterForm'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('RegisterForm', () => {
  it('renders registration page title and vehicle section', () => {
    renderWithIntl(<RegisterForm />)

    expect(screen.getByText('Register Your Vehicle')).toBeInTheDocument()
    expect(screen.getByText('park safe')).toBeInTheDocument()
    expect(screen.getByText('Vehicle Details')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Register Vehicle/i })).toBeInTheDocument()
  })
})
