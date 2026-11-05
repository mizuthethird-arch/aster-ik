import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchIcon } from '../icons'
import { Card } from '../ui/Card'

type Command = {
  id: string
  label: string
  shortcut: string
  run: () => string
}

const shortcutKey: Record<string, string> = { n: 'new', i: 'invite', t: 'theme', b: 'billing' }

export function CommandCard({
  className = '',
  onToggleTheme,
}: {
  className?: string
  onToggleTheme: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [status, setStatus] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(
    () => [
      { id: 'new', label: 'New project', shortcut: '⌘N', run: () => 'Ran: New project' },
      { id: 'invite', label: 'Invite teammate', shortcut: '⌘I', run: () => 'Ran: Invite teammate' },
      {
        id: 'theme',
        label: 'Toggle theme',
        shortcut: '⌘T',
        run: () => {
          onToggleTheme()
          return 'Ran: Toggle theme'
        },
      },
      { id: 'settings', label: 'Settings', shortcut: '', run: () => 'Ran: Settings' },
      { id: 'billing', label: 'Billing', shortcut: '⌘B', run: () => 'Ran: Billing' },
    ],
    [onToggleTheme],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle
      ? commands.filter((command) => command.label.toLowerCase().includes(needle))
      : commands
  }, [commands, query])

  const runCommand = (command: Command) => {
    setStatus(command.run())
    setQuery('')
    setActiveIndex(0)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return
      const id = shortcutKey[event.key.toLowerCase()]
      if (!id) return
      const command = commands.find((item) => item.id === id)
      if (!command) return
      event.preventDefault()
      setStatus(command.run())
      setQuery('')
      setActiveIndex(0)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commands])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (filtered.length ? (index + 1) % filtered.length : 0))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) =>
        filtered.length ? (index - 1 + filtered.length) % filtered.length : 0,
      )
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const command = filtered[activeIndex]
      if (command) runCommand(command)
    }
  }

  const activeCommand = filtered[activeIndex]

  return (
    <Card className={`flex? ${className}`}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-8 border-b border-border pb-10">
        <SearchIcon className="size-16 text-muted" />
        <input
          ref={inputRef}
          role="combobox"
          aria-label="Command palette"
          aria-expanded={filtered.length > 0}
          aria-controls="command-list"
          aria-activedescendant={activeCommand ? `command-${activeCommand.id}` : undefined}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command…"
          className="h-control w-full bg-transparent text-body text-fg placeholder:text-muted focus-visible:outline-none"
        />
      </div>

      <p className="mt-12 text-caption text-muted">Suggestions</p>

      <div id="command-list" role="listbox" aria-label="Suggestions" className="mt-6 grid gap-2">
        {filtered.map((command, index) => (
          <button
            key={command.id}
            type="button"
            role="option"
            id={`command-${command.id}`}
            aria-selected={index === activeIndex}
            onClick={() => runCommand(command)}
            onMouseEnter={() => setActiveIndex(index)}
            className={`grid grid-cols-[1fr_auto] items-center gap-8 rounded-sm px-8 py-4 text-left text-body transition-ui ${
              index === activeIndex
                ? 'bg-subtle text-fg'
                : 'text-muted hover:bg-subtle hover:text-fg'
            }`}
          >
            <span>{command.label}</span>
            {command.shortcut && (
              <span className="text-caption text-muted">{command.shortcut}</span>
            )}
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="px-8 py-6 text-body text-muted">No commands match “{query}”.</p>
        )}
      </div>

      <p role="status" className="mt-4 min-h-16 px-8 text-caption text-muted">
        {status}
      </p>
    </Card>
  )
}
