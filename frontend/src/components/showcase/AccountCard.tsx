import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import {
  fieldSwapVariants,
  successCelebrateMs,
  successLoadingMs,
  successPlaneCelebrateMs,
} from '../../motion/config'
import { usePrefersReducedMotion } from '../../motion/use-prefers-reduced-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { LockSuccessAnimation, PaperPlaneSuccessAnimation } from './SuccessAnimations'
import { Segmented } from '../ui/Segmented'

type Mode = 'password' | 'magic'
type Celebration = 'lock' | 'plane'
type Phase = 'form' | 'celebrate' | 'loading'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const modeOptions = [
  { value: 'password', label: 'Password' },
  { value: 'magic', label: 'Magic link' },
] as const

const loadingCopy: Record<Mode, string> = {
  password: 'Preparing your workspace…',
  magic: 'Sending your link…',
}

function LoadingBeat() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <span
      data-success-loading=""
      aria-hidden="true"
      className={`block size-32 rounded-full border-2 border-border border-t-fg ${
        reduceMotion ? '' : 'animate-spin'
      }`}
    />
  )
}

export function AccountCard({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [status, setStatus] = useState('')
  const [celebration, setCelebration] = useState<Celebration>('lock')
  const [phase, setPhase] = useState<Phase>('form')
  const reduceMotion = usePrefersReducedMotion()

  /* After a success the card is covered: the celebration holds for at least a
     second, a loading beat follows, then the card returns to a clean form so the
     flow can be tried again. */
  useEffect(() => {
    if (phase === 'form') return

    const timer = window.setTimeout(
      () => {
        if (phase === 'celebrate') {
          setPhase('loading')
          setStatus(loadingCopy[mode])
          return
        }

        setPhase('form')
        setEmail('')
        setPassword('')
        setErrors({})
        setStatus('')
      },
      phase === 'celebrate'
        ? celebration === 'plane'
          ? successPlaneCelebrateMs
          : successCelebrateMs
        : successLoadingMs,
    )

    return () => window.clearTimeout(timer)
  }, [phase, celebration])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (phase !== 'form') return

    const next: { email?: string; password?: string } = {}
    const address = email.trim()

    if (!emailPattern.test(address)) next.email = 'Enter a valid email address.'
    if (mode === 'password' && password.length < 8) next.password = 'Use at least 8 characters.'

    setErrors(next)
    if (Object.keys(next).length > 0) {
      setStatus('')
      return
    }

    setStatus(
      mode === 'password' ? `Account created for ${address}` : `Magic link sent to ${address}`,
    )
    setCelebration(mode === 'password' ? 'lock' : 'plane')
    setPassword('')
    setPhase('celebrate')
  }

  const slot =
    mode === 'password' ? (
      <Input
        id="account-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
      />
    ) : (
      <p className="grid min-h-96 content-center rounded-input border border-border px-12 text-caption text-muted">
        We email you a one-time link — no password needed.
      </p>
    )

  return (
    <Card
      title="Create an account"
      subtitle="Enter your email below to get started."
      className={`relative overflow-hidden ${className}`}
    >
      <form onSubmit={submit} noValidate inert={phase !== 'form'} className="mt-16 grid gap-12">
        <Segmented
          label="Sign-in method"
          options={modeOptions}
          value={mode}
          onChange={(next) => {
            setMode(next)
            setErrors({})
            setStatus('')
          }}
          fill
        />

        <p className="text-center text-caption text-muted">OR</p>

        <Input
          id="account-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        {/* Fixed-height slot: the password field and the magic-link note occupy
            the same space, so switching methods never resizes the card. The old
            state fades and rises out before the new one rises in (instant when
            the reader prefers reduced motion). */}
        <div className="relative min-h-96">
          {reduceMotion ? (
            slot
          ) : (
            <AnimatePresence initial={false}>
              <m.div
                key={mode}
                data-swap-slot=""
                className="absolute inset-x-0 top-0"
                variants={fieldSwapVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {slot}
              </m.div>
            </AnimatePresence>
          )}
        </div>

        <Button size="default" type="submit" className="w-full">
          {mode === 'password' ? 'Create account' : 'Send magic link'}
        </Button>
      </form>

      <p role="status" className="mt-12 min-h-20 text-center text-caption text-success-text">
        {status}
      </p>

      {phase !== 'form' && (
        <div
          data-success-overlay=""
          aria-hidden="true"
          className="absolute inset-0 z-10 grid place-items-center rounded-xl bg-card/95 backdrop-blur-sm"
        >
          <div className="grid place-items-center gap-12">
            {phase === 'celebrate' ? (
              celebration === 'lock' ? (
                <LockSuccessAnimation />
              ) : (
                <PaperPlaneSuccessAnimation />
              )
            ) : (
              <LoadingBeat />
            )}
            <p className="text-caption text-success-text">{status}</p>
          </div>
        </div>
      )}
    </Card>
  )
}
