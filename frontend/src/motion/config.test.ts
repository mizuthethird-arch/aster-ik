import { describe, expect, it } from 'vitest'
import {
  appleEase,
  iconSpring,
  menuExitTransition,
  menuTransition,
  themeTransition,
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

  it('keeps every duration in the 150–400ms band', () => {
    for (const transition of [menuTransition, menuExitTransition, themeTransition]) {
      expect(transition.duration).toBeGreaterThanOrEqual(0.15)
      expect(transition.duration).toBeLessThanOrEqual(0.4)
    }
  })

  it('exits faster than it enters', () => {
    expect(menuExitTransition.duration).toBeLessThan(menuTransition.duration)
  })

  it('swaps the theme icon on a spring, not a tween', () => {
    expect(iconSpring.type).toBe('spring')
    expect(iconSpring.stiffness).toBeGreaterThan(0)
    expect(iconSpring.damping).toBeGreaterThan(0)
  })
})
