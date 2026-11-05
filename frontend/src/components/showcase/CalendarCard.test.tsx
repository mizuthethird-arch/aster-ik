import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CalendarCard } from './CalendarCard'

describe('CalendarCard', () => {
  it('shows October 2026 with the 18th selected', () => {
    render(<CalendarCard />)

    expect(screen.getByRole('heading', { name: 'October 2026' })).toBeInTheDocument()
    expect(screen.getByText('Selected: Oct 18')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '18' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '31' })).toBeInTheDocument()
  })

  it('selects another day', async () => {
    const user = userEvent.setup()
    render(<CalendarCard />)

    await user.click(screen.getByRole('button', { name: '5' }))

    expect(screen.getByText('Selected: Oct 5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '18' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('moves to the next month', async () => {
    const user = userEvent.setup()
    render(<CalendarCard />)

    await user.click(screen.getByRole('button', { name: 'Next month' }))

    expect(screen.getByRole('heading', { name: 'November 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '30' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '31' })).not.toBeInTheDocument()
    expect(screen.getByText('Selected: Nov 1')).toBeInTheDocument()
  })

  it('moves to the previous month', async () => {
    const user = userEvent.setup()
    render(<CalendarCard />)

    await user.click(screen.getByRole('button', { name: 'Previous month' }))

    expect(screen.getByRole('heading', { name: 'September 2026' })).toBeInTheDocument()
    expect(screen.getByText('Selected: Sep 1')).toBeInTheDocument()
  })
})
