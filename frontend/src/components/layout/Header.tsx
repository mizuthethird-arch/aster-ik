import { useEffect, useState } from 'react'
import { Mark } from '../brand/Mark'
import { CloseIcon, GitHubIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from '../icons'
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

export function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

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
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className={`grid ${iconButton}`}
          >
            {theme === 'dark' ? <SunIcon className="size-20" /> : <MoonIcon className="size-20" />}
          </button>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className={`grid md:hidden ${iconButton}`}
          >
            {menuOpen ? <CloseIcon className="size-20" /> : <MenuIcon className="size-20" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="grid gap-2 border-t border-border px-16 pt-8 pb-16 md:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setPaletteOpen(true)
            }}
            className="grid h-control grid-flow-col auto-cols-max items-center gap-8 rounded-md px-8 text-body text-muted transition-ui hover:bg-subtle hover:text-fg"
          >
            <SearchIcon className="size-16" />
            Search docs
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="grid h-control items-center rounded-md px-8 text-body text-muted transition-ui hover:bg-subtle hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  )
}
