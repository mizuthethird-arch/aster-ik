import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setPrefersReducedMotion } from '../test/match-media'
import { usePrefersReducedMotion } from './use-prefers-reduced-motion'

describe('usePrefersReducedMotion', () => {
  it('reads the preference on first render', () => {
    setPrefersReducedMotion(true)

    const { result } = renderHook(() => usePrefersReducedMotion())

    expect(result.current).toBe(true)
  })

  it('follows a preference change at runtime', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)

    act(() => setPrefersReducedMotion(true))

    expect(result.current).toBe(true)
  })
})
