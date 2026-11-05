/*
 * The aster-ik mark, full colour.
 *
 * Three shapes on one 168 × 64 grid: the iris circle (the component), the
 * rounded square (the system that holds it) and the aqua asterisk (the detail
 * that finishes it). The square is white on dark grounds and ink on light
 * grounds; both themes read the same token.
 *
 * Decorative here: the wordmark beside it carries the accessible name.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 168 64" aria-hidden="true" focusable="false" className={className}>
      <circle cx="32" cy="32" r="30" fill="var(--aster-ik-brand-iris)" />
      <rect x="54" y="2" width="60" height="60" rx="16" fill="var(--aster-ik-brand-mark-square)" />
      <g fill="var(--aster-ik-brand-aqua)">
        <rect x="129" y="2" width="14" height="60" rx="7" />
        <rect
          x="129"
          y="2"
          width="14"
          height="60"
          rx="7"
          transform="matrix(0.5 0.866025 -0.866025 0.5 95.7128 -101.779)"
        />
        <rect
          x="129"
          y="2"
          width="14"
          height="60"
          rx="7"
          transform="matrix(-0.5 0.866025 -0.866025 -0.5 231.713 -69.7795)"
        />
      </g>
    </svg>
  )
}
