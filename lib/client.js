window.__ModuleLoader__.load({ id: "dsh-deep-browser", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
let react_jsx_runtime = require("react/jsx-runtime");
let react = require("react");
let __deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
let __deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");

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
/** Field carrying the default page width for new tabs. */
const DEFAULT_WIDTH_FIELD = "defaultWidth";
/** Field carrying whether plain-clicking links opens them beside the conversation. */
const LINK_INTERCEPT_FIELD = "linkIntercept";
/** Default page width for new tabs. */
const DEFAULT_WIDTH = "fit";
/** Whether plain-clicking links opens them beside the conversation. */
const DEFAULT_LINK_INTERCEPT = true;

//#endregion
//#region src/client/icons.tsx
const base = (size) => ({
	width: size ?? 16,
	height: size ?? 16,
	viewBox: "0 0 16 16",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": true,
	focusable: false
});
/** A globe, for the tab title and its sidebar entry. */
function GlobeGlyph({ size, className }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		...base(size),
		className,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
			cx: "8",
			cy: "8",
			r: "6.25",
			stroke: "currentColor",
			strokeWidth: "1.25"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M1.75 8h12.5M8 1.75c1.6 1.7 2.5 3.8 2.5 6.25S9.6 12.55 8 14.25C6.4 12.55 5.5 10.45 5.5 8S6.4 3.45 8 1.75Z",
			stroke: "currentColor",
			strokeWidth: "1.25",
			strokeLinecap: "round"
		})]
	});
}
/** A plus, for adding a navigation entry. */
function PlusGlyph({ size, className }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		...base(size),
		className,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M8 3.25v9.5M3.25 8h9.5",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round"
		})
	});
}
/** A circular arrow, for reloading the page. */
function RefreshGlyph({ size, className }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		...base(size),
		className,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M13.25 8a5.25 5.25 0 1 1-1.6-3.79",
			stroke: "currentColor",
			strokeWidth: "1.25",
			strokeLinecap: "round"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M13.5 2.25v3.5H10",
			stroke: "currentColor",
			strokeWidth: "1.25",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})]
	});
}
/** An arrow leaving a box, for opening the page outside the pane. */
function ExternalLinkGlyph({ size, className }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		...base(size),
		className,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M9.5 2.75H13.25V6.5M13 3 7.75 8.25",
			stroke: "currentColor",
			strokeWidth: "1.25",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M12.25 9.5v2.75a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1H5.5",
			stroke: "currentColor",
			strokeWidth: "1.25",
			strokeLinecap: "round"
		})]
	});
}

