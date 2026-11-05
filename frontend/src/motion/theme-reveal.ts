import { appleEaseCss, themeRevealTransition } from './config'

export type RevealOrigin = { x: number; y: number }

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> }
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike
}

/** Distance from the toggle to the farthest viewport corner. */
export function themeRevealRadius(origin: RevealOrigin, width: number, height: number) {
  const horizontal = Math.max(origin.x, width - origin.x)
  const vertical = Math.max(origin.y, height - origin.y)
  return Math.ceil(Math.hypot(horizontal, vertical))
}

export function themeRevealKeyframes(origin: RevealOrigin, radius: number): [string, string] {
  return [
    `circle(0px at ${origin.x}px ${origin.y}px)`,
    `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
  ]
}

/*
 * Swap the theme inside a View Transition and clip the new snapshot in from the
 * toggle: the next theme grows out of the button and covers the page. Falls back
 * to an instant switch when the browser has no View Transitions or the reader
 * prefers reduced motion.
 */
export function startThemeReveal(update: () => void, origin: RevealOrigin, reducedMotion: boolean) {
  const withViewTransition = (document as ViewTransitionDocument).startViewTransition

  if (reducedMotion || typeof withViewTransition !== 'function') {
    update()
    return
  }

  const radius = themeRevealRadius(origin, window.innerWidth, window.innerHeight)
  const transition = withViewTransition.call(document, update)

  transition.ready
    .then(() => {
      const root = document.documentElement
      if (typeof root.animate !== 'function') return
      const keyframes = themeRevealKeyframes(origin, radius).map((clipPath) => ({ clipPath }))
      root.animate(keyframes, {
        duration: themeRevealTransition.duration * 1000,
        easing: appleEaseCss,
        pseudoElement: '::view-transition-new(root)',
      })
    })
    .catch(() => {
      /* The transition was skipped by the browser; the theme update stands. */
    })
}
