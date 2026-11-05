import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { NotificationsCard } from './NotificationsCard'

describe('NotificationsCard', () => {
  it('starts with push on and the weekly digest off', () => {
    render(<NotificationsCard />)

    expect(screen.getByRole('switch', { name: 'Push' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('switch', { name: 'Weekly digest' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    expect(screen.getByText('On this device')).toBeInTheDocument()
    expect(screen.getByText('By email')).toBeInTheDocument()
  })

  it('flips the push switch', async () => {
    const user = userEvent.setup()
    render(<NotificationsCard />)

    await user.click(screen.getByRole('switch', { name: 'Push' }))

    expect(screen.getByRole('switch', { name: 'Push' })).toHaveAttribute('aria-checked', 'false')
  })

  it('flips the digest switch', async () => {
    const user = userEvent.setup()
    render(<NotificationsCard />)

    await user.click(screen.getByRole('switch', { name: 'Weekly digest' }))

    expect(screen.getByRole('switch', { name: 'Weekly digest' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })
})
