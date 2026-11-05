import { useEffect, useRef, useState } from 'react'
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

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const needle = query.trim().toLowerCase()
  const matches = sections.filter((section) =>
    `${section.label} ${section.note}`.toLowerCase().includes(needle),
  )

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label="Search this page"
      className="m-auto w-full rounded-2xl border border-border bg-card p-0 text-fg shadow-float backdrop:bg-bg/80 sm:max-w-intro"
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-8 border-b border-border px-16 py-10">
        <SearchIcon className="size-16 text-muted" />
        <input
          ref={inputRef}
          type="search"
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
    </dialog>
  )
}
