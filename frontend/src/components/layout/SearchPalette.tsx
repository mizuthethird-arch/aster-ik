import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { dialogPanelVariants } from '../../motion/config'
import { usePrefersReducedMotion } from '../../motion/use-prefers-reduced-motion'
import { SearchIcon } from '../icons'

/*
 * Minimal search for the current page: the sections that exist today. A full
 * docs index is a later task; this keeps the nav's search affordance honest.
 */

const sections = [
  { label: 'Colour', href: '#colour', note: 'Surfaces, text, status and accents' },
  { label: 'Typography', href: '#typography', note: 'Type scale, families and roles' },
  { label: 'Spacing', href: '#spacing', note: 'The 1px rhythm and layout sizes' },
  { label: 'Radii', href: '#radii', note: 'One radius scale, soft edges' },
  { label: 'Elevation', href: '#elevation', note: 'The one shadow' },
  { label: 'Layout and motion', href: '#layout', note: 'Mobile first, motion on a budget' },
]

const panelClass = 'grid rounded-2xl border border-border bg-card text-fg shadow-float'

/* The page must not scroll behind a modal. The scrollbar gutter is reserved in
   CSS, so hiding the scrollbar does not shift the page. */
function setScrollLock(locked: boolean) {
  const root = document.documentElement
  if (locked) root.setAttribute('data-scroll-locked', '')
  else root.removeAttribute('data-scroll-locked')
}

/*
 * The panel mounts per opening, so every search starts empty. Nothing focuses
 * the field: the modal opens without autofocus, the way a sheet should, and the
 * reader can Tab or tap into the field when they want to search.
 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const matches = sections.filter((section) =>
    `${section.label} ${section.note}`.toLowerCase().includes(needle),
  )

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] items-center gap-8 border-b border-border px-16 py-10">
        <SearchIcon className="size-16 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this page…"
          aria-label="Search this page"
          className="field-focus h-control w-full rounded-input border border-transparent bg-transparent px-8 text-body text-fg placeholder:text-muted"
        />
      </div>

      {/* One fixed-height scroll region: the dialog never changes size, and a
          long result list scrolls inside it instead of growing the panel. */}
      <div className="h-dialog-list scroll-gutter-stable overflow-y-auto overscroll-contain p-8">
        {matches.length > 0 ? (
          <ul className="grid gap-2">
            {matches.map((section) => (
              <li key={section.href}>
                <a
                  href={section.href}
                  aria-label={`${section.label}: ${section.note}`}
                  onClick={onClose}
                  className="grid gap-2 rounded-md px-8 py-8 transition-ui hover:bg-subtle"
                >
                  <span className="text-body-medium text-fg">{section.label}</span>
                  <span className="text-caption text-muted">{section.note}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="grid h-full place-items-center px-8 text-center text-small text-muted">
            No sections match “{query}”. Try colour, type or spacing.
          </p>
        )}
      </div>
    </>
  )
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closingRef = useRef(false)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      setScrollLock(true)
    } else if (!open && dialog.open && reduceMotion) {
      dialog.close()
      setScrollLock(false)
    }
    /* Keep focus inside the modal without focusing the field: the browser focuses
       the first focusable descendant on showModal, so the dialog takes it back. */
    if (open) dialog.focus()
  }, [open, reduceMotion])

  /* Never leave the page locked if the palette unmounts mid-open. */
  useEffect(() => () => setScrollLock(false), [])

  /* The exit animation owns the close: the dialog stays open until it finishes. */
  const closeAfterExit = () => {
    const dialog = dialogRef.current
    if (!dialog?.open) return
    closingRef.current = true
    dialog.close()
    setScrollLock(false)
  }

  const handleNativeClose = () => {
    setScrollLock(false)
    if (closingRef.current) {
      closingRef.current = false
      return
    }
    onClose()
  }

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    /* Backdrop clicks are retargeted to the dialog element; panel clicks hit a child. */
    if (event.target === event.currentTarget) onClose()
  }

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    /* Keep the dialog open so the panel can animate out. */
    event.preventDefault()
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    /* A search field swallows Escape to clear itself; close the palette instead. */
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
      onClick={handleDialogClick}
      aria-label="Search this page"
      tabIndex={-1}
      className="m-auto w-full border-0 bg-transparent p-0 text-fg outline-none backdrop:bg-bg/80 sm:max-w-intro"
    >
      {reduceMotion ? (
        open ? (
          <div className={panelClass}>
            <SearchPanel onClose={onClose} />
          </div>
        ) : null
      ) : (
        <AnimatePresence onExitComplete={closeAfterExit}>
          {open ? (
            <m.div
              key="search-panel"
              variants={dialogPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={panelClass}
            >
              <SearchPanel onClose={onClose} />
            </m.div>
          ) : null}
        </AnimatePresence>
      )}
    </dialog>
  )
}
