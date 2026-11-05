import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { MotionProvider } from '../../motion/MotionProvider'
import { setPrefersReducedMotion } from '../../test/match-media'
import { AccountCard } from './AccountCard'

function renderAccount() {
  render(
    <MotionProvider>
      <AccountCard />
    </MotionProvider>,
  )
}

const passwordField = () => screen.queryByLabelText('Password')
const magicNote = () => screen.queryByText(/one-time link/i)

afterEach(() => {
  setPrefersReducedMotion(false)
})

describe('AccountCard', () => {
  it('starts on the password form', () => {
    renderAccount()

    expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(passwordField()).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('switches to the magic link form', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.click(screen.getByRole('button', { name: 'Magic link' }))
    await waitForElementToBeRemoved(passwordField)

    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
    expect(magicNote()).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send magic link' })).toBeInTheDocument()
  })

  it('animates the password field out instead of replacing it in the same frame', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.click(screen.getByRole('button', { name: 'Magic link' }))

    // The exit owns the unmount: the field is still mounted right after the click.
    expect(passwordField()).toBeInTheDocument()
    await waitForElementToBeRemoved(passwordField, { timeout: 3000 })
    expect(magicNote()).toBeInTheDocument()
  })

  it('swaps the field instantly when the reader prefers reduced motion', async () => {
    setPrefersReducedMotion(true)
    const user = userEvent.setup()
    renderAccount()

    await user.click(screen.getByRole('button', { name: 'Magic link' }))

    expect(passwordField()).not.toBeInTheDocument()
    expect(magicNote()).toBeInTheDocument()
  })

  it('reports an invalid email', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.type(screen.getByLabelText('Email'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('requires a password of at least eight characters', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
  })

  it('confirms account creation', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.type(screen.getByLabelText('Password'), 'supersecret')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByRole('status')).toHaveTextContent('Account created for mira@example.com')
  })

  it('confirms the magic link without a password', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.click(screen.getByRole('button', { name: 'Magic link' }))
    await waitForElementToBeRemoved(passwordField)
    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.click(screen.getByRole('button', { name: 'Send magic link' }))

    expect(screen.getByRole('status')).toHaveTextContent('Magic link sent to mira@example.com')
  })

  it('celebrates a created account with the unlocking lock animation', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.type(screen.getByLabelText('Password'), 'supersecret')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    const lock = document.querySelector('[data-success="lock"]')
    expect(lock).not.toBeNull()
    expect(lock).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Account created for mira@example.com')
  })

  it('celebrates the magic link with the paper plane animation', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.click(screen.getByRole('button', { name: 'Magic link' }))
    await waitForElementToBeRemoved(passwordField)
    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.click(screen.getByRole('button', { name: 'Send magic link' }))

    expect(document.querySelector('[data-success="plane"]')).not.toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent('Magic link sent to mira@example.com')
  })

  it('does not celebrate an invalid submission', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.type(screen.getByLabelText('Email'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(document.querySelector('[data-success]')).toBeNull()
  })

  it('clears the celebration when the reader switches methods', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.type(screen.getByLabelText('Email'), 'mira@example.com')
    await user.type(screen.getByLabelText('Password'), 'supersecret')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(document.querySelector('[data-success="lock"]')).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Password' }))
    await waitForElementToBeRemoved(() => document.querySelector('[data-success]'))
    expect(document.querySelector('[data-success]')).toBeNull()
  })
  it('reserves the status line so switching methods never resizes the form', async () => {
    const user = userEvent.setup()
    renderAccount()

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.click(screen.getByRole('button', { name: 'Magic link' }))
    await waitForElementToBeRemoved(passwordField)

    expect(magicNote()).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