//#endregion
//#region src/client/address.ts
/**
* Resource addresses this tab type claims: `dsh-resource://page/<url-encoded http(s) URL>`.
* The whole URL is one path segment so `://` in the page does not split the address.
*/
/** Scheme + type prefix every page resource carries. */
const PAGE_RESOURCE_PREFIX = "dsh-resource://page/";
/**
* Build the Sidebar resource address for one http(s) page.
* @param url - absolute http(s) URL.
* @returns `dsh-resource://page/<encodeURIComponent(url)>`.
*/
function pageResourceAddress(url) {
	return `${PAGE_RESOURCE_PREFIX}${encodeURIComponent(url)}`;
}
/**
* Read the page URL out of a resource address this type claims.
* @param address - a Sidebar resource or page address.
* @returns the http(s) URL, or `undefined` for the blank landing tab / a malformed address.
*/
function urlFromAddress(address) {
	if (!address.startsWith(PAGE_RESOURCE_PREFIX)) return void 0;
	try {
		const raw = decodeURIComponent(address.slice(20));
		return isHttpUrl(raw) ? raw : void 0;
	} catch {
		return;
	}
}
/**
* Whether a string is an http or https URL the pane will load.
* @param value - candidate.
*/
function isHttpUrl(value) {
	try {
		const parsed = new URL(value);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}
/**
* Turn an address-bar string into an absolute http(s) URL.
* Bare `localhost` / loopback keep `http:`; other hostnames get `https:`.
* @param raw - what the user typed.
* @returns a URL this pane can open, or `undefined` when the input is empty or not a location.
*/
function normalizeInput(raw) {
	const trimmed = raw.trim();
	if (trimmed === "") return void 0;
	if (/^https?:\/\//iu.test(trimmed)) return isHttpUrl(trimmed) ? trimmed : void 0;
	if (/^localhost(?::\d+)?(?:[/?#]|$)/iu.test(trimmed) || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?(?:[/?#]|$)/u.test(trimmed) || /^\[[0-9a-f:]+\](?::\d+)?(?:[/?#]|$)/iu.test(trimmed)) {
		const candidate = `http://${trimmed}`;
		return isHttpUrl(candidate) ? candidate : void 0;
	}
	if (/^[a-z0-9][a-z0-9.-]*(:\d+)?([/?#]|$)/iu.test(trimmed)) {
		const candidate = `https://${trimmed}`;
		return isHttpUrl(candidate) ? candidate : void 0;
	}
}
/**
* Chip / header label for a page: hostname, or the whole URL when it has no host.
* @param url - absolute http(s) URL.
*/
function hostnameOf(url) {
	try {
		const host = new URL(url).host;
		return host === "" ? url : host;
	} catch {
		return url;
	}
}

//#endregion
//#region src/client/definition.tsx
/** The tab kind this package owns. */
const BROWSER_KIND = "browser";
/** This implementation's identity in the tab system, and the key its body registers under. */
const BROWSER_ID = "dsh-deep-browser";
/**
* The browser type's registry definition.
* @param t - namespace-bound translate, read fresh on every label call.
*/
function browserDefinition(t) {
	return {
		id: BROWSER_ID,
		kind: BROWSER_KIND,
		patterns: ["dsh-resource://page/**"],
		title: (address) => {
			const url = urlFromAddress(address);
			return url === void 0 ? t("type.label") : hostnameOf(url);
		},
		canOpen: (address) => urlFromAddress(address) !== void 0,
		guide: [{
			order: 20,
			title: () => t("guide.title"),
			description: () => t("guide.description"),
			icon: GlobeGlyph
		}]
	};
}

//#endregion
//#region \0dsh-css:D:\Codebase\deep-browser\src\client\BrowserBody.module.css.mjs
const css$1 = ".qi3sRq_root{height:100%;min-height:0;color:var(--dsw-alias-label-primary);flex-direction:column;flex:auto;display:flex}.qi3sRq_header{box-sizing:border-box;border-bottom:.5px solid var(--dsw-alias-border-l3);flex:none;align-items:center;gap:4px;height:38px;padding:0 6px 0 10px;display:flex}.qi3sRq_address{flex:auto;min-width:0;display:flex}.qi3sRq_addressField{flex:auto;width:100%;min-width:0;height:28px;display:flex}.qi3sRq_widths{flex:none;gap:2px;display:flex}.qi3sRq_stage{background:var(--dsw-alias-bg-layer-1);flex:auto;justify-content:center;min-height:0;display:flex}.qi3sRq_frame{background:#fff;border:0;width:100%;height:100%}.qi3sRq_frame[data-width=\"390\"]{width:390px;max-width:100%;box-shadow:var(--dsw-elevation-panel)}.qi3sRq_frame[data-width=\"768\"]{width:768px;max-width:100%;box-shadow:var(--dsw-elevation-panel)}.qi3sRq_empty{box-sizing:border-box;min-height:0;color:var(--dsw-alias-label-secondary);font-size:var(--dsh-content-font-size-secondary,13px);text-align:center;flex:auto;justify-content:center;align-items:center;padding:24px 32px;line-height:1.5;display:flex}.qi3sRq_titleIcon{flex:none;margin-right:6px}";
const tagId$1 = "dsh-deep-browser/BrowserBody.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-deep-browser";
	tag.dataset.pluginCss = tagId$1;
	tag.textContent = css$1;
	document.head.appendChild(tag);
}
var BrowserBody_module_css_default = {
	"address": "qi3sRq_address",
	"addressField": "qi3sRq_addressField",
	"header": "qi3sRq_header",
	"empty": "qi3sRq_empty",
	"titleIcon": "qi3sRq_titleIcon",
	"frame": "qi3sRq_frame",
	"root": "qi3sRq_root",
	"widths": "qi3sRq_widths",
	"stage": "qi3sRq_stage"
};

//#endregion
//#region src/client/BrowserBody.tsx
/**
* Browser pane body: address bar, reload, open-external, width presets, iframe.
*
* Live http(s) URLs load in a nested browsing context (their own origin).
* There is no cookie/cache/zoom/annotate chrome: those need a browsing engine
* the web profile does not give a plugin.
*/
const WIDTHS = [
	"fit",
	"390",
	"768"
];
/**
* Open a URL in the user's system browser.
* @param url - absolute http(s) URL.
*/
function openExternal(url) {
	window.open(url, "_blank", "noopener,noreferrer");
}
/**
* The pane: chrome, empty landing, or the framed page.
*/
function BrowserBody({ useTabInfo, useStore, actions, t }) {
	const { tab } = useTabInfo();
	const url = urlFromAddress(tab.navigation.address);
	const width = useStore((store) => store.byTab[tab.id]?.width) ?? "fit";
	const [draft, setDraft] = (0, react.useState)(url ?? "");
	const [generation, setGeneration] = (0, react.useState)(0);
	(0, react.useEffect)(() => {
		if (!tab.signal.aborted) actions.start(tab.id);
		const forget = () => {
			actions.forget(tab.id);
		};
		tab.signal.addEventListener("abort", forget, { once: true });
		return () => {
			tab.signal.removeEventListener("abort", forget);
		};
	}, [
		actions,
		tab.id,
		tab.signal
	]);
	(0, react.useEffect)(() => {
		setDraft(url ?? "");
		setGeneration(0);
	}, [url, tab.navigation.revision]);
	const go = (raw) => {
		const next = normalizeInput(raw);
		if (next === void 0) return;
		if (next === url) {
			setGeneration((value) => value + 1);
			return;
		}
		tab.actions.openResource(pageResourceAddress(next), { replaceTab: true });
	};
	const onSubmit = (event) => {
		event.preventDefault();
		go(draft);
	};
	const onAddressKey = (event) => {
		if (event.key === "Escape") setDraft(url ?? "");
	};
	const widthLabel = (value) => {
		if (value === "fit") return t("width.fit");
		if (value === "390") return t("width.phone");
		return t("width.tablet");
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: BrowserBody_module_css_default.root,
		"data-deep-browser": "",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: BrowserBody_module_css_default.header,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: t("newTab"),
					side: "bottom",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "toolbar",
						size: "sm",
						"aria-label": t("newTab"),
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusGlyph, {}),
						onClick: () => {
							tab.actions.openTab(BROWSER_KIND, { revealIfOpened: false });
						}
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("form", {
					className: BrowserBody_module_css_default.address,
					onSubmit,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Input, {
						className: BrowserBody_module_css_default.addressField,
						"aria-label": t("address.label"),
						placeholder: t("address.placeholder"),
						value: draft,
						spellCheck: false,
						autoCapitalize: "off",
						autoCorrect: "off",
						onChange: (event) => {
							setDraft(event.currentTarget.value);
						},
						onKeyDown: onAddressKey,
						onBlur: () => {
							if (draft.trim() === "") setDraft(url ?? "");
						}
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: t("reload"),
					side: "bottom",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "toolbar",
						size: "sm",
						"aria-label": t("reload"),
						disabled: url === void 0,
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RefreshGlyph, {}),
						onClick: () => {
							setGeneration((value) => value + 1);
						}
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: t("openExternal"),
					side: "bottom",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "toolbar",
						size: "sm",
						"aria-label": t("openExternal"),
						disabled: url === void 0,
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExternalLinkGlyph, {}),
						onClick: () => {
							if (url !== void 0) openExternal(url);
						}
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: BrowserBody_module_css_default.widths,
					role: "group",
					"aria-label": t("width.group"),
					children: WIDTHS.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Pill, {
						active: width === value,
						"aria-pressed": width === value,
						onClick: () => {
							actions.setWidth(tab.id, value);
						},
						children: widthLabel(value)
					}, value))
				})
			]
		}), url === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
			className: BrowserBody_module_css_default.empty,
			children: t("empty")
		}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: BrowserBody_module_css_default.stage,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
				className: BrowserBody_module_css_default.frame,
				"data-width": width,
				src: url,
				title: t("frame.title"),
				referrerPolicy: "no-referrer",
				allow: "fullscreen"
			}, `${url}#${String(generation)}`)
		})]
	});
}

