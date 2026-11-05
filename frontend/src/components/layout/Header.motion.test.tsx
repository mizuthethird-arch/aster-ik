import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MotionProvider } from '../../motion/MotionProvider'
import { setPrefersReducedMotion } from '../../test/match-media'
import { Header } from './Header'

function renderHeader(onToggleTheme: () => void = vi.fn()) {
  render(
    <MotionProvider>
      <Header theme="dark" onToggleTheme={onToggleTheme} />
    </MotionProvider>,
  )
}

const mobileMenu = () => screen.queryByRole('navigation', { name: 'Mobile' })

describe('Header menu motion', () => {
  it('keeps the panel mounted while it animates out, then unmounts it', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(mobileMenu()).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close menu' }))

    // The exit animation owns the unmount: the panel is still in the document
    // synchronously after the click.
    expect(mobileMenu()).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('navigation', { name: 'Mobile' }), {
      timeout: 3000,
    })
  })

  it('opens and closes instantly when the reader prefers reduced motion', async () => {
    setPrefersReducedMotion(true)
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(mobileMenu()).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(mobileMenu()).not.toBeInTheDocument()
  })

  it('morphs the menu button in place instead of swapping icons', async () => {
    const user = userEvent.setup()
    renderHeader()

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    const linesBefore = [...toggle.querySelectorAll('line')]
    expect(linesBefore).toHaveLength(2)
    const closedTransforms = linesBefore.map((line) => line.style.transform)

    await user.click(toggle)

    const opened = screen.getByRole('button', { name: 'Close menu' })
    const linesAfter = [...opened.querySelectorAll('line')]
    expect(linesAfter).toHaveLength(2)
    expect(linesAfter[0]).toBe(linesBefore[0])
    expect(linesAfter[1]).toBe(linesBefore[1])

    await waitFor(() => {
      expect(linesAfter[0].style.transform).not.toBe(closedTransforms[0])
    })
  })

  it('hands the reveal origin at the toggle centre to the caller', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()
    renderHeader(onToggleTheme)
    const toggle = screen.getByRole('button', { name: 'Switch to light theme' })
    vi.spyOn(toggle, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 40,
      width: 36,
      height: 36,
      top: 40,
      left: 100,
      right: 136,
      bottom: 76,
      toJSON: () => ({}),
    } as DOMRect)

    await user.click(toggle)

    expect(onToggleTheme).toHaveBeenCalledWith({ x: 118, y: 58 })
  })
})
