import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

import { Header } from './components/layout/Header'
import { MotionProvider } from './motion/MotionProvider'
import { startThemeReveal } from './motion/theme-reveal'
import type { RevealOrigin } from './motion/theme-reveal'
import { usePrefersReducedMotion } from './motion/use-prefers-reduced-motion'

/*
 * F1 — design-token specimen.
 *
 * Everything below is styled with token classes only: no raw hex, no arbitrary
 * pixel values. If a class here does not resolve to a token in
 * `src/styles/tokens.css`, the token system is incomplete — fix the token,
 * not the page.
 */

type Theme = 'dark' | 'light'

type Swatch = {
  name: string
  className: string
  note?: string
  sample?: string
}

const surfaceFills: Swatch[] = [
  { name: 'bg', className: 'bg-bg', note: 'Page ground' },
  { name: 'card', className: 'bg-card', note: 'Raised surface, always with a border' },
  { name: 'subtle', className: 'bg-subtle', note: 'Quiet fill: hover, selected, tracks' },
  {
    name: 'border',
    className: 'bg-subtle border border-border',
    note: '1px hairline, decoration only',
  },
  { name: 'inv', className: 'bg-inv', note: 'Inverted fill: the primary action' },
  { name: 'header', className: 'bg-header', note: 'Sticky header, 12px backdrop blur' },
  { name: 'grid', className: 'bg-grid', note: 'Hero grid line, decoration only' },
  { name: 'glow', className: 'bg-glow', note: 'One radial glow per page' },
]

const textTokens: Swatch[] = [
  { name: 'fg', className: 'bg-card text-fg', sample: 'Aa', note: 'Primary text and icons' },
  { name: 'muted', className: 'bg-card text-muted', sample: 'Aa', note: 'Secondary text' },
  { name: 'inv-fg', className: 'bg-inv text-inv-fg', sample: 'Aa', note: 'Text on inv' },
  {
    name: 'on-danger',
    className: 'bg-danger text-on-danger',
    sample: 'Aa',
    note: 'Text on danger',
  },
  {
    name: 'on-accent-amber',
    className: 'bg-accent-amber text-on-accent-amber',
    sample: 'Aa',
    note: 'Amber never takes white text',
  },
  {
    name: 'danger-text',
    className: 'bg-card text-danger-text',
    sample: 'Failed',
    note: 'Soft badge text; fails contrast in light',
  },
  {
    name: 'success-text',
    className: 'bg-card text-success-text',
    sample: 'Paid',
    note: 'Soft badge text; fails contrast in light',
  },
  {
    name: 'accent-blue-text',
    className: 'bg-card text-accent-blue-text',
    sample: 'Blue',
    note: 'Accent as text',
  },
  {
    name: 'accent-violet-text',
    className: 'bg-card text-accent-violet-text',
    sample: 'Violet',
    note: 'Accent as text',
  },
  {
    name: 'accent-rose-text',
    className: 'bg-card text-accent-rose-text',
    sample: 'Rose',
    note: 'Accent as text',
  },
  {
    name: 'accent-green-text',
    className: 'bg-card text-accent-green-text',
    sample: 'Green',
    note: 'Accent as text; large text only in light',
  },
  {
    name: 'accent-amber-text',
    className: 'bg-card text-accent-amber-text',
    sample: 'Amber',
    note: 'Fails contrast in light; use the fill there',
  },
  {
    name: 'code-keyword',
    className: 'bg-card text-code-keyword',
    sample: 'const',
    note: 'Keyword in code panels',
  },
  {
    name: 'code-string',
    className: 'bg-card text-code-string',
    sample: 'value',
    note: 'String in code panels',
  },
]

const brandFills: Swatch[] = [
  { name: 'brand-ink', className: 'bg-brand-ink', note: 'Logo ink and brand grounds' },
  { name: 'brand-paper', className: 'bg-brand-paper', note: 'Light ground for print' },
  { name: 'brand-iris', className: 'bg-brand-iris', note: 'The circle in the mark' },
  { name: 'brand-aqua', className: 'bg-brand-aqua', note: 'The asterisk; small spark only' },
]

const statusFills: Swatch[] = [
  { name: 'danger', className: 'bg-danger', note: 'Destructive fill and solid badge' },
  { name: 'danger-soft', className: 'bg-danger-soft', note: 'Soft “Failed” badge ground' },
  { name: 'success-soft', className: 'bg-success-soft', note: 'Soft “Paid” badge ground' },
]

