import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MotionProvider } from '../../motion/MotionProvider'
import { setCoarsePointer, setPrefersReducedMotion } from '../../test/match-media'
import { SearchPalette } from './SearchPalette'

function renderPalette(open = true) {
  const onClose = vi.fn()
  const view = render(
    <MotionProvider>
      <SearchPalette open={open} onClose={onClose} />
    </MotionProvider>,
  )
  const rerenderPalette = (nextOpen: boolean) =>
    view.rerender(
      <MotionProvider>
        <SearchPalette open={nextOpen} onClose={onClose} />
      </MotionProvider>,
    )
  return { onClose, rerenderPalette }
}

/* A stateful parent, so a close request actually flips the open prop. */
function renderInteractivePalette() {
  const onClose = vi.fn()
  function Harness() {
    const [open, setOpen] = useState(true)
    return (
      <MotionProvider>
        <SearchPalette
          open={open}
          onClose={() => {
            onClose()
            setOpen(false)
          }}
        />
      </MotionProvider>
    )
  }
  render(<Harness />)
  return { onClose }
}

const dialog = () => document.querySelector('dialog') as HTMLDialogElement

describe('SearchPalette', () => {
  it('stays closed until it is opened', () => {
    renderPalette(false)

    expect(dialog().open).toBe(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens and labels itself without focusing the search field', () => {
    renderPalette()

    expect(dialog().open).toBe(true)
    expect(screen.getByRole('dialog', { name: 'Search this page' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search this page' })).not.toHaveFocus()
    expect(dialog()).toHaveFocus()
  })

  it('animates the field focus ring instead of snapping it on', () => {
    renderPalette()

    const input = screen.getByRole('searchbox')
    expect(input).toHaveClass('field-focus', 'border', 'border-transparent')
  })
  it('moves focus into the field on the first Tab', async () => {
    const user = userEvent.setup()
    renderPalette()
    expect(dialog()).toHaveFocus()

    await user.tab()

    expect(screen.getByRole('searchbox')).toHaveFocus()
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
    const { onClose } = renderInteractivePalette()

    await user.click(screen.getByRole('link', { name: /^Typography:/ }))

    expect(onClose).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(dialog().open).toBe(false), { timeout: 3000 })
  })

  it('keeps the dialog open while the panel animates out', async () => {
    const { rerenderPalette } = renderPalette(true)

    rerenderPalette(false)

    // The exit animation owns the close: the dialog is still open right after
    // the parent flips the prop.
    expect(dialog().open).toBe(true)
    await waitFor(() => expect(dialog().open).toBe(false), { timeout: 3000 })
  })

  it('keeps focus out of the field on touch devices, so opening never zooms', () => {
    setCoarsePointer(true)
    renderPalette()

    expect(screen.getByRole('searchbox')).not.toHaveFocus()
    expect(dialog()).toHaveFocus()
  })
  it('locks the page scroll while the dialog is open', async () => {
    const user = userEvent.setup()
    renderInteractivePalette()

    expect(document.documentElement).toHaveAttribute('data-scroll-locked')

    await user.click(screen.getByRole('link', { name: /^Typography:/ }))
    await waitFor(() => expect(dialog().open).toBe(false), { timeout: 3000 })

    expect(document.documentElement).not.toHaveAttribute('data-scroll-locked')
  })

  it('keeps the results area at one fixed height in every state', async () => {
    const user = userEvent.setup()
    renderPalette()
    const region = () => document.querySelector('dialog .h-dialog-list') as HTMLElement | null

    expect(region()).toBeInTheDocument()
    expect(region()).toHaveClass('overflow-y-auto', 'scroll-gutter-stable')
    expect(within(region()!).getAllByRole('link')).toHaveLength(6)

    await user.type(screen.getByRole('searchbox'), 'zzz')

    expect(region()).toBeInTheDocument()
    expect(within(region()!).getByText(/No sections match/)).toBeInTheDocument()
  })

  it('rounds the search field so the focus ring follows the input radius', () => {
    renderPalette()

    expect(screen.getByRole('searchbox')).toHaveClass('rounded-input')
  })
  it('closes instantly when motion is reduced', () => {
    setPrefersReducedMotion(true)
    const { rerenderPalette } = renderPalette(true)

    rerenderPalette(false)

    expect(dialog().open).toBe(false)
  })

  it('closes when the backdrop is clicked', async () => {
    const { onClose } = renderInteractivePalette()

    fireEvent.click(dialog())

    expect(onClose).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(dialog().open).toBe(false), { timeout: 3000 })
  })

  it('stays open when the panel itself is clicked', () => {
    const { onClose } = renderInteractivePalette()

    fireEvent.click(screen.getByRole('searchbox'))
    fireEvent.click(document.querySelector('dialog ul') as HTMLUListElement)

    expect(onClose).not.toHaveBeenCalled()
    expect(dialog().open).toBe(true)
  })

  it('animates out when cancelled with Escape', async () => {
    const { onClose } = renderInteractivePalette()
    const dialogEl = dialog()

    fireEvent(dialogEl, new Event('cancel', { cancelable: true }))

    expect(onClose).toHaveBeenCalledTimes(1)
    // The handler keeps the dialog open so the panel can animate out.
    expect(dialogEl.open).toBe(true)
    await waitFor(() => expect(dialogEl.open).toBe(false), { timeout: 3000 })
  })

  it('closes on Escape even while the query field has text', async () => {
    const user = userEvent.setup()
    const { onClose } = renderInteractivePalette()
    const input = screen.getByRole('searchbox')
    await user.type(input, 'zzz')

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(dialog().open).toBe(false), { timeout: 3000 })
  })
  it('starts from an empty query each time it opens', async () => {
    const user = userEvent.setup()
    const { rerenderPalette } = renderPalette(true)
    await user.type(screen.getByRole('searchbox'), 'spa')

    rerenderPalette(false)
    await waitFor(() => expect(dialog().open).toBe(false), { timeout: 3000 })
    rerenderPalette(true)

    await waitFor(() => expect(screen.getByRole('searchbox')).toHaveValue(''))
    expect(screen.getAllByRole('link')).toHaveLength(6)
  })
})
