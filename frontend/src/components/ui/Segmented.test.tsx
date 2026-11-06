import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Segmented } from './Segmented'

type View = 'a' | 'b'

function Harness() {
  const [value, setValue] = useState<View>('a')

  return (
    <Segmented
      label="View"
      options={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}

describe('Segmented', () => {
  it('slides one shared indicator instead of swapping two backgrounds', async () => {
    const user = userEvent.setup()
    const { container } = render(<Harness />)

    const indicators = container.querySelectorAll('[data-segmented-indicator]')
    expect(indicators).toHaveLength(1)
    expect(
      container.querySelector<HTMLElement>('[data-segmented-indicator]')?.style.transform,
    ).toBe('translateX(0%)')

    await user.click(screen.getByRole('button', { name: 'B' }))

    expect(
      container.querySelector<HTMLElement>('[data-segmented-indicator]')?.style.transform,
    ).toBe('translateX(100%)')
  })

  it('paints labels twice and clips the inverted copy to the pill', () => {
    const { container } = render(<Harness />)

    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')

    const labels = container.querySelectorAll('.blend-label')
    expect(labels).toHaveLength(2)
    expect(labels[0]).toHaveClass('blend-label')

    const inverseLabels = container.querySelectorAll('.blend-label-inverse')
    expect(inverseLabels).toHaveLength(2)

    const inverse = container.querySelector<HTMLElement>('[data-segmented-inverse]')
    expect(inverse).not.toBeNull()
    // The inverted layer is clipped to the pill; no blend mode is involved.
    expect(inverse?.getAttribute('style')).toContain('clip-path')
  })

  it('moves the label clip with the pill instead of re-colouring the text', async () => {
    const user = userEvent.setup()
    const { container } = render(<Harness />)

    const clip = () =>
      container.querySelector<HTMLElement>('[data-segmented-inverse]')?.getAttribute('style')
    const before = clip()

    await user.click(screen.getByRole('button', { name: 'B' }))

    const after = clip()
    expect(after).not.toBe(before)
    expect(after).toContain('* 2')
  })
})
