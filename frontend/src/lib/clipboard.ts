/*
 * Clipboard access in one place, so the UI can confirm or stay quiet without
 * every caller repeating the permission dance.
 */

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    /* No clipboard, permission denied or an insecure context. */
    return false
  }
}
