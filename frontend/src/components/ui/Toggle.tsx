import { useId } from 'react'

type ToggleProps = {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/* Switch built on a button with role="switch": the label is the accessible name,
   the description stays visible text, state is aria-checked. */
export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  const labelId = useId()

  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-12">
      <div>
        <p id={labelId} className="text-body text-fg">
          {label}
        </p>
        {description && <p className="mt-2 text-caption text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={`relative h-24 w-40 shrink-0 rounded-full border transition-ui ${
          checked ? 'border-inv bg-inv' : 'border-border bg-subtle'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-2 left-2 size-20 rounded-full transition-transform motion-reduce:transition-none ${
            checked ? 'translate-x-16 bg-inv-fg' : 'bg-fg'
          }`}
        />
      </button>
    </div>
  )
}