//#endregion
//#region src/client/BrowserTitle.tsx
/**
* The title as the chip and a floating panel's header show it.
* @param props - the tab information hook.
*/
function BrowserTitle({ useTabInfo }) {
	const { tab } = useTabInfo();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GlobeGlyph, {
		size: 14,
		className: BrowserBody_module_css_default.titleIcon
	}), tab.title] });
}

//#endregion
//#region src/client/intercept.ts
/**
* Install the document click intercept.
* @param ctx - client root; `sidebarRight` is read at click time so a missing
*   session surface falls back to the system browser.
* @param isEnabled - reads the current link-intercept setting at click time;
*   a disabled intercept leaves the click for native handling.
* @returns disposer.
*/
function interceptHttpLinks(ctx, isEnabled) {
	const onClick = (event) => {
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		const anchor = event.composedPath().find((node) => node instanceof HTMLAnchorElement && node.hasAttribute("href"));
		if (anchor === void 0 || anchor.hasAttribute("download")) return;
		if (anchor.closest("[data-deep-browser]") !== null) return;
		const href = anchor.href;
		if (!isHttpUrl(href)) return;
		if (!isEnabled()) return;
		event.preventDefault();
		try {
			ctx.sidebarRight.openResource(pageResourceAddress(href));
		} catch {
			window.open(href, "_blank", "noopener,noreferrer");
		}
	};
	document.addEventListener("click", onClick, true);
	return () => {
		document.removeEventListener("click", onClick, true);
	};
}

