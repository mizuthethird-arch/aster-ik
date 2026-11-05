import { useSyncExternalStore } from 'react'

/*
 * The reader's motion preference, read straight from the media query. Motion's
 * own `useReducedMotion` caches its first read, which makes a runtime change —
 * and the test that flips it — unreliable, so the app owns this subscription.
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
