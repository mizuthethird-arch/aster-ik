import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AccountCard } from './AccountCard'

describe('AccountCard', () => {
  it('starts on the password form', () => {
    render(<AccountCard />)

    expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('switches to the magic link form', async () => {
    const user = userEvent.setup()
    render(<AccountCard />)

    await user.click(screen.getByRole('button', { name: 'Magic link' }))

    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send magic link' })).toBeInTheDocument()
  })

  it('reports an invalid email', async () => {
    const user = userEvent.setup()
    render(<AccountCard />)

    await user.type(screen.getByLabelText('Email'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('requires a password of at least eight characters', async () => {
    const user = userEvent.setup()
    render(<AccountCard />)

    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
  })

  it('confirms account creation', async () => {
    const user = userEvent.setup()
    render(<AccountCard />)

    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.type(screen.getByLabelText('Password'), 'supersecret')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByRole('status')).toHaveTextContent('Account created for mira@example.com')
  })

  it('confirms the magic link without a password', async () => {
    const user = userEvent.setup()
    render(<AccountCard />)

    await user.click(screen.getByRole('button', { name: 'Magic link' }))
    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.click(screen.getByRole('button', { name: 'Send magic link' }))

    expect(screen.getByRole('status')).toHaveTextContent('Magic link sent to mira@example.com')
  })
})
