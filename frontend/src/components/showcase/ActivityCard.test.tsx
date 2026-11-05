import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ActivityCard } from './ActivityCard'

describe('ActivityCard', () => {
  it('starts on the week range with seven bars', () => {
    render(<ActivityCard />)

    expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(7)
    expect(screen.getByRole('listitem', { name: 'Mon 40' })).toBeInTheDocument()
    expect(screen.getByRole('listitem', { name: 'Sun 96' })).toBeInTheDocument()
  })

  it('switches to the month range', async () => {
    const user = userEvent.setup()
    render(<ActivityCard />)

    await user.click(screen.getByRole('button', { name: 'Month' }))

    expect(screen.getByRole('button', { name: 'Month' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByRole('listitem', { name: 'Week 1 58' })).toBeInTheDocument()
  })

  it('switches to the year range', async () => {
    const user = userEvent.setup()
    render(<ActivityCard />)

    await user.click(screen.getByRole('button', { name: 'Year' }))

    expect(screen.getAllByRole('listitem')).toHaveLength(12)
    expect(screen.getByRole('listitem', { name: 'Jan 52' })).toBeInTheDocument()
    expect(screen.getByRole('listitem', { name: 'Dec 92' })).toBeInTheDocument()
  })
})