const accentFills: Swatch[] = [
  { name: 'accent-blue', className: 'bg-accent-blue', note: 'Theme preset fill' },
  { name: 'accent-violet', className: 'bg-accent-violet', note: 'Theme preset fill' },
  { name: 'accent-rose', className: 'bg-accent-rose', note: 'Theme preset fill' },
  { name: 'accent-green', className: 'bg-accent-green', note: 'White text only at 18px+ or bold' },
  {
    name: 'accent-amber',
    className: 'bg-accent-amber',
    note: 'Takes on-accent-amber, never white',
  },
]

const typeStyles: { name: string; role: string; className: string; sample: string }[] = [
  {
    name: 'display-xl',
    role: 'Hero headline, 1024px and up',
    className: 'text-display-xl',
    sample: 'Aa',
  },
  {
    name: 'display-lg',
    role: 'Hero headline, 640px to 1023px',
    className: 'text-display-lg',
    sample: 'Aa',
  },
  {
    name: 'display-sm',
    role: 'Hero headline below 640px',
    className: 'text-display-sm',
    sample: 'Aa',
  },
  {
    name: 'cta-title',
    role: 'Closing call-to-action title',
    className: 'text-cta-title',
    sample: 'Aa',
  },
  {
    name: 'heading-lg',
    role: 'Section title, 768px and up',
    className: 'text-heading-lg',
    sample: 'Section title',
  },
  {
    name: 'heading-md',
    role: 'Section title below 768px',
    className: 'text-heading-md',
    sample: 'Section title',
  },
  {
    name: 'lead',
    role: 'Hero subtitle',
    className: 'text-lead text-muted',
    sample: 'Stop rebuilding the same button.',
  },
  {
    name: 'lead-sm',
    role: 'Section intro and FAQ answers',
    className: 'text-lead-sm text-muted',
    sample: 'The tokens in the docs are the tokens in the code.',
  },
  {
    name: 'title',
    role: 'Card and feature titles',
    className: 'text-title text-fg',
    sample: 'Live component',
  },
  {
    name: 'body',
    role: 'Default UI and running text',
    className: 'text-body text-fg',
    sample: 'Wrap your app in AsterIkProvider once, at the root.',
  },
  {
    name: 'body-medium',
    role: 'Button labels and emphasised rows',
    className: 'text-body-medium text-fg',
    sample: 'Get started',
  },
  {
    name: 'label',
    role: 'Form labels, tabs and segments',
    className: 'text-label text-fg',
    sample: 'Theme',
  },
  {
    name: 'small',
    role: 'Card descriptions and helper text',
    className: 'text-small text-muted',
    sample: 'Accessible, typed and themeable on day one.',
  },
  {
    name: 'caption',
    role: 'Secondary lines under a setting',
    className: 'text-caption text-muted',
    sample: 'Changes apply to every component.',
  },
  {
    name: 'micro',
    role: 'Weekday and axis labels, never sentences',
    className: 'text-micro uppercase text-muted',
    sample: 'Mon Tue Wed',
  },
  {
    name: 'eyebrow',
    role: 'Uppercase label above a section title',
    className: 'font-mono text-eyebrow uppercase text-muted',
    sample: 'Design tokens',
  },
  {
    name: 'code',
    role: 'Code panels and copyable snippets',
    className: 'font-mono text-code text-code-keyword',
    sample: 'const button = createButton()',
  },
  {
    name: 'command',
    role: 'The install command line',
    className: 'font-mono text-command text-fg',
    sample: 'pnpm add aster-ik',
  },
  {
    name: 'kbd',
    role: 'Keyboard shortcut hints',
    className: 'font-mono text-kbd text-muted',
    sample: 'Esc',
  },
  {
    name: 'wordmark',
    role: 'The aster-ik wordmark only',
    className: 'font-wordmark text-wordmark text-fg',
    sample: 'aster-ik',
  },
]

const spacingScale: { name: string; bar: string }[] = [
  { name: 'space-2', bar: 'w-2' },
  { name: 'space-4', bar: 'w-4' },
  { name: 'space-6', bar: 'w-6' },
  { name: 'space-8', bar: 'w-8' },
  { name: 'space-10', bar: 'w-10' },
  { name: 'space-12', bar: 'w-12' },
  { name: 'space-14', bar: 'w-14' },
  { name: 'space-16', bar: 'w-16' },
  { name: 'space-20', bar: 'w-20' },
  { name: 'space-22', bar: 'w-22' },
  { name: 'space-24', bar: 'w-24' },
  { name: 'space-32', bar: 'w-32' },
  { name: 'space-40', bar: 'w-40' },
  { name: 'space-56', bar: 'w-56' },
  { name: 'space-64', bar: 'w-64' },
  { name: 'space-72', bar: 'w-72' },
  { name: 'space-96', bar: 'w-96' },
  { name: 'space-112', bar: 'w-112' },
]

