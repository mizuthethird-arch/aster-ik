/*
 * Motion system — Apple-style: short durations, ease-out curves, springs only
 * for the small icon swap. These are the only motion values in the app; the CSS
 * durations in tokens.css stay for colour and border transitions.
 */

/** Apple's sheet ease-out. Fast start, long settle, no overshoot. */
export const appleEase: [number, number, number, number] = [0.32, 0.72, 0, 1]

export const menuTransition = { duration: 0.32, ease: appleEase }
export const menuExitTransition = {
  duration: 0.2,
  ease: [0.4, 0, 1, 1] as [number, number, number, number],
}
export const themeTransition = { duration: 0.3, ease: appleEase }
export const iconSpring = { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.7 }
