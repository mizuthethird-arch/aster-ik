import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ControlsCard } from './ControlsCard'

describe('ControlsCard', () => {
  it('renders every button variant', () => {
    render(<ControlsCard />)

    for (const name of ['Default', 'Secondary', 'Outline', 'Ghost', 'Destructive']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: 'Add action' })).toBeInTheDocument()
  })

  it('reports the last button that was pressed', async () => {
    const user = userEvent.setup()
    render(<ControlsCard />)

    await user.click(screen.getByRole('button', { name: 'Destructive' }))

    expect(screen.getByRole('status')).toHaveTextContent('Destructive')
  })

  it('counts the add-action presses', async () => {
    const user = userEvent.setup()
    render(<ControlsCard />)

    await user.click(screen.getByRole('button', { name: 'Add action' }))
    await user.click(screen.getByRole('button', { name: 'Add action' }))

    expect(screen.getByRole('status')).toHaveTextContent('2 actions')
  })

  it('shows the badge tones', () => {
    render(<ControlsCard />)

    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.getAllByText('Default').length).toBeGreaterThanOrEqual(1)
  })

  it('shows storage as a progress bar at 64 percent', () => {
    render(<ControlsCard />)

    expect(screen.getByRole('progressbar', { name: 'Storage' })).toHaveAttribute(
      'aria-valuenow',
      '64',
    )
  })

  it('groups the avatars', () => {
    render(<ControlsCard />)

    expect(screen.getByRole('group', { name: 'Avatar group' })).toBeInTheDocument()
    expect(screen.getByText('AB')).toBeInTheDocument()
    expect(screen.getByText('CD')).toBeInTheDocument()
    expect(screen.getByText('EF')).toBeInTheDocument()
  })
})
