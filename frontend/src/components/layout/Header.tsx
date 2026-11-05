import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import type { Variants } from 'motion/react'
import {
  iconSpring,
  menuExitTransition,
  menuIconLines,
  menuIconTransition,
  menuTransition,
} from '../../motion/config'
import type { RevealOrigin } from '../../motion/theme-reveal'
import { usePrefersReducedMotion } from '../../motion/use-prefers-reduced-motion'
import { Mark } from '../brand/Mark'
import { GitHubIcon, MoonIcon, SearchIcon, SunIcon } from '../icons'
import { SearchPalette } from './SearchPalette'

type Theme = 'dark' | 'light'

const navLinks = [
  { label: 'Docs', href: '#docs' },
  { label: 'Components', href: '#components' },
  { label: 'Theming', href: '#theming' },
  { label: 'FAQ', href: '#faq' },
]

/* Shared icon-button shape; the display is set per element so responsive
   visibility never fights a base display utility. */
const iconButton =
  'size-control-icon place-items-center rounded-md text-muted transition-ui hover:bg-subtle hover:text-fg'

/* The menu grows and fades in; it shrinks and fades out faster than it opened. */
const menuVariants: Variants = {
  closed: { height: 0, opacity: 0, y: -8, transition: menuExitTransition },
  open: { height: 'auto', opacity: 1, y: 0, transition: menuTransition },
}

const menuClass = 'grid gap-2 overflow-hidden border-t border-border px-16 pt-8 pb-16 md:hidden'

/* Two lines that morph into the X; transform-box keeps the origin at the line. */
const lineStyle = { transformBox: 'fill-box', transformOrigin: 'center' } as const

function MobileMenuContent({
  onNavigate,
  onSearch,
}: {
  onNavigate: () => void
  onSearch: () => void
}) {
  return (
    <>
      <button
        type="button"
        onClick={onSearch}
        className="grid h-control grid-flow-col auto-cols-max items-center gap-8 rounded-md px-8 text-body text-muted transition-ui hover:bg-subtle hover:text-fg"
      >
        <SearchIcon className="size-16" />
        Search docs
      </button>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="grid h-control items-center rounded-md px-8 text-body text-muted transition-ui hover:bg-subtle hover:text-fg"
        >
          {link.label}
        </a>
      ))}
    </>
  )
}

export function Header({
  theme,
  onToggleTheme,
}: {
  theme: Theme
  onToggleTheme: (origin: RevealOrigin) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  /* Escape closes the mobile menu; the palette closes itself (native dialog). */
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  /* ⌘K / Ctrl-K opens search from anywhere on the page. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const menuContent = (
    <MobileMenuContent
      onNavigate={() => setMenuOpen(false)}
      onSearch={() => {
        setMenuOpen(false)
        setPaletteOpen(true)
      }}
    />
  )

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-header backdrop-blur-header">
      <div className="mx-auto grid h-header max-w-page grid-cols-[auto_1fr_auto] items-center gap-16 px-16 sm:px-24 md:px-32">
        <a
          href={import.meta.env.BASE_URL}
          className="inline-grid grid-flow-col auto-cols-max items-center gap-14 rounded-sm"
        >
          <Mark className="h-28 w-auto" />
          <span className="font-wordmark text-wordmark text-fg">aster-ik</span>
        </a>

        <nav
          aria-label="Main"
          className="hidden md:grid md:grid-flow-col md:auto-cols-max md:items-center md:gap-32 md:pl-32"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body text-muted transition-ui hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="grid grid-flow-col auto-cols-max items-center justify-self-end gap-4">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search docs"
            className={`hidden md:grid lg:hidden ${iconButton}`}
          >
            <SearchIcon className="size-20" />
          </button>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-control grid-flow-col auto-cols-max items-center gap-8 rounded-lg border border-border bg-card px-12 text-body text-muted transition-ui hover:bg-subtle lg:grid"
          >
            <SearchIcon className="size-16" />
            <span>Search docs…</span>
            <kbd className="ml-16 rounded-sm border border-border px-6 py-2 font-mono text-kbd text-muted">
              ⌘K
            </kbd>
          </button>

          <a
            href="https://github.com/mizuthethird-arch/aster-ik"
            aria-label="aster-ik on GitHub"
            className={`hidden md:grid ${iconButton}`}
          >
            <GitHubIcon className="size-20" />
          </a>

          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              onToggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
            }}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className={`grid ${iconButton}`}
          >
            <AnimatePresence initial={false}>
              <m.span
                key={theme}
                className="col-start-1 row-start-1 grid place-items-center"
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={iconSpring}
              >
                {theme === 'dark' ? (
                  <SunIcon className="size-20" />
                ) : (
                  <MoonIcon className="size-20" />
                )}
              </m.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className={`grid md:hidden ${iconButton}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <m.line
                x1="4"
                y1="9"
                x2="20"
                y2="9"
                style={lineStyle}
                initial={false}
                animate={menuOpen ? menuIconLines.top.open : menuIconLines.top.closed}
                transition={menuIconTransition}
              />
              <m.line
                x1="4"
                y1="15"
                x2="20"
                y2="15"
                style={lineStyle}
                initial={false}
                animate={menuOpen ? menuIconLines.bottom.open : menuIconLines.bottom.closed}
                transition={menuIconTransition}
              />
            </svg>
          </button>
        </div>
      </div>

      {reduceMotion ? (
        menuOpen ? (
          <nav id="mobile-nav" aria-label="Mobile" className={menuClass}>
            {menuContent}
          </nav>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {menuOpen ? (
            <m.nav
              key="mobile-nav"
              id="mobile-nav"
              aria-label="Mobile"
              data-testid="mobile-menu"
              className={menuClass}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {menuContent}
            </m.nav>
          ) : null}
        </AnimatePresence>
      )}

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  )
}