//#endregion
//#region src/client/locales.ts
/** Simplified Chinese dictionary and key-set source of truth. */
const zh = {
	"type.label": "浏览器",
	"guide.title": "浏览器",
	"guide.description": "在会话旁边打开链接和本地预览",
	"address.placeholder": "输入地址，或从对话里点开链接",
	"address.label": "地址",
	reload: "重新加载",
	"openExternal": "在系统浏览器中打开",
	"newTab": "新标签页",
	"width.fit": "适应",
	"width.phone": "390",
	"width.tablet": "768",
	"width.group": "页面宽度",
	empty: "输入地址，或从对话里点开链接。拒绝被嵌入的页面可以用工具栏打开到系统浏览器。",
	"frame.title": "页面预览",
	"settings.title": "浏览器",
	"settings.description": "会话旁边的浏览器：新标签页的默认页面宽度，以及纯点击链接时是否在旁边打开。",
	"settings.defaultWidth": "默认页面宽度",
	"settings.linkIntercept": "在会话旁边打开链接",
	"settings.linkInterceptHint": "纯点击链接时在浏览器标签页中打开；带修饰键的点击始终使用系统浏览器。"
};
/** English dictionary, checked against the Chinese key set. */
const en = {
	"type.label": "Browser",
	"guide.title": "Browser",
	"guide.description": "Open links and local previews beside the conversation",
	"address.placeholder": "Type an address, or follow a link from the conversation",
	"address.label": "Address",
	reload: "Reload",
	"openExternal": "Open in system browser",
	"newTab": "New tab",
	"width.fit": "Fit",
	"width.phone": "390",
	"width.tablet": "768",
	"width.group": "Page width",
	empty: "Type an address, or follow a link from the conversation. Pages that refuse to be framed can be opened in your system browser from the toolbar.",
	"frame.title": "Page preview",
	"settings.title": "Browser",
	"settings.description": "The browser beside the conversation: the default page width for new tabs, and whether plain-clicking links opens them here.",
	"settings.defaultWidth": "Default page width",
	"settings.linkIntercept": "Open links beside the conversation",
	"settings.linkInterceptHint": "Plain-click a link to open it in the Browser tab; modifier-click always uses the system browser."
};

