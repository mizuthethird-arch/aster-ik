import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setPrefersReducedMotion } from './test/match-media'
import App from './App'

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> }
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike
}

const doc = document as ViewTransitionDocument

function installViewTransition() {
  const start = vi.fn((update: () => void) => {
    update()
    return { ready: Promise.resolve(), finished: Promise.resolve() }
  })
  Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start })
  return start
}

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition')
})

describe('App theme motion', () => {
  it('reveals the next theme in a circle from the toggle', async () => {
    const startViewTransition = installViewTransition()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(startViewTransition).toHaveBeenCalledTimes(1)
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('applies the theme instantly when the browser has no view transitions', async () => {
    expect(doc.startViewTransition).toBeUndefined()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('switches instantly with no view transition when motion is reduced', async () => {
    const startViewTransition = installViewTransition()
    setPrefersReducedMotion(true)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(startViewTransition).not.toHaveBeenCalled()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })
})
