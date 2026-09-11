/**
 * Host-only wire schema for the `deep-browser` settings namespace.
 * Kept out of settings.ts so the browser bundle never pulls schemastery
 * into the module table.
 */
import z from '@deepseek-ai/schemastery'
import {
  BROWSER_WIDTH_PRESETS, DEFAULT_LINK_INTERCEPT, DEFAULT_WIDTH,
  type BrowserSettings,
} from './settings.ts'

/** Durable browser schema; also the wire envelope the browser scope validates against. */
export const BrowserSettingsSchema: z<BrowserSettings> = z.object({
  defaultWidth: z.union([...BROWSER_WIDTH_PRESETS]).default(DEFAULT_WIDTH),
  linkIntercept: z.boolean().default(DEFAULT_LINK_INTERCEPT),
})
