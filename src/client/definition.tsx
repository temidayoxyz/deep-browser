/**
 * Stage one: what the `browser` tab type is.
 *
 * A page type for the blank landing tab (guide / New tab), and a resource
 * viewer for `dsh-resource://page/**` so each URL is its own tab.
 */
import type { SidebarRightTabDefinition } from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type { TranslateNS } from '@deepseek-ai/dsh-client-locale/client'
import type {} from './locales.ts'
import { GlobeGlyph } from './icons.tsx'
import { hostnameOf, urlFromAddress } from './address.ts'

/** The tab kind this package owns. */
export const BROWSER_KIND = 'browser'

/** This implementation's identity in the tab system, and the key its body registers under. */
export const BROWSER_ID = 'dsh-deep-browser'

/**
 * The browser type's registry definition.
 * @param t - namespace-bound translate, read fresh on every label call.
 */
export function browserDefinition(t: TranslateNS<'deepBrowser'>): SidebarRightTabDefinition {
  return {
    id: BROWSER_ID,
    kind: BROWSER_KIND,
    patterns: ['dsh-resource://page/**'],
    title: (address) => {
      const url = urlFromAddress(address)
      return url === undefined ? t('type.label') : hostnameOf(url)
    },
    canOpen: (address) => urlFromAddress(address) !== undefined,
    guide: [{
      order: 20,
      title: () => t('guide.title'),
      description: () => t('guide.description'),
      icon: GlobeGlyph,
    }],
  }
}
