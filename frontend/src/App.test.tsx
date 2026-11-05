import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

const headingLevels = () =>
  screen.getAllByRole('heading').map((heading) => Number(heading.tagName.slice(1)))

describe('App shell', () => {
  it('offers a skip link to the main landmark', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })

  it('renders exactly one banner, main and contentinfo landmark', () => {
    render(<App />)

    expect(screen.getAllByRole('banner')).toHaveLength(1)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
  })

  it('switches the document theme through the toggle and back', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement).not.toHaveAttribute('data-theme')

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement).not.toHaveAttribute('data-theme')
  })

  it('renders one h1 and never skips a heading level', () => {
    render(<App />)

    const levels = headingLevels()
    expect(levels.filter((level) => level === 1)).toHaveLength(1)

    levels.forEach((level, index) => {
      if (index > 0) expect(level - levels[index - 1]).toBeLessThanOrEqual(1)
    })
  })

  it('gives every interactive control an accessible name', () => {
    render(<App />)

    const controls = [
      ...document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea'),
    ]
    expect(controls.length).toBeGreaterThan(0)

    for (const control of controls) {
      const name = (
        control.textContent ||
        control.getAttribute('aria-label') ||
        control.getAttribute('title') ||
        ''
      ).trim()
      expect(name, `unnamed control: ${control.outerHTML.slice(0, 60)}`).not.toBe('')
    }
  })

  it('opens search from the shell and keeps the page behind it intact', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /^Search docs…/ }))

    const dialog = screen.getByRole('dialog', { name: 'Search this page' })
    expect(within(dialog).getAllByRole('link')).toHaveLength(6)
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
  })

  it('keeps the token specimen content on the page', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Components for the interfaces you build next.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Quiet surfaces. One accent.')).toBeInTheDocument()
    expect(screen.getByText('Readable APIs. Predictable results.')).toBeInTheDocument()
  })
})
