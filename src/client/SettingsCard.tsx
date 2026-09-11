/**
 * Card chrome for the Plugins settings tab. The tab dispatches this card when
 * the Host serves the `deep-browser` namespace; the card owns everything
 * inside it and writes through the bound settings scope.
 */
import type { ReactNode } from 'react'
import { Pill } from '@deepseek-ai/dsh-client-ui-primitives'
import type {
  BoundActions, PropsLocale, PropsRuntime, PropsStore,
} from '@deepseek-ai/dsh-client-ui-slots'
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'
import {
  BROWSER_WIDTH_PRESETS, DEFAULT_LINK_INTERCEPT, DEFAULT_WIDTH,
  type BrowserWidthSetting,
} from '../settings.ts'
import type {} from './locales.ts'
import css from './SettingsCard.module.css'

/** Card state mirrored from the settings scope snapshot. */
export interface SettingsCardState {
  /** Default page width new tabs start with. */
  defaultWidth: BrowserWidthSetting
  /** Whether plain-clicking links opens them beside the conversation. */
  linkIntercept: boolean
  /** Whether the Host document accepts writes; memory mode never does. */
  writable: boolean
}

/** The card's write surface: one settings write per control. */
export type SettingsCardInjected = {
  /** Persist the default page width for new tabs. */
  setDefaultWidth: (width: BrowserWidthSetting) => void
  /** Persist whether plain-clicking links opens them beside the conversation. */
  setLinkIntercept: (next: boolean) => void
}

/** Declared action shape giving the exported factory a stable return type. */
type SettingsCardActions = {
  sync: (
    draft: SettingsCardState,
    defaultWidth: BrowserWidthSetting,
    linkIntercept: boolean,
    writable: boolean,
  ) => void
}

/**
 * Declare the card's mirror of the settings scope.
 * @returns the store handle to declare on the slot registration.
 */
export function createSettingsCardStore(): EngineStoreHandle<SettingsCardState, SettingsCardActions> {
  return defineStore({
    init: (): SettingsCardState => ({
      defaultWidth: DEFAULT_WIDTH,
      linkIntercept: DEFAULT_LINK_INTERCEPT,
      writable: false,
    }),
    actions: {
      sync: (d, defaultWidth, linkIntercept, writable) => {
        d.defaultWidth = defaultWidth
        d.linkIntercept = linkIntercept
        d.writable = writable
      },
    },
  })
}

/** The card's composed props. */
export type SettingsCardProps =
  & PropsRuntime<'settings.plugin.item'>
  & PropsStore<ReturnType<typeof createSettingsCardStore>>
  & PropsLocale<'deepBrowser'>
  & { actions: SettingsCardInjected }

/**
 * Render the Deep Browser card: title, what the plugin does, and its two
 * settings — the default width for new tabs and the link intercept.
 */
export function SettingsCard({ actions, t, useStore }: SettingsCardProps): ReactNode {
  const state = useStore(snapshot => snapshot)
  const disabled = !state.writable
  const widthLabel = (value: BrowserWidthSetting): string => {
    if (value === 'fit') return t('width.fit')
    if (value === '390') return t('width.phone')
    return t('width.tablet')
  }
  return (
    <section className={css.card} aria-label={t('settings.title')}>
      <h3 className={css.title}>{t('settings.title')}</h3>
      <p className={css.description}>{t('settings.description')}</p>
      <div className={css.row} role="group" aria-label={t('settings.defaultWidth')}>
        <span className={css.label}>{t('settings.defaultWidth')}</span>
        <div className={css.widths}>
          {BROWSER_WIDTH_PRESETS.map(value => (
            <Pill
              key={value}
              active={state.defaultWidth === value}
              aria-pressed={state.defaultWidth === value}
              disabled={disabled}
              onClick={() => { actions.setDefaultWidth(value) }}
            >
              {widthLabel(value)}
            </Pill>
          ))}
        </div>
      </div>
      <label className={css.row}>
        <input
          type="checkbox"
          className={css.check}
          checked={state.linkIntercept}
          disabled={disabled}
          onChange={event => { actions.setLinkIntercept(event.currentTarget.checked) }}
        />
        <span className={css.checkBody}>
          <span className={css.label}>{t('settings.linkIntercept')}</span>
          <span className={css.hint}>{t('settings.linkInterceptHint')}</span>
        </span>
      </label>
    </section>
  )
}

/** Bound store actions, for the apply-world registration. */
export type SettingsCardBound = BoundActions<ReturnType<typeof createSettingsCardStore>>
