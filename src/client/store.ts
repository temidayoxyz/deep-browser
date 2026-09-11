/**
 * Per-tab viewing state that must survive the body unmounting when the user
 * switches tabs: the page-width preset.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit'

/** Iframe layout width: the pane, or a fixed CSS pixel viewport. */
export type BrowserWidth = 'fit' | '390' | '768'

/** One tab's retained viewing state. */
export interface BrowserTabState {
  /** Layout width applied to the iframe. */
  width: BrowserWidth
}

/** Every tab's viewing state, keyed by tab id. */
export interface BrowserState {
  byTab: Record<TabId, BrowserTabState>
}

/** The store's write set. */
type BrowserActions = {
  start: (draft: BrowserState, tabId: TabId) => void
  setWidth: (draft: BrowserState, tabId: TabId, width: BrowserWidth) => void
  forget: (draft: BrowserState, tabId: TabId) => void
}

/**
 * Declare the browser pane's store.
 * @returns the store handle to declare on the registration.
 */
export function createBrowserStore(): EngineStoreHandle<BrowserState, BrowserActions> {
  return defineStore({
    init: (): BrowserState => ({ byTab: {} }),
    actions: {
      /**
       * Seed one tab at the default width if it has no bucket yet.
       * @param d - draft state.
       * @param tabId - the tab being drawn.
       */
      start: (d, tabId: TabId) => {
        if (d.byTab[tabId] === undefined) d.byTab[tabId] = { width: 'fit' }
      },
      /**
       * Record the width preset for one tab.
       * @param d - draft state.
       * @param tabId - the tab being drawn.
       * @param width - layout width.
       */
      setWidth: (d, tabId: TabId, width: BrowserWidth) => {
        const tab = d.byTab[tabId]
        if (tab === undefined) d.byTab[tabId] = { width }
        else tab.width = width
      },
      /**
       * Forget one tab's viewing state when its record is gone.
       * @param d - draft state.
       * @param tabId - the tab that went away.
       */
      forget: (d, tabId: TabId) => {
        delete d.byTab[tabId]
      },
    },
  })
}
