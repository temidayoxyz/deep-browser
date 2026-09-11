/**
 * Browser half: register `browser` as a right-Sidebar tab type and intercept
 * http(s) clicks into that pane.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import { BROWSER_ID, browserDefinition } from './definition.tsx'
import { BrowserBody } from './BrowserBody.tsx'
import { BrowserTitle } from './BrowserTitle.tsx'
import { interceptHttpLinks } from './intercept.ts'
import { en, zh } from './locales.ts'
import { createBrowserStore } from './store.ts'

/** This package's copy namespace. */
const NS = 'deepBrowser'

/**
 * Required browser services: the tab registry, the keyed seat, navigation, and copy.
 */
export const inject = ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight']

/**
 * Client plugin body: register the type, dictionaries, body, title, and link intercept.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.sidebarRightTabs.register(browserDefinition(t)), 'deep-browser: type')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'deep-browser: dictionaries')

  const store = createBrowserStore()
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab', key: BROWSER_ID, locale: NS, store },
    BrowserBody,
  )), 'deep-browser: tab body')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab.title', key: BROWSER_ID },
    BrowserTitle,
  )), 'deep-browser: tab title')
  ctx.effect(() => interceptHttpLinks(ctx), 'deep-browser: intercept links')
}
