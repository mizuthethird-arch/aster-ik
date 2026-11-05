import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchPalette } from './SearchPalette'

function renderPalette(open = true) {
  const onClose = vi.fn()
  const view = render(<SearchPalette open={open} onClose={onClose} />)
  return { onClose, ...view }
}

const dialog = () => document.querySelector('dialog') as HTMLDialogElement

describe('SearchPalette', () => {
  it('stays closed until it is opened', () => {
    renderPalette(false)

    expect(dialog().open).toBe(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens, labels itself and focuses the search field', () => {
    renderPalette()

    expect(dialog().open).toBe(true)
    expect(screen.getByRole('dialog', { name: 'Search this page' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search this page' })).toHaveFocus()
  })

  it('lists every section with its anchor', () => {
    renderPalette()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#colour',
      '#typography',
      '#spacing',
      '#radii',
      '#elevation',
      '#layout',
    ])
  })

  it('names each result with its label and note', () => {
    renderPalette()

    expect(
      screen.getByRole('link', { name: 'Spacing: The 1px rhythm and layout sizes' }),
    ).toHaveAttribute('href', '#spacing')
  })

  it('filters case-insensitively on the label', async () => {
    const user = userEvent.setup()
    renderPalette()

    await user.type(screen.getByRole('searchbox'), 'SPA')

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /^Spacing:/ })).toBeInTheDocument()
  })

  it('filters on the description too', async () => {
    const user = userEvent.setup()
    renderPalette()

    await user.type(screen.getByRole('searchbox'), 'shadow')

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /^Elevation:/ })).toBeInTheDocument()
  })

  it('treats a whitespace-only query as empty', async () => {
    const user = userEvent.setup()
    renderPalette()

    await user.type(screen.getByRole('searchbox'), '   ')

    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it('shows an empty state and no results when nothing matches', async () => {
    const user = userEvent.setup()
    renderPalette()

    await user.type(screen.getByRole('searchbox'), 'zzz')

    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(screen.getByText(/No sections match/)).toBeInTheDocument()
  })

  it('restores every result when the query is cleared', async () => {
    const user = userEvent.setup()
    renderPalette()

    const input = screen.getByRole('searchbox')
    await user.type(input, 'zzz')
    await user.clear(input)

    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it('closes when a result is chosen', async () => {
    const user = userEvent.setup()
    const { onClose } = renderPalette()

    await user.click(screen.getByRole('link', { name: /^Typography:/ }))

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when the open prop turns false', () => {
    const { onClose, rerender } = renderPalette(true)

    rerender(<SearchPalette open={false} onClose={onClose} />)

    expect(dialog().open).toBe(false)
    expect(onClose).toHaveBeenCalled()
  })

  it('resets the query when it reopens', async () => {
    const user = userEvent.setup()
    const { onClose, rerender } = renderPalette(true)
    await user.type(screen.getByRole('searchbox'), 'spa')

    rerender(<SearchPalette open={false} onClose={onClose} />)
    rerender(<SearchPalette open={true} onClose={onClose} />)

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getAllByRole('link')).toHaveLength(6)
  })
})
