import { renderWithIntl } from '@/__tests__/utils/renderWithIntl'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { OtpInput } from './OtpInput'

describe('OtpInput', () => {
  it('renders 6 digit inputs by default', () => {
    renderWithIntl(<OtpInput onComplete={vi.fn()} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('calls onComplete when all 6 digits are entered', async () => {
    const onComplete = vi.fn()
    renderWithIntl(<OtpInput onComplete={onComplete} />)
    const inputs = screen.getAllByRole('textbox')

    for (let i = 0; i < 6; i++) {
      await userEvent.type(inputs[i]!, String(i + 1))
    }

    expect(onComplete).toHaveBeenCalledWith('123456')
  })

  it('handles paste of 6 digits and calls onComplete', () => {
    const onComplete = vi.fn()
    renderWithIntl(<OtpInput onComplete={onComplete} />)
    const firstInput = screen.getAllByRole('textbox')[0]!

    fireEvent.paste(firstInput, {
      clipboardData: { getData: () => '654321' },
    })

    expect(onComplete).toHaveBeenCalledWith('654321')
  })
})
