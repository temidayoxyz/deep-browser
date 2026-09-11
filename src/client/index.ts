/**
 * Browser half: register `browser` as a right-Sidebar tab type, intercept
 * http(s) clicks into that pane, and own the Plugins settings card.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'
import {
  BROWSER_SETTINGS_NAMESPACE, DEFAULT_LINK_INTERCEPT, DEFAULT_WIDTH,
  DEFAULT_WIDTH_FIELD, LINK_INTERCEPT_FIELD,
  type BrowserSettings,
} from '../settings.ts'
import { BROWSER_ID, browserDefinition } from './definition.tsx'
import { BrowserBody } from './BrowserBody.tsx'
import { BrowserTitle } from './BrowserTitle.tsx'
import { interceptHttpLinks } from './intercept.ts'
import { en, zh } from './locales.ts'
import {
  createSettingsCardStore, SettingsCard,
  type SettingsCardBound, type SettingsCardInjected,
} from './SettingsCard.tsx'
import { createBrowserStore } from './store.ts'

/** This package's copy namespace. */
const NS = 'deepBrowser'

/**
 * Required browser services: the tab registry, the keyed seat, navigation,
 * copy, and the settings transport the card and the behavior read.
 */
export const inject = ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight', 'remote', 'settingsScope']

/**
 * Client plugin body: register the type, dictionaries, body, title, link
 * intercept, and the Plugins settings card.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.sidebarRightTabs.register(browserDefinition(t)), 'deep-browser: type')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'deep-browser: dictionaries')

  const scope: SettingsScope<BrowserSettings> = ctx.settingsScope.bind({ namespace: BROWSER_SETTINGS_NAMESPACE })
  const readSection = (): BrowserSettings | undefined => scope.getSnapshot().value

  const store = createBrowserStore(() => readSection()?.defaultWidth ?? DEFAULT_WIDTH)
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab', key: BROWSER_ID, locale: NS, store },
    BrowserBody,
  )), 'deep-browser: tab body')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab.title', key: BROWSER_ID },
    BrowserTitle,
  )), 'deep-browser: tab title')
  ctx.effect(() => interceptHttpLinks(
    ctx,
    () => readSection()?.linkIntercept ?? DEFAULT_LINK_INTERCEPT,
  ), 'deep-browser: intercept links')

  const cardStore = createSettingsCardStore()
  let bound: SettingsCardBound | undefined
  const syncCard = (): void => {
    const section = readSection()
    bound?.sync(
      section?.defaultWidth ?? DEFAULT_WIDTH,
      section?.linkIntercept ?? DEFAULT_LINK_INTERCEPT,
      scope.getSnapshot().writable,
    )
  }
  ctx.effect(() => scope.subscribe(syncCard), 'deep-browser: settings card sync')
  const cardInjected = (cardActions: SettingsCardBound): SettingsCardInjected => {
    bound = cardActions
    // Re-sync from the getter so no scope change is lost between registration
    // and first render.
    syncCard()
    return {
      setDefaultWidth: (width) => { void scope.set(DEFAULT_WIDTH_FIELD, width) },
      setLinkIntercept: (next) => { void scope.set(LINK_INTERCEPT_FIELD, next) },
    }
  }
  ctx.effect(() => ctx.slots.inject('settings.plugin.item', () => ctx.slots.register(
    {
      name: 'settings.plugin.item',
      key: BROWSER_SETTINGS_NAMESPACE,
      locale: NS,
      store: cardStore,
      inject: cardInjected,
    },
    SettingsCard,
  )), 'deep-browser: settings card')
}
