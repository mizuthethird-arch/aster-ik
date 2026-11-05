import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { setPrefersReducedMotion } from '../../test/match-media'
import { MotionProvider } from '../../motion/MotionProvider'
import { Header } from './Header'

function renderHeader() {
  render(
    <MotionProvider>
      <Header theme="dark" onToggleTheme={vi.fn()} />
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
})
