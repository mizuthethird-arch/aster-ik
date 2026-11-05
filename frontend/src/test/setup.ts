import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { installMatchMediaMock, resetMatchMedia } from './match-media'

installMatchMediaMock()

afterEach(() => {
  cleanup()
  resetMatchMedia()
  document.documentElement.removeAttribute('data-theme')
})

/*
 * jsdom does not implement the dialog modal methods. These tests cover the
 * component contract, not the browser's modal machinery, so the minimum
 * open/close behaviour is polyfilled here. Real modal behaviour (focus trap,
 * inert background, Escape) is verified in the browser render, not here.
 */
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
    /* Browsers move focus to the autofocus element, else the first focusable one. */
    const target = this.querySelector<HTMLElement>(
      '[autofocus], input, button, a[href], select, textarea, [tabindex]',
    )
    target?.focus()
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
