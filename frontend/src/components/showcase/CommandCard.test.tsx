import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommandCard } from './CommandCard'

const renderCard =
  (onToggleTheme = vi.fn()) =>
  () =>
    render(<CommandCard onToggleTheme={onToggleTheme} />)

describe('CommandCard', () => {
  it('lists the suggestions', () => {
    renderCard()()

    const field = screen.getByRole('combobox', { name: 'Command palette' })
    expect(field).toHaveAttribute('aria-expanded', 'true')
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(5)
    expect(screen.getByRole('option', { name: /New project/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Settings/ })).toBeInTheDocument()
  })

  it('filters the suggestions as the reader types', async () => {
    const user = userEvent.setup()
    renderCard()()

    await user.type(screen.getByRole('combobox', { name: 'Command palette' }), 'theme')

    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: /Toggle theme/ })).toBeInTheDocument()
  })

  it('says when nothing matches', async () => {
    const user = userEvent.setup()
    renderCard()()

    await user.type(screen.getByRole('combobox', { name: 'Command palette' }), 'zzz')

    expect(screen.getByText(/no commands match/i)).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('runs the highlighted command with Enter', async () => {
    const onToggleTheme = vi.fn()
    const user = userEvent.setup()
    renderCard(onToggleTheme)()

    await user.type(screen.getByRole('combobox', { name: 'Command palette' }), 'theme')
    await user.keyboard('{Enter}')

    expect(onToggleTheme).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Toggle theme')
  })

  it('moves the highlight with the arrow keys', async () => {
    const user = userEvent.setup()
    renderCard()()

    await user.click(screen.getByRole('combobox', { name: 'Command palette' }))
    await user.keyboard('{ArrowDown}')

    expect(screen.getByRole('option', { name: /Invite teammate/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('toggles the theme from the keyboard shortcut', () => {
    const onToggleTheme = vi.fn()
    renderCard(onToggleTheme)()

    fireEvent.keyDown(document, { key: 't', metaKey: true })

    expect(onToggleTheme).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Toggle theme')
  })
})
