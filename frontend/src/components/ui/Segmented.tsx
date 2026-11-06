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
 * swapping. The labels are painted in two layers above the pill: one in the page
 * colour, and one in the inverted colour clipped to the pill's exact rectangle.
 * The clip animates with the same spring as the pill, so a travelling pill never
 * leaves a blank surface or a washed-out label behind. The buttons themselves
 * keep their text transparent so the accessible name stays intact while the
 * visible copy lives in the painted layers.
 *
 * This replaced a single pure-white label over `mix-blend-mode: difference`,
 * which Safari mis-composited inside an isolated, GPU-composited group and
 * rendered as plain white — the active label vanished into the white pill.
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

  // Pill geometry: inset 6px on both sides, width (100% - 12px) / n, translated
  // index * 100% of its own width. The clip below mirrors it exactly.
  const pillSpan = `(100% - 12px) / ${options.length}`
  const clipPath = `inset(0 calc(100% - 6px - ${pillSpan} * ${index + 1}) 0 calc(6px + ${pillSpan} * ${index}))`

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

      {/* Page-colour labels, visible over the page and the pill alike. */}
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

      {/* Inverted labels, clipped to the pill so only its area shows them. */}
      <div
        aria-hidden="true"
        data-segmented-inverse=""
        style={{ gridTemplateColumns: columns, clipPath }}
        className="slide-clip pointer-events-none absolute inset-6 grid items-center"
      >
        {options.map((option) => (
          <span key={option.value} className="blend-label-inverse px-10 text-center text-label">
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}
