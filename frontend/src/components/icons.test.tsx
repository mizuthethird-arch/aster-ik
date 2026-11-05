import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CloseIcon, GitHubIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './icons'

const lineIcons = [
  ['search', SearchIcon],
  ['sun', SunIcon],
  ['moon', MoonIcon],
  ['menu', MenuIcon],
  ['close', CloseIcon],
] as const

describe('icons', () => {
  it.each(lineIcons)('draws the %s icon as a 2px currentColor line glyph', (_name, Icon) => {
    const { container } = render(<Icon className="size-20" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('stroke-width', '2')
    expect(svg).toHaveAttribute('stroke-linecap', 'round')
    expect(svg).toHaveAttribute('stroke-linejoin', 'round')
    expect(svg).toHaveClass('size-20')
  })

  it('draws the GitHub mark as the one filled glyph', () => {
    const { container } = render(<GitHubIcon className="size-20" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).not.toHaveAttribute('stroke')
    expect(container.querySelector('path')).toBeInTheDocument()
  })
})
