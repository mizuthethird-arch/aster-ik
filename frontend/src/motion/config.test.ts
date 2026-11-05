import { describe, expect, it } from 'vitest'
import {
  appleEase,
  dialogExitTransition,
  dialogPanelVariants,
  dialogTransition,
  iconSpring,
  menuExitTransition,
  menuIconLines,
  menuIconTransition,
  menuTransition,
  themeRevealTransition,
} from './config'

const asNumbers = (ease: readonly number[]) => [...ease]

describe('motion config', () => {
  it('uses a short, ease-out Apple curve for the menu and the theme', () => {
    expect(asNumbers(appleEase)).toHaveLength(4)

    for (const value of appleEase) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }

    // An ease-out bezier leaves the first control point faster than it starts.
    expect(appleEase[1]).toBeGreaterThan(appleEase[0])
  })

  it('keeps the menu and dialog durations in the 150–400ms band', () => {
    for (const transition of [
      menuTransition,
      menuExitTransition,
      menuIconTransition,
      dialogTransition,
      dialogExitTransition,
    ]) {
      expect(transition.duration).toBeGreaterThanOrEqual(0.15)
      expect(transition.duration).toBeLessThanOrEqual(0.4)
    }
  })

  it('gives the theme reveal a longer, still brief duration', () => {
    expect(themeRevealTransition.duration).toBeGreaterThanOrEqual(0.4)
    expect(themeRevealTransition.duration).toBeLessThanOrEqual(0.7)
  })

  it('exits faster than it enters', () => {
    expect(menuExitTransition.duration).toBeLessThan(menuTransition.duration)
    expect(dialogExitTransition.duration).toBeLessThan(dialogTransition.duration)
  })

  it('swaps the theme icon on a spring, not a tween', () => {
    expect(iconSpring.type).toBe('spring')
    expect(iconSpring.stiffness).toBeGreaterThan(0)
    expect(iconSpring.damping).toBeGreaterThan(0)
  })

  it('morphs the menu button lines instead of swapping icons', () => {
    expect(menuIconLines.top.closed).toEqual({ rotate: 0, y: 0 })
    expect(menuIconLines.top.open).toEqual({ rotate: 45, y: 3 })
    expect(menuIconLines.bottom.closed).toEqual({ rotate: 0, y: 0 })
    expect(menuIconLines.bottom.open).toEqual({ rotate: -45, y: -3 })
  })
  it('scales the dialog panel inward without translating it into a scrollbar', () => {
    expect(dialogPanelVariants.hidden).toMatchObject({ opacity: 0 })
    expect(dialogPanelVariants.visible).toMatchObject({ opacity: 1, scale: 1 })
    expect(dialogPanelVariants.hidden.scale).toBeLessThan(1)

    // A vertical translate makes the transformed panel overflow the dialog,
    // which flashes the dialog's own scrollbar on open and close.
    expect('y' in dialogPanelVariants.hidden).toBe(false)
    expect('y' in dialogPanelVariants.visible).toBe(false)
  })
})
