import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Playground } from './Playground'

describe('Playground', () => {
  it('heads the section with the notice and anchors it for the hero CTA', () => {
    render(<Playground onToggleTheme={vi.fn()} />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'All components are worky, feel free to test them',
      }),
    ).toBeInTheDocument()
    expect(document.getElementById('components')).not.toBeNull()
  })

  it('shows every demo card', () => {
    render(<Playground onToggleTheme={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'October 2026' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Toast' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Weekly activity' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Command palette' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Buttons and badges' })).toBeInTheDocument()
  })

  it('keeps the interactive demos wired', () => {
    render(<Playground onToggleTheme={vi.fn()} />)

    expect(screen.getAllByRole('switch')).toHaveLength(2)
    expect(screen.getByRole('progressbar', { name: 'Storage' })).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})
