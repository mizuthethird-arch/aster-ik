import { vi } from 'vitest'

/*
 * jsdom ships no matchMedia, and Motion reads `prefers-reduced-motion` through
 * it. This mock lets a test flip the preference and notifies Motion's listeners
 * the way a browser would.
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type Listener = (event: MediaQueryListEvent) => void

const listeners = new Set<Listener>()
let prefersReducedMotion = false
let coarsePointer = false

export function setPrefersReducedMotion(value: boolean) {
  prefersReducedMotion = value
  const event = { matches: value, media: REDUCED_MOTION_QUERY } as MediaQueryListEvent
  listeners.forEach((listener) => listener(event))
}

export function setCoarsePointer(value: boolean) {
  coarsePointer = value
}

export function resetMatchMedia() {
  prefersReducedMotion = false
  coarsePointer = false
  listeners.clear()
}

export function installMatchMediaMock() {
  window.matchMedia = ((query: string): MediaQueryList => {
    const isReducedMotion = query.includes('prefers-reduced-motion')
    const isFinePointer = query.includes('pointer: fine')
    const isCoarsePointer = query.includes('pointer: coarse')

    return {
      matches: isReducedMotion
        ? prefersReducedMotion
        : isFinePointer
          ? !coarsePointer
          : isCoarsePointer
            ? coarsePointer
            : false,
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
        if (isReducedMotion && typeof listener === 'function') {
          listeners.add(listener as Listener)
        }
      },
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
        if (isReducedMotion && typeof listener === 'function') {
          listeners.delete(listener as Listener)
        }
      },
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList
  }) as typeof window.matchMedia
}
