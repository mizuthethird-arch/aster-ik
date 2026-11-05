import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import type { Variants } from 'motion/react'
import { dialogExitTransition, dialogTransition } from '../../motion/config'
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

/* The panel grows in from just under the trigger; it leaves faster than it came. */
const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8, transition: dialogExitTransition },
  visible: { opacity: 1, scale: 1, y: 0, transition: dialogTransition },
}

const panelClass = 'grid rounded-2xl border border-border bg-card text-fg shadow-float'

/*
 * The panel mounts per opening, so every search starts empty and the field
 * takes focus through the dialog's autofocus, without a state-syncing effect.
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
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this page…"
          aria-label="Search this page"
          className="h-control w-full bg-transparent text-body text-fg placeholder:text-muted"
        />
      </div>

      <ul className="grid gap-2 p-8">
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
        {matches.length === 0 ? (
          <li className="px-8 py-16 text-small text-muted">
            No sections match “{query}”. Try colour, type or spacing.
          </li>
        ) : null}
      </ul>
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
    } else if (!open && dialog.open && reduceMotion) {
      dialog.close()
    }
  }, [open, reduceMotion])

  /* The exit animation owns the close: the dialog stays open until it finishes. */
  const closeAfterExit = () => {
    const dialog = dialogRef.current
    if (!dialog?.open) return
    closingRef.current = true
    dialog.close()
  }

  const handleNativeClose = () => {
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

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onCancel={handleCancel}
      onClick={handleDialogClick}
      aria-label="Search this page"
      className="m-auto w-full border-0 bg-transparent p-0 text-fg backdrop:bg-bg/80 sm:max-w-intro"
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
              variants={panelVariants}
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