//#endregion
//#region \0dsh-css:D:\Codebase\deep-browser\src\client\SettingsCard.module.css.mjs
const css = "._7w7awa_card{flex-direction:column;gap:12px;display:flex}._7w7awa_title{margin:0;font-size:1em}._7w7awa_description{margin:0}._7w7awa_row{align-items:flex-start;gap:12px;display:flex}._7w7awa_label{flex:none;padding-top:2px}._7w7awa_widths{gap:4px;margin-left:auto;display:flex}._7w7awa_check{flex:none;margin-top:4px}._7w7awa_checkBody{flex-direction:column;gap:2px;display:flex}._7w7awa_hint{opacity:.75}";
const tagId = "dsh-deep-browser/SettingsCard.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-deep-browser";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var SettingsCard_module_css_default = {
	"hint": "_7w7awa_hint",
	"card": "_7w7awa_card",
	"label": "_7w7awa_label",
	"checkBody": "_7w7awa_checkBody",
	"check": "_7w7awa_check",
	"row": "_7w7awa_row",
	"title": "_7w7awa_title",
	"description": "_7w7awa_description",
	"widths": "_7w7awa_widths"
};

//#endregion
//#region src/client/SettingsCard.tsx
/**
* Declare the card's mirror of the settings scope.
* @returns the store handle to declare on the slot registration.
*/
function createSettingsCardStore() {
	return (0, __deepseek_ai_dsh_client_store.defineStore)({
		init: () => ({
			defaultWidth: DEFAULT_WIDTH,
			linkIntercept: DEFAULT_LINK_INTERCEPT,
			writable: false
		}),
		actions: { sync: (d, defaultWidth, linkIntercept, writable) => {
			d.defaultWidth = defaultWidth;
			d.linkIntercept = linkIntercept;
			d.writable = writable;
		} }
	});
}
/**
* Render the Deep Browser card: title, what the plugin does, and its two
* settings — the default width for new tabs and the link intercept.
*/
function SettingsCard({ actions, t, useStore }) {
	const state = useStore((snapshot) => snapshot);
	const disabled = !state.writable;
	const widthLabel = (value) => {
		if (value === "fit") return t("width.fit");
		if (value === "390") return t("width.phone");
		return t("width.tablet");
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: SettingsCard_module_css_default.card,
		"aria-label": t("settings.title"),
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
				className: SettingsCard_module_css_default.title,
				children: t("settings.title")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: SettingsCard_module_css_default.description,
				children: t("settings.description")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: SettingsCard_module_css_default.row,
				role: "group",
				"aria-label": t("settings.defaultWidth"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: SettingsCard_module_css_default.label,
					children: t("settings.defaultWidth")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: SettingsCard_module_css_default.widths,
					children: BROWSER_WIDTH_PRESETS.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(__deepseek_ai_dsh_client_ui_primitives.Pill, {
						active: state.defaultWidth === value,
						"aria-pressed": state.defaultWidth === value,
						disabled,
						onClick: () => {
							actions.setDefaultWidth(value);
						},
						children: widthLabel(value)
					}, value))
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				className: SettingsCard_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: SettingsCard_module_css_default.check,
					checked: state.linkIntercept,
					disabled,
					onChange: (event) => {
						actions.setLinkIntercept(event.currentTarget.checked);
					}
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: SettingsCard_module_css_default.checkBody,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: SettingsCard_module_css_default.label,
						children: t("settings.linkIntercept")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: SettingsCard_module_css_default.hint,
						children: t("settings.linkInterceptHint")
					})]
				})]
			})
		]
	});
}

