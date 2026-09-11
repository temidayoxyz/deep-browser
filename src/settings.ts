/**
 * Durable settings shared by the Host registration and the browser card.
 * Deliberately dependency-free so the browser bundle can inline it without
 * touching the module table. The wire schema lives in settings-schema.ts
 * (Host only).
 */

/** Settings namespace owned by this plugin (Host registration + card key). */
export const BROWSER_SETTINGS_NAMESPACE = 'deep-browser'

/** Page-width presets a new tab may start with. */
export const BROWSER_WIDTH_PRESETS = ['fit', '390', '768'] as const

/** Page-width preset value. */
export type BrowserWidthSetting = typeof BROWSER_WIDTH_PRESETS[number]

/** Field carrying the default page width for new tabs. */
export const DEFAULT_WIDTH_FIELD = 'defaultWidth'

/** Field carrying whether plain-clicking links opens them beside the conversation. */
export const LINK_INTERCEPT_FIELD = 'linkIntercept'

/** Default page width for new tabs. */
export const DEFAULT_WIDTH: BrowserWidthSetting = 'fit'

/** Whether plain-clicking links opens them beside the conversation. */
export const DEFAULT_LINK_INTERCEPT = true

/** Durable browser section shared by the Host schema and the browser scope. */
export interface BrowserSettings {
  /** Default page width for new tabs. */
  defaultWidth: BrowserWidthSetting
  /** Whether plain-clicking links opens them beside the conversation. */
  linkIntercept: boolean
}

/**
 * Narrow one wire or scope value to a width preset.
 * @param value - value crossing the settings boundary.
 * @returns whether the value is a known preset.
 */
export function isBrowserWidthSetting(value: unknown): value is BrowserWidthSetting {
  return (BROWSER_WIDTH_PRESETS as readonly unknown[]).includes(value)
}
