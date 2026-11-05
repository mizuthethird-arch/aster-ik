import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToastCard } from './ToastCard'

afterEach(() => {
  vi.useRealTimers()
})

describe('ToastCard', () => {
  it('starts with the saved toast and re-shows it on demand', async () => {
    const user = userEvent.setup()
    render(<ToastCard />)

    expect(screen.getByRole('status')).toHaveTextContent('Changes saved')
    expect(screen.getByRole('status')).toHaveTextContent('Your workspace was updated.')
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show toast' }))

    expect(screen.getByRole('status')).toHaveTextContent('Changes saved')
  })

  it('undoes the change from the toast', async () => {
    const user = userEvent.setup()
    render(<ToastCard />)

    await user.click(screen.getByRole('button', { name: 'Show toast' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))

    expect(screen.getByRole('status')).toHaveTextContent('Changes undone')
  })

  it('dismisses itself after a few seconds', () => {
    vi.useFakeTimers()
    render(<ToastCard />)

    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(5000))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
