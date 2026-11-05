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
 * Pressed-button group for view switches (auth method, chart range).
 *
 * One inverted pill slides between the options instead of two backgrounds
 * swapping. The labels are painted in a separate, pointer-transparent layer
 * above the pill with `difference` blending (`.blend-label`): over the page they
 * render light, over the pill dark — per pixel, with no colour transition. That
 * keeps them legible while the pill travels, instead of crossfading to white on
 * the white pill (which read as a blank rounded surface mid-slide). The buttons
 * themselves keep their text transparent so the accessible name stays intact
 * while the visible copy lives in the blended layer.
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

  const columns = `repeat(${options.length}, minmax(0, 1fr))`

  return (
    <div
      role="group"
      aria-label={label}
      style={{ gridTemplateColumns: columns }}
      className={`relative isolate items-center rounded-md border border-border bg-bg p-6 ${
        fill ? 'grid w-full' : 'inline-grid'
      } ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="relative h-control-sm rounded-sm px-10 text-label text-transparent transition-ui hover:bg-subtle"
        >
          {option.label}
        </button>
      ))}

      <span
        aria-hidden="true"
        data-segmented-indicator=""
        className="slide-surface pointer-events-none absolute top-6 bottom-6 left-6 rounded-sm bg-inv"
        style={{
          width: `calc((100% - 12px) / ${options.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />

      <div
        aria-hidden="true"
        style={{ gridTemplateColumns: columns }}
        className="pointer-events-none absolute inset-6 grid items-center"
      >
        {options.map((option) => (
          <span key={option.value} className="blend-label px-10 text-center text-label">
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}
