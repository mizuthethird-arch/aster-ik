import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Mark } from './Mark'

describe('Mark', () => {
  it('renders as decoration, never as the accessible name', () => {
    const { container } = render(<Mark className="h-28 w-auto" />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(svg).toHaveAttribute('viewBox', '0 0 168 64')
    expect(svg).toHaveClass('h-28', 'w-auto')
  })

  it('draws the iris circle, the themable square and three aqua bars', () => {
    const { container } = render(<Mark />)

    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('fill', 'var(--aster-ik-brand-iris)')

    const square = container.querySelector('rect')
    expect(square).toHaveAttribute('fill', 'var(--aster-ik-brand-mark-square)')

    const bars = [...container.querySelectorAll('g rect')]
    expect(bars).toHaveLength(3)
    expect(container.querySelector('g')).toHaveAttribute('fill', 'var(--aster-ik-brand-aqua)')
  })
})
