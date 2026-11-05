import { expect, test } from 'vitest'

// Throwaway proof that a red test blocks the merge. Never merged.
test('gate proof: this must fail', () => {
  expect(1).toBe(2)
})
