type ProgressProps = {
  label: string
  value: number
  className?: string
}

/* Label, percentage and a token-styled track. The bar itself is the only thing
   whose width comes from data. */
export function Progress({ label, value, className = '' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={`grid gap-8 ${className}`}>
      <div className="grid grid-cols-[1fr_auto] text-caption text-muted">
        <span>{label}</span>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        className="h-6 overflow-hidden rounded-full bg-subtle"
      >
        <div className="h-full rounded-full bg-fg" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
