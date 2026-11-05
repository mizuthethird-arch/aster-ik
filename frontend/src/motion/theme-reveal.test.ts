import { describe, expect, it } from 'vitest'
import { themeRevealKeyframes, themeRevealRadius } from './theme-reveal'

describe('theme reveal', () => {
  it('expands to the farthest viewport corner from the toggle', () => {
    expect(themeRevealRadius({ x: 10, y: 10 }, 100, 100)).toBe(128)
    expect(themeRevealRadius({ x: 50, y: 50 }, 100, 100)).toBe(71)
  })

  it('builds a circle clip that starts at the toggle and covers the page', () => {
    const [from, to] = themeRevealKeyframes({ x: 10, y: 10 }, 128)

    expect(from).toBe('circle(0px at 10px 10px)')
    expect(to).toBe('circle(128px at 10px 10px)')
  })
})