const radii: { name: string; box: string }[] = [
  { name: 'radius-xs', box: 'rounded-xs' },
  { name: 'radius-sm', box: 'rounded-sm' },
  { name: 'radius-md', box: 'rounded-md' },
  { name: 'radius-input', box: 'rounded-input' },
  { name: 'radius-lg', box: 'rounded-lg' },
  { name: 'radius-xl', box: 'rounded-xl' },
  { name: 'radius-2xl', box: 'rounded-2xl' },
  { name: 'radius-full', box: 'rounded-full' },
  { name: 'radius-mark', box: 'rounded-mark' },
]

const layoutTokens: { name: string; note: string }[] = [
  { name: 'container-max', note: 'Max content width, centred, gutter inside' },
  { name: 'header-height', note: 'Sticky header height' },
  { name: 'control-height', note: 'Default control; 32 small, 36 icon, 44 CTA' },
  { name: 'input-height', note: 'Text input height' },
  { name: 'breakpoint-sm', note: 'Two-column bento, row CTAs, display-lg' },
  { name: 'breakpoint-md', note: 'Desktop nav shows, larger section spacing' },
  { name: 'breakpoint-lg', note: 'Three columns, split layouts, display-xl' },
]

const motionTokens: { name: string; note: string }[] = [
  { name: 'motion-fast', note: 'Colour, background, border and knob position' },
  { name: 'motion-medium', note: 'Accordion icons' },
  { name: 'motion-slow', note: 'Chart bars' },
]

function SwatchList({ tokens }: { tokens: Swatch[] }) {
  return (
    <ul className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
      {tokens.map((token) => (
        <li key={token.name} className="rounded-2xl border border-border bg-card p-22">
          <div
            aria-hidden="true"
            className={`grid h-16 place-items-center rounded-lg border border-border ${token.className}`}
          >
            {token.sample ? <span className="text-body-medium">{token.sample}</span> : null}
          </div>
          <p className="mt-14 font-mono text-caption text-fg">{token.name}</p>
          {token.note ? <p className="mt-2 text-caption text-muted">{token.note}</p> : null}
        </li>
      ))}
    </ul>
  )
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="border-t border-border pt-72 md:pt-112">
      <p className="font-mono text-eyebrow uppercase text-muted">{eyebrow}</p>
      <h2 className="mt-8 text-heading-md text-fg md:text-heading-lg">{title}</h2>
      <p className="mt-14 max-w-intro text-lead-sm text-muted">{intro}</p>
      {children}
    </section>
  )
}

