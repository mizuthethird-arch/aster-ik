/*
 * Motion system — Apple-style: short durations, ease-out curves, springs only
 * for the small icon swaps. These are the only motion values in the app; the
 * CSS durations in tokens.css stay for colour and border transitions.
 */

/** Apple's sheet ease-out. Fast start, long settle, no overshoot. */
export const appleEase: [number, number, number, number] = [0.32, 0.72, 0, 1]

/** The same curve as a CSS easing string for the View Transition animation. */
export const appleEaseCss = `cubic-bezier(${appleEase.join(', ')})`

export const menuTransition = { duration: 0.32, ease: appleEase }
export const menuExitTransition = {
  duration: 0.2,
  ease: [0.4, 0, 1, 1] as [number, number, number, number],
}
export const menuIconTransition = { duration: 0.22, ease: appleEase }
export const dialogTransition = { duration: 0.24, ease: appleEase }
export const dialogExitTransition = {
  duration: 0.18,
  ease: [0.4, 0, 1, 1] as [number, number, number, number],
}
export const themeRevealTransition = { duration: 0.55, ease: appleEase }

/*
 * The dialog panel only scales inward and fades. It must never translate: a
 * transformed panel that overhangs the native <dialog> makes the dialog's own
 * overflow area scrollable, which flashes its scrollbar for a frame on open
 * and close.
 */
export const dialogPanelVariants = {
  hidden: { opacity: 0, scale: 0.97, transition: dialogExitTransition },
  visible: { opacity: 1, scale: 1, transition: dialogTransition },
}
/* Success micro-animations: a padlock opening and a paper plane taking off.
   Body/ring settle in ~0.42s; the shackle lifts and swings on its hinge slightly
   later; the plane draws itself and then flies out along its trail. */
/* Account success choreography: the celebration holds for at least a second,
   then a loading beat, then the card returns to its form so it can be retried. */
export const successCelebrateMs = 1400
export const successPlaneCelebrateMs = 2400
export const successLoadingMs = 1600
export const lockTransition = { duration: 0.42, ease: appleEase }
export const lockShackleTransition = { duration: 0.45, ease: appleEase, delay: 0.12 }
export const lockBodyVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}
export const lockRingVariants = {
  hidden: { opacity: 0, scale: 0.72 },
  visible: { opacity: 0.35, scale: 1 },
}
export const lockShackleVariants = {
  locked: { y: 0, rotate: 0 },
  open: { y: -3, rotate: -14 },
}
export const planeDrawTransition = { duration: 1.1, ease: 'linear' as const }
export const planeFlightTransition = { duration: 0.55, ease: appleEase, delay: 1.15 }
export const planeTrailTransition = { duration: 0.6, ease: appleEase, delay: 1.15 }
export const planeCheckTransition = { duration: 0.3, ease: appleEase, delay: 1.8 }
export const planeFlightVariants = {
  waiting: { x: 0, y: 0, rotate: 0, opacity: 1 },
  flown: { x: 34, y: -26, rotate: -14, opacity: 0 },
}
export const toastTransition = { duration: 0.18, ease: appleEase }
export const toastExitTransition = { duration: 0.12, ease: appleEase }
export const toastVariants = {
  hidden: { opacity: 0, y: 8, transition: toastExitTransition },
  visible: { opacity: 1, y: 0, transition: toastTransition },
}
/* Swapping one state for another inside a fixed-height slot (password field ↔
   magic-link note): the old content fades and rises out, the new content fades
   and rises in. Height is reserved outside, so the card never resizes. */
export const fieldSwapTransition = { duration: 0.2, ease: appleEase }
export const fieldSwapExitTransition = {
  duration: 0.14,
  ease: [0.4, 0, 1, 1] as [number, number, number, number],
}
export const fieldSwapVariants = {
  hidden: { opacity: 0, y: 6, transition: fieldSwapExitTransition },
  visible: { opacity: 1, y: 0, transition: fieldSwapTransition },
}
export const iconSpring = { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.7 }

/*
 * The menu button is two lines that morph into the X: the top line rotates 45°
 * and shifts down to the centre, the bottom line mirrors it. Same nodes, so
 * nothing swaps or remounts mid-press.
 */
export const menuIconLines = {
  top: { closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 3 } },
  bottom: { closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -3 } },
}
