export type SegmentedOption<T extends string> = { value: T; label: string }

type SegmentedProps<T extends string> = {
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  fill?: boolean
  className?: string
}

/*
 * Pressed-button group for view switches (auth method, chart range). One shared
 * inverted pill slides between the options, so the surface moves instead of two
 * backgrounds swapping; the active label flips to inverted-fg text.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  fill = false,
  className = '',
}: SegmentedProps<T>) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      role="group"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      className={`relative items-center rounded-md border border-border bg-bg p-6 ${
        fill ? 'grid w-full' : 'inline-grid'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        data-segmented-indicator=""
        className="slide-surface pointer-events-none absolute top-6 bottom-6 left-6 rounded-sm bg-inv"
        style={{
          width: `calc((100% - 12px) / ${options.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />

      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`relative z-10 h-control-sm rounded-sm px-10 text-label transition-ui ${
              active ? 'text-inv-fg' : 'text-fg hover:bg-subtle'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
