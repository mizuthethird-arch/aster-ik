import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hero } from './Hero'

const { copyText } = vi.hoisted(() => ({ copyText: vi.fn().mockResolvedValue(true) }))

vi.mock('../../lib/clipboard', () => ({ copyText }))

beforeEach(() => {
  copyText.mockClear()
  copyText.mockResolvedValue(true)
})

const panel = () => screen.getByRole('tabpanel')

describe('Hero', () => {
  it('leads with the display headline and the muted second clause', () => {
    render(<Hero />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Components for the interfaces you build next.')
    expect(within(heading).getByText('you build next.')).toHaveClass('text-muted')
  })

  it('shows the announcement pill as a link to the docs', () => {
    render(<Hero />)

    expect(screen.getByRole('link', { name: /early preview of aster-ik/i })).toHaveAttribute(
      'href',
      '#docs',
    )
  })

  it('renders the lead copy', () => {
    render(<Hero />)

    expect(screen.getByText(/Accessible, composable React components/)).toBeInTheDocument()
  })

  it('links the two calls to action to docs and components', () => {
    render(<Hero />)

    expect(screen.getByRole('link', { name: /get started/i })).toHaveAttribute('href', '#docs')
    expect(screen.getByRole('link', { name: /browse components/i })).toHaveAttribute(
      'href',
      '#components',
    )
  })

  it('offers one install command per package manager', () => {
    render(<Hero />)

    const tablist = screen.getByRole('tablist', { name: 'Package manager' })
    const tabs = within(tablist).getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['npm', 'pnpm', 'yarn', 'bun'])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(panel()).toHaveTextContent('npm install aster-ik')
  })

  it('switches the command when another tab is chosen', async () => {
    const user = userEvent.setup()
    render(<Hero />)

    await user.click(screen.getByRole('tab', { name: 'pnpm' }))

    expect(screen.getByRole('tab', { name: 'pnpm' })).toHaveAttribute('aria-selected', 'true')
    expect(panel()).toHaveTextContent('pnpm add aster-ik')
  })

  it('moves between tabs with the arrow, Home and End keys', () => {
    render(<Hero />)

    const tablist = screen.getByRole('tablist', { name: 'Package manager' })
    fireEvent.keyDown(tablist, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'pnpm' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'pnpm' })).toHaveFocus()

    fireEvent.keyDown(tablist, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'bun' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(tablist, { key: 'Home' })
    expect(screen.getByRole('tab', { name: 'npm' })).toHaveAttribute('aria-selected', 'true')
  })

  it('copies the current command and confirms it', async () => {
    const user = userEvent.setup()
    render(<Hero />)

    await user.click(screen.getByRole('button', { name: /^copy$/i }))

    expect(copyText).toHaveBeenCalledWith('npm install aster-ik')
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })

  it('copies the command of the selected tab', async () => {
    const user = userEvent.setup()
    render(<Hero />)

    await user.click(screen.getByRole('tab', { name: 'yarn' }))
    await user.click(screen.getByRole('button', { name: /^copy$/i }))

    expect(copyText).toHaveBeenCalledWith('yarn add aster-ik')
  })

  it('keeps the copy label when the clipboard is refused', async () => {
    copyText.mockResolvedValueOnce(false)
    const user = userEvent.setup()
    render(<Hero />)

    await user.click(screen.getByRole('button', { name: /^copy$/i }))

    expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
  })

  it('lists the stack facts under the install box', () => {
    render(<Hero />)

    expect(
      screen.getByText('React · TypeScript · CSS variables · Light and dark'),
    ).toBeInTheDocument()
  })
})
