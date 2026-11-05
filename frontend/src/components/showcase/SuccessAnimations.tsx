import { m } from 'motion/react'
import {
  lockBodyVariants,
  lockRingVariants,
  lockShackleTransition,
  lockShackleVariants,
  lockTransition,
  planeCheckTransition,
  planeDrawTransition,
  planeFlightTransition,
  planeFlightVariants,
  planeTrailTransition,
} from '../../motion/config'
import { usePrefersReducedMotion } from '../../motion/use-prefers-reduced-motion'

const frame = 'grid h-full place-items-center text-fg'
const art = 'size-64'

const shield = {
  fill: 'currentColor',
  fillOpacity: 0.08,
  stroke: 'currentColor',
  strokeWidth: 2.5,
} as const

/* A padlock that opens: the body settles in, a soft ring breathes out and the
   shackle lifts and swings on its hinge. Static open state under reduced motion. */
export function LockSuccessAnimation() {
  const reduceMotion = usePrefersReducedMotion()

  if (reduceMotion) {
    return (
      <div data-success="lock" aria-hidden="true" className={frame}>
        <svg viewBox="0 0 64 64" className={art}>
          <circle
            cx="32"
            cy="34"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            opacity={0.35}
            className="text-success-text"
          />
          <g transform="translate(0 -3) rotate(-14 22 30)">
            <path
              d="M22 30v-8a10 10 0 0 1 20 0v8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </g>
          <rect x="16" y="30" width="32" height="24" rx="6" {...shield} />
          <circle cx="32" cy="42" r="2.5" fill="currentColor" />
        </svg>
      </div>
    )
  }

  return (
    <div data-success="lock" aria-hidden="true" className={frame}>
      <m.svg viewBox="0 0 64 64" className={art}>
        <m.circle
          cx="32"
          cy="34"
          r="26"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-success-text"
          variants={lockRingVariants}
          initial="hidden"
          animate="visible"
          transition={lockTransition}
        />
        <m.g
          variants={lockBodyVariants}
          initial="hidden"
          animate="visible"
          transition={lockTransition}
        >
          <rect x="16" y="30" width="32" height="24" rx="6" {...shield} />
          <circle cx="32" cy="42" r="2.5" fill="currentColor" />
        </m.g>
        <m.g
          style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
          variants={lockShackleVariants}
          initial="locked"
          animate="open"
          transition={lockShackleTransition}
        >
          <path
            d="M22 30v-8a10 10 0 0 1 20 0v8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </m.g>
      </m.svg>
    </div>
  )
}

/* A paper plane that draws itself, takes off along its trail and leaves a green
   sent check behind. Static drawn plane + check under reduced motion. */
export function PaperPlaneSuccessAnimation() {
  const reduceMotion = usePrefersReducedMotion()

  if (reduceMotion) {
    return (
      <div data-success="plane" aria-hidden="true" className={frame}>
        <svg viewBox="0 0 64 64" className={art}>
          <path
            d="M8 46c10-1 18-6 24-14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="1 5"
            strokeLinecap="round"
            opacity={0.5}
            className="text-success-text"
          />
          <path d="M8 32 58 8 38 56 30 38Z" {...shield} strokeLinejoin="round" />
          <path d="M30 38 58 8" fill="none" stroke="currentColor" strokeWidth={2.5} />
          <path
            d="M22 34 30 42 46 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success-text"
          />
        </svg>
      </div>
    )
  }

  return (
    <div data-success="plane" aria-hidden="true" className={frame}>
      <m.svg viewBox="0 0 64 64" className={art}>
        <m.path
          d="M8 46c10-1 18-6 24-14"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="1 5"
          strokeLinecap="round"
          className="text-success-text"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.55, 0] }}
          transition={planeTrailTransition}
        />
        <m.g
          variants={planeFlightVariants}
          initial="waiting"
          animate="flown"
          transition={planeFlightTransition}
        >
          <m.path
            d="M8 32 58 8 38 56 30 38Z"
            {...shield}
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={planeDrawTransition}
          />
          <m.path
            d="M30 38 58 8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={planeDrawTransition}
          />
        </m.g>
        <m.path
          d="M22 34 30 42 46 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-success-text"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={planeCheckTransition}
        />
      </m.svg>
    </div>
  )
}
