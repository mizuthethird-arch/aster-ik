import { useEffect, useRef, useState } from 'react'
import { copyText } from '../../lib/clipboard'
import { ArrowRightIcon, CheckIcon, CopyIcon } from '../icons'

/*
 * Landing hero: the reference layout — announcement pill, display headline with
 * the muted second clause, lead, two calls to action and the install box with a
 * package-manager switch and a copy button.
 */

const managers = [
  { id: 'npm', label: 'npm', command: 'npm install aster-ik' },
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add aster-ik' },
  { id: 'yarn', label: 'yarn', command: 'yarn add aster-ik' },
  { id: 'bun', label: 'bun', command: 'bun add aster-ik' },
]

const stackFacts = 'React · TypeScript · CSS variables · Light and dark'

export function Hero() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const copiedTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])

  const command = managers[active].command

  const copyCommand = async () => {
    const copiedToClipboard = await copyText(command)
    if (!copiedToClipboard) return
    setCopied(true)
    window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  /* WAI-ARIA tabs: arrows move and select, Home/End jump to the ends. */
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = managers.length - 1
    const next =
      event.key === 'ArrowRight'
        ? active === last
          ? 0
          : active + 1
        : event.key === 'ArrowLeft'
          ? active === 0
            ? last
            : active - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1

    if (next < 0) return
    event.preventDefault()
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  return (
    <section aria-labelledby="hero-title" className="relative isolate pt-64">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-grid" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />

      <div className="mx-auto grid max-w-page justify-items-center px-16 text-center sm:px-24 md:px-32">
        <a
          href="#docs"
          className="inline-grid grid-flow-col auto-cols-max items-center gap-10 rounded-full border border-border bg-card py-6 pr-14 pl-6 text-caption text-muted transition-ui hover:bg-subtle"
        >
          <span className="rounded-full bg-fg px-8 py-2 text-micro font-medium text-bg">New</span>
          <span>Early preview of aster-ik</span>
          <ArrowRightIcon className="size-16" />
        </a>

        <h1
          id="hero-title"
          className="mt-40 max-w-headline text-display-sm text-fg sm:text-display-lg lg:text-display-xl"
        >
          Components for the interfaces <span className="text-muted">you build next.</span>
        </h1>

        <p className="mt-24 max-w-lead text-lead text-muted">
          Accessible, composable React components with a token-based theme. Copy less, ship more,
          and keep every project looking like it belongs together.
        </p>

        <div className="mt-32 grid w-full gap-12 sm:w-auto sm:grid-flow-col sm:auto-cols-max sm:justify-center">
          <a
            href="#docs"
            className="grid h-control-cta grid-flow-col auto-cols-max items-center justify-center gap-8 rounded-lg bg-inv px-20 text-body-medium text-inv-fg transition-ui hover:opacity-90 sm:h-control"
          >
            Get started
            <ArrowRightIcon className="size-16" />
          </a>
          <a
            href="#components"
            className="grid h-control-cta grid-flow-col auto-cols-max items-center justify-center rounded-lg border border-border bg-card px-20 text-body-medium text-fg transition-ui hover:bg-subtle sm:h-control"
          >
            Browse components
          </a>
        </div>

        <div className="mt-40 w-full max-w-install rounded-2xl border border-border bg-card shadow-float">
          <div className="grid grid-cols-[1fr_auto] items-center gap-8 border-b border-border px-12 py-6">
            <div
              role="tablist"
              aria-label="Package manager"
              onKeyDown={handleTabKeyDown}
              className="grid grid-flow-col auto-cols-max items-center gap-2"
            >
              {managers.map((manager, index) => (
                <button
                  key={manager.id}
                  ref={(node) => {
                    tabsRef.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`install-tab-${manager.id}`}
                  aria-selected={active === index}
                  aria-controls="install-command"
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={`rounded-sm px-8 py-2 text-label transition-ui ${
                    active === index ? 'bg-subtle text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {manager.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={copyCommand}
              className="grid grid-flow-col auto-cols-max items-center gap-6 rounded-md px-8 py-2 text-label text-muted transition-ui hover:bg-subtle hover:text-fg"
            >
              {copied ? <CheckIcon className="size-16" /> : <CopyIcon className="size-16" />}
              <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div
            id="install-command"
            role="tabpanel"
            aria-labelledby={`install-tab-${managers[active].id}`}
            className="grid grid-flow-col auto-cols-max items-center gap-8 px-12 py-10 font-mono text-command"
          >
            <span aria-hidden="true" className="text-muted">
              $
            </span>
            <code className="text-fg">{command}</code>
          </div>
        </div>

        <p className="mt-24 text-small text-muted">{stackFacts}</p>
      </div>
    </section>
  )
}