function TokenRows({ rows }: { rows: { name: string; note: string }[] }) {
  return (
    <ul className="mt-14">
      {rows.map((row) => (
        <li
          key={row.name}
          className="grid gap-8 border-b border-border py-14 sm:grid-cols-[auto_1fr] sm:items-baseline"
        >
          <span className="font-mono text-caption text-fg">{row.name}</span>
          <span className="text-small text-muted sm:justify-self-end">{row.note}</span>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
  }, [theme])

  const toggleTheme = (origin: RevealOrigin) => {
    /* The next theme is revealed by a circle growing out of the toggle. */
    startThemeReveal(
      () => flushSync(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))),
      origin,
      reduceMotion,
    )
  }

  return (
    <MotionProvider>
      <div className="min-h-svh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:left-16 focus:z-10 focus:inline-grid focus:h-control focus:place-items-center focus:rounded-lg focus:border focus:border-border focus:bg-card focus:px-16 focus:text-body-medium focus:text-fg"
        >
          Skip to content
        </a>
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main id="main" className="mx-auto max-w-page px-16 pb-72 sm:px-24 md:px-32">
          <section className="relative isolate pt-64">
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-grid" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />
            <p className="font-mono text-eyebrow uppercase text-muted">Design tokens</p>
            <h1 className="mt-16 text-display-sm text-fg sm:text-display-lg lg:text-display-xl">
              Small surface. <span className="text-muted">Solid foundations.</span>
            </h1>
            <p className="mt-20 max-w-lead text-lead text-muted">
              Every colour, type size, space, radius and elevation on this page comes from one token
              file. Dark is the default; toggle the light theme to check both.
            </p>
          </section>

          <div className="mt-72">
            <Section
              id="colour"
              eyebrow="Colour"
              title="Quiet surfaces. One accent."
              intro="The product layer stays neutral: hairlines, one soft elevation and colour only from the accent a product picks and from status."
            >
              <h3 className="mt-32 text-title text-fg">Surfaces</h3>
              <SwatchList tokens={surfaceFills} />

              <h3 className="mt-40 text-title text-fg">Text on surfaces</h3>
              <SwatchList tokens={textTokens} />

              <h3 className="mt-40 text-title text-fg">Brand layer</h3>
              <p className="mt-6 max-w-intro text-small text-muted">
                Brand colours belong to the logo and the landing page. Never use them inside a
                component.
              </p>
              <SwatchList tokens={brandFills} />

              <h3 className="mt-40 text-title text-fg">Status</h3>
              <p className="mt-6 max-w-intro text-small text-muted">
                Status always carries a word, never colour alone. The soft badge texts fail contrast
                in light and are kept exact from the source; use the solid fill there.
              </p>
              <SwatchList tokens={statusFills} />

              <h3 className="mt-40 text-title text-fg">Theme accents</h3>
              <p className="mt-6 max-w-intro text-small text-muted">
                A product picks one accent, or stays neutral with the inverted fill.
              </p>
              <SwatchList tokens={accentFills} />
            </Section>
          </div>

          <div className="mt-72">
            <Section
              id="typography"
              eyebrow="Typography"
              title="Readable APIs. Predictable results."
              intro="Geist carries the interface, Geist Mono carries code and labels, and Sora 800 is only ever the wordmark."
            >
              <div className="mt-32 border-t border-border">
                {typeStyles.map((style) => (
                  <div key={style.name} className="border-b border-border py-20">
                    <p className="font-mono text-caption text-muted">
                      {style.name} · {style.role}
                    </p>
                    <p className={`mt-6 ${style.className}`}>{style.sample}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <div className="mt-72">
            <Section
              id="spacing"
              eyebrow="Spacing"
              title="A 1px rhythm. Nothing off-scale."
              intro="Gutters, section padding, card padding and control gaps all come from the same pixel scale."
            >
              <ul className="mt-32">
                {spacingScale.map((step) => (
                  <li
                    key={step.name}
                    className="grid grid-flow-col auto-cols-max items-center gap-16 border-b border-border py-10"
                  >
                    <span className="w-72 shrink-0 font-mono text-caption text-muted">
                      {step.name}
                    </span>
                    <div
                      aria-hidden="true"
                      className={`h-8 shrink-0 rounded-xs bg-fg ${step.bar}`}
                    />
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="mt-72">
            <Section
              id="radii"
              eyebrow="Radii"
              title="Small surface. Soft edges."
              intro="One radius scale; large containers stick to radius-2xl, controls to radius-lg."
            >
              <ul className="mt-32 grid grid-cols-2 gap-12 sm:grid-cols-3 lg:grid-cols-4">
                {radii.map((radius) => (
                  <li key={radius.name} className="rounded-2xl border border-border bg-card p-22">
                    <div
                      aria-hidden="true"
                      className={`size-64 border border-border bg-subtle ${radius.box}`}
                    />
                    <p className="mt-14 font-mono text-caption text-fg">{radius.name}</p>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="mt-72">
            <Section
              id="elevation"
              eyebrow="Elevation"
              title="Flat, with one exception."
              intro="Everything sits on the page with a hairline. Only things that genuinely float take the one shadow."
            >
              <div className="mt-32 max-w-intro rounded-2xl border border-border bg-card p-22 shadow-float">
                <p className="text-title text-fg">shadow-float</p>
                <p className="mt-6 text-small text-muted">
                  Install box, code panel, toast and the theming preview card. Nothing else.
                </p>
              </div>
            </Section>
          </div>

          <div className="mt-72">
            <Section
              id="layout"
              eyebrow="Layout and motion"
              title="Mobile first. Motion on a budget."
              intro="Layout starts on the phone and scales up; motion is short, functional and removed when the reader asks for less."
            >
              <h3 className="mt-32 text-title text-fg">Layout</h3>
              <TokenRows rows={layoutTokens} />

              <h3 className="mt-40 text-title text-fg">Motion</h3>
              <TokenRows rows={motionTokens} />
              <p className="mt-14 max-w-intro text-small text-muted">
                With prefers-reduced-motion the three durations become zero; no animation runs.
              </p>
            </Section>
          </div>
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-page px-16 py-24 text-caption text-muted sm:px-24 md:px-32">
            Token specimen · aster-ik · dark is the default theme
          </div>
        </footer>
      </div>
    </MotionProvider>
  )
}

export default App
