/**
 * Host half: register the durable `deep-browser` settings namespace so the
 * web settings Plugins tab serves this plugin's card. The tab type,
 * intercept, and pane body live in the browser export.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-settings'
import { BROWSER_SETTINGS_NAMESPACE } from './settings.ts'
import { BrowserSettingsSchema } from './settings-schema.ts'

/**
 * Host plugin body: register the settings section when the optional settings
 * service is composed. Without it the plugin still loads; the card simply
 * has no served namespace to pair with.
 * @param ctx - Host context that may acquire the settings service.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(BROWSER_SETTINGS_NAMESPACE, BrowserSettingsSchema)
  })
}
