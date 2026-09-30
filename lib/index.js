import z from "@deepseek-ai/schemastery";

//#region src/settings.ts
/**
* Durable settings shared by the Host registration and the browser card.
* Deliberately dependency-free so the browser bundle can inline it without
* touching the module table. The wire schema lives in settings-schema.ts
* (Host only).
*/
/** Settings namespace owned by this plugin (Host registration + card key). */
const BROWSER_SETTINGS_NAMESPACE = "deep-browser";
/** Page-width presets a new tab may start with. */
const BROWSER_WIDTH_PRESETS = [
	"fit",
	"390",
	"768"
];
/** Default page width for new tabs. */
const DEFAULT_WIDTH = "fit";
/** Whether plain-clicking links opens them beside the conversation. */
const DEFAULT_LINK_INTERCEPT = true;

//#endregion
//#region src/settings-schema.ts
/**
* Host-only wire schema for the `deep-browser` settings namespace.
* Kept out of settings.ts so the browser bundle never pulls schemastery
* into the module table.
*/
/** Durable browser schema; also the wire envelope the browser scope validates against. */
const BrowserSettingsSchema = z.object({
	defaultWidth: z.union([...BROWSER_WIDTH_PRESETS]).default(DEFAULT_WIDTH),
	linkIntercept: z.boolean().default(DEFAULT_LINK_INTERCEPT)
});

//#endregion
//#region src/index.ts
/**
* Host plugin body: register the settings section when the optional settings
* service is composed. Without it the plugin still loads; the card simply
* has no served namespace to pair with.
* @param ctx - Host context that may acquire the settings service.
*/
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(BROWSER_SETTINGS_NAMESPACE, BrowserSettingsSchema);
	});
}

//#endregion
export { apply };