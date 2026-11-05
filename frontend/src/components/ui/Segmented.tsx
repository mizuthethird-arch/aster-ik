export type SegmentedOption<T extends string> = { value: T; label: string }

type SegmentedProps<T extends string> = {
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  fill?: boolean
  className?: string
}

/* Small pressed-button group used for view switches (auth method, chart range). */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  fill = false,
  className = '',
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`grid items-center gap-4 rounded-md border border-border bg-bg p-4 ${
        fill ? 'w-full grid-cols-2' : 'grid-flow-col auto-cols-max'
      } ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`h-control-sm rounded-sm px-10 text-label transition-ui ${
            option.value === value
              ? 'bg-subtle text-fg'
              : 'text-muted hover:bg-subtle hover:text-fg'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