//#endregion
//#region src/client/store.ts
/**
* Per-tab viewing state that must survive the body unmounting when the user
* switches tabs: the page-width preset.
*/
/**
* Declare the browser pane's store.
* @param getDefaultWidth - reads the current settings default for seeding new tabs.
* @returns the store handle to declare on the registration.
*/
function createBrowserStore(getDefaultWidth = () => DEFAULT_WIDTH) {
	return (0, __deepseek_ai_dsh_client_store.defineStore)({
		init: () => ({ byTab: {} }),
		actions: {
			start: (d, tabId) => {
				if (d.byTab[tabId] === void 0) d.byTab[tabId] = { width: getDefaultWidth() };
			},
			setWidth: (d, tabId, width) => {
				const tab = d.byTab[tabId];
				if (tab === void 0) d.byTab[tabId] = { width };
				else tab.width = width;
			},
			forget: (d, tabId) => {
				delete d.byTab[tabId];
			}
		}
	});
}

//#endregion
//#region src/client/index.ts
/** This package's copy namespace. */
const NS = "deepBrowser";
/**
* Required browser services: the tab registry, the keyed seat, navigation,
* copy, and the settings transport the card and the behavior read.
*/
const inject = [
	"slots",
	"locale",
	"sidebarRightTabs",
	"sidebarRight",
	"remote",
	"configForms"
];
/**
* Client plugin body: register the type, dictionaries, body, title, link
* intercept, and the Plugins settings card.
* @param ctx - client root context.
*/
function apply(ctx) {
	const t = ctx.locale.bind(NS);
	ctx.effect(() => ctx.sidebarRightTabs.register(browserDefinition(t)), "deep-browser: type");
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "deep-browser: dictionaries");
	const form = ctx.configForms.get(BROWSER_SETTINGS_NAMESPACE);
	const readSection = () => form.getSnapshot().value;
	const store = createBrowserStore(() => readSection()?.defaultWidth ?? DEFAULT_WIDTH);
	ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
		name: "sidebar.right.pane.tab",
		key: BROWSER_ID,
		locale: NS,
		store
	}, BrowserBody)), "deep-browser: tab body");
	ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
		name: "sidebar.right.pane.tab.title",
		key: BROWSER_ID
	}, BrowserTitle)), "deep-browser: tab title");
	ctx.effect(() => interceptHttpLinks(ctx, () => readSection()?.linkIntercept ?? DEFAULT_LINK_INTERCEPT), "deep-browser: intercept links");
	const cardStore = createSettingsCardStore();
	let bound;
	const syncCard = () => {
		const snapshot = form.getSnapshot();
		const section = snapshot.value;
		bound?.sync(section?.defaultWidth ?? DEFAULT_WIDTH, section?.linkIntercept ?? DEFAULT_LINK_INTERCEPT, snapshot.writable);
	};
	ctx.effect(() => form.subscribe(syncCard), "deep-browser: settings card sync");
	const cardInjected = (cardActions) => {
		bound = cardActions;
		syncCard();
		return {
			setDefaultWidth: (width) => {
				form.set(DEFAULT_WIDTH_FIELD, width);
			},
			setLinkIntercept: (next) => {
				form.set(LINK_INTERCEPT_FIELD, next);
			}
		};
	};
	ctx.effect(() => ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
		name: "settings.plugin.item",
		key: BROWSER_SETTINGS_NAMESPACE,
		locale: NS,
		store: cardStore,
		inject: cardInjected
	}, SettingsCard)), "deep-browser: settings card");
}

//#endregion
exports.apply = apply;
exports.inject = inject;
return module.exports; } });
//# sourceMappingURL=client.js.map