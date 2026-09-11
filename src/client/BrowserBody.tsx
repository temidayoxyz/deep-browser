/**
 * Browser pane body: address bar, reload, open-external, width presets, iframe.
 *
 * Live http(s) URLs load in a nested browsing context (their own origin).
 * There is no cookie/cache/zoom/annotate chrome: those need a browsing engine
 * the web profile does not give a plugin.
 */
import { useEffect, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import {
  Button,
  IconLinkOutline16,
  IconPlusOutline16,
  IconRefreshOutline16,
  Input,
  Pill,
  Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { BROWSER_KIND } from './definition.tsx'
import { normalizeInput, pageResourceAddress, urlFromAddress } from './address.ts'
import type {} from './locales.ts'
import type { BrowserWidth, createBrowserStore } from './store.ts'
import css from './BrowserBody.module.css'

/** The body's composed props. */
export type BrowserBodyProps =
  & PropsRuntime<'sidebar.right.pane.tab'>
  & PropsStore<ReturnType<typeof createBrowserStore>>
  & PropsLocale<'deepBrowser'>

const WIDTHS: readonly BrowserWidth[] = ['fit', '390', '768']

/**
 * Open a URL in the user's system browser.
 * @param url - absolute http(s) URL.
 */
function openExternal(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * The pane: chrome, empty landing, or the framed page.
 */
export function BrowserBody({
  useTabInfo, useStore, actions, t,
}: BrowserBodyProps): ReactNode {
  const { tab } = useTabInfo()
  const url = urlFromAddress(tab.navigation.address)
  const width = useStore(store => store.byTab[tab.id]?.width) ?? 'fit'
  const [draft, setDraft] = useState(url ?? '')
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    if (!tab.signal.aborted) actions.start(tab.id)
    const forget = (): void => { actions.forget(tab.id) }
    tab.signal.addEventListener('abort', forget, { once: true })
    return () => { tab.signal.removeEventListener('abort', forget) }
  }, [actions, tab.id, tab.signal])

  useEffect(() => {
    setDraft(url ?? '')
    setGeneration(0)
  }, [url, tab.navigation.revision])

  const go = (raw: string): void => {
    const next = normalizeInput(raw)
    if (next === undefined) return
    if (next === url) {
      setGeneration(value => value + 1)
      return
    }
    tab.actions.openResource(pageResourceAddress(next), { replaceTab: true })
  }

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault()
    go(draft)
  }

  const onAddressKey = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') setDraft(url ?? '')
  }

  const widthLabel = (value: BrowserWidth): string => {
    if (value === 'fit') return t('width.fit')
    if (value === '390') return t('width.phone')
    return t('width.tablet')
  }

  return (
    <div className={css.root} data-deep-browser="">
      <div className={css.header}>
        <Tooltip label={t('newTab')} side="bottom">
          <Button
            variant="toolbar"
            size="sm"
            aria-label={t('newTab')}
            icon={<IconPlusOutline16 />}
            onClick={() => { tab.actions.openTab(BROWSER_KIND, { revealIfOpened: false }) }}
          />
        </Tooltip>
        <form className={css.address} onSubmit={onSubmit}>
          <Input
            className={css.addressField}
            aria-label={t('address.label')}
            placeholder={t('address.placeholder')}
            value={draft}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            onChange={event => { setDraft(event.currentTarget.value) }}
            onKeyDown={onAddressKey}
            onBlur={() => { if (draft.trim() === '') setDraft(url ?? '') }}
          />
        </form>
        <Tooltip label={t('reload')} side="bottom">
          <Button
            variant="toolbar"
            size="sm"
            aria-label={t('reload')}
            disabled={url === undefined}
            icon={<IconRefreshOutline16 />}
            onClick={() => { setGeneration(value => value + 1) }}
          />
        </Tooltip>
        <Tooltip label={t('openExternal')} side="bottom">
          <Button
            variant="toolbar"
            size="sm"
            aria-label={t('openExternal')}
            disabled={url === undefined}
            icon={<IconLinkOutline16 />}
            onClick={() => { if (url !== undefined) openExternal(url) }}
          />
        </Tooltip>
        <div className={css.widths} role="group" aria-label={t('width.group')}>
          {WIDTHS.map(value => (
            <Pill
              key={value}
              active={width === value}
              aria-pressed={width === value}
              onClick={() => { actions.setWidth(tab.id, value) }}
            >
              {widthLabel(value)}
            </Pill>
          ))}
        </div>
      </div>
      {url === undefined
        ? <p className={css.empty}>{t('empty')}</p>
        : (
            <div className={css.stage}>
              <iframe
                key={`${url}#${String(generation)}`}
                className={css.frame}
                data-width={width}
                src={url}
                title={t('frame.title')}
                referrerPolicy="no-referrer"
                allow="fullscreen"
              />
            </div>
          )}
    </div>
  )
}
