import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MotionProvider } from '../../motion/MotionProvider'
import { Header } from './Header'

function renderHeader(theme: 'dark' | 'light' = 'dark') {
  const onToggleTheme = vi.fn()
  render(
    <MotionProvider>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
    </MotionProvider>,
  )
  return { onToggleTheme }
}

const mobileMenu = () => screen.queryByRole('navigation', { name: 'Mobile' })

describe('Header', () => {
  it('links the wordmark home', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'aster-ik' })).toHaveAttribute('href', '/')
  })

  it('renders the four primary destinations', () => {
    renderHeader()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.textContent)).toEqual(['Docs', 'Components', 'Theming', 'FAQ'])
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#docs',
      '#components',
      '#theming',
      '#faq',
    ])
  })

  it('toggles the theme from the dark theme', async () => {
    const user = userEvent.setup()
    const { onToggleTheme } = renderHeader('dark')

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(onToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('offers the dark theme while the light theme is active', () => {
    renderHeader('light')

    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Switch to light theme' })).not.toBeInTheDocument()
  })

  it('keeps search reachable at every breakpoint', () => {
    renderHeader()

    const full = screen.getByRole('button', { name: /^Search docs…/ })
    expect(full).toHaveClass('hidden', 'lg:grid')

    const compact = screen.getByRole('button', { name: 'Search docs' })
    expect(compact).toHaveClass('hidden', 'md:grid', 'lg:hidden')
  })

  it('opens the search palette from the full trigger', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: /^Search docs…/ }))

    expect(screen.getByRole('dialog', { name: 'Search this page' })).toBeInTheDocument()
  })

  it('opens the search palette with Cmd-K or Ctrl-K', () => {
    renderHeader()

    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.getByRole('dialog', { name: 'Search this page' })).toBeInTheDocument()
  })

  it('opens the search palette with Ctrl-K', () => {
    renderHeader()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog', { name: 'Search this page' })).toBeInTheDocument()
  })

  it('starts with the mobile menu closed and the disclosure labelled', () => {
    renderHeader()

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav')
    expect(mobileMenu()).not.toBeInTheDocument()
  })

  it('opens the mobile menu with the destinations and search', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    const menu = mobileMenu()
    expect(menu).toBeInTheDocument()
    expect(within(menu!).getAllByRole('link')).toHaveLength(4)
    expect(within(menu!).getByRole('button', { name: 'Search docs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes the mobile menu on Escape', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    await user.keyboard('{Escape}')

    await waitForElementToBeRemoved(() => screen.queryByRole('navigation', { name: 'Mobile' }), {
      timeout: 3000,
    })
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('closes the mobile menu when a destination is chosen', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    await user.click(within(mobileMenu()!).getByRole('link', { name: 'Docs' }))

    await waitForElementToBeRemoved(() => screen.queryByRole('navigation', { name: 'Mobile' }), {
      timeout: 3000,
    })
  })

  it('moves from the mobile menu into search', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    await user.click(within(mobileMenu()!).getByRole('button', { name: 'Search docs' }))

    await waitForElementToBeRemoved(() => screen.queryByRole('navigation', { name: 'Mobile' }), {
      timeout: 3000,
    })
    expect(screen.getByRole('dialog', { name: 'Search this page' })).toBeInTheDocument()
  })
})
