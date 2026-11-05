import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { setPrefersReducedMotion } from './test/match-media'
import App from './App'

const themeVeil = () => screen.queryByTestId('theme-veil')

describe('App theme motion', () => {
  it('fades the next theme in through a veil that removes itself', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(themeVeil()).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    await waitForElementToBeRemoved(() => screen.queryByTestId('theme-veil'), { timeout: 3000 })
  })

  it('switches instantly with no veil when the reader prefers reduced motion', async () => {
    setPrefersReducedMotion(true)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(themeVeil()).not.toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })
})
