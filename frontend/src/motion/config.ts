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
