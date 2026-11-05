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

  it('marks the active option pressed and inverts it', () => {
    render(<Harness />)

    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('text-inv-fg')
    expect(screen.getByRole('button', { name: 'B' })).toHaveClass('text-fg')
  })
})
