/**
 * Capture-phase click handler: http(s) links in the Web UI open in this pane.
 * Modifier-click, middle-click, already-handled clicks, and downloads stay native.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import { isHttpUrl, pageResourceAddress } from './address.ts'

/**
 * Install the document click intercept.
 * @param ctx - client root; `sidebarRight` is read at click time so a missing
 *   session surface falls back to the system browser.
 * @returns disposer.
 */
export function interceptHttpLinks(ctx: Context): () => void {
  const onClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const path = event.composedPath()
    const anchor = path.find((node): node is HTMLAnchorElement =>
      node instanceof HTMLAnchorElement && node.hasAttribute('href'))
    if (anchor === undefined || anchor.hasAttribute('download')) return
    if (anchor.closest('[data-deep-browser]') !== null) return
    const href = anchor.href
    if (!isHttpUrl(href)) return
    event.preventDefault()
    try {
      ctx.sidebarRight.openResource(pageResourceAddress(href))
    }
    catch {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }
  document.addEventListener('click', onClick, true)
  return () => { document.removeEventListener('click', onClick, true) }
}
