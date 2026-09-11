/**
 * `deepBrowser` namespace dictionaries.
 */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Browser tab type name, chrome labels, and empty-state copy. */
    deepBrowser: DeepBrowserKey
  }
}

/** Simplified Chinese dictionary and key-set source of truth. */
export const zh = {
  'type.label': '浏览器',
  'guide.title': '浏览器',
  'guide.description': '在会话旁边打开链接和本地预览',
  'address.placeholder': '输入地址，或从对话里点开链接',
  'address.label': '地址',
  reload: '重新加载',
  'openExternal': '在系统浏览器中打开',
  'newTab': '新标签页',
  'width.fit': '适应',
  'width.phone': '390',
  'width.tablet': '768',
  'width.group': '页面宽度',
  empty: '输入地址，或从对话里点开链接。拒绝被嵌入的页面可以用工具栏打开到系统浏览器。',
  'frame.title': '页面预览',
  'settings.title': '浏览器',
  'settings.description': '会话旁边的浏览器：新标签页的默认页面宽度，以及纯点击链接时是否在旁边打开。',
  'settings.defaultWidth': '默认页面宽度',
  'settings.linkIntercept': '在会话旁边打开链接',
  'settings.linkInterceptHint': '纯点击链接时在浏览器标签页中打开；带修饰键的点击始终使用系统浏览器。',
} satisfies Record<string, string>

/** Dictionary key union. */
export type DeepBrowserKey = keyof typeof zh

/** English dictionary, checked against the Chinese key set. */
export const en = {
  'type.label': 'Browser',
  'guide.title': 'Browser',
  'guide.description': 'Open links and local previews beside the conversation',
  'address.placeholder': 'Type an address, or follow a link from the conversation',
  'address.label': 'Address',
  reload: 'Reload',
  'openExternal': 'Open in system browser',
  'newTab': 'New tab',
  'width.fit': 'Fit',
  'width.phone': '390',
  'width.tablet': '768',
  'width.group': 'Page width',
  empty: 'Type an address, or follow a link from the conversation. Pages that refuse to be framed can be opened in your system browser from the toolbar.',
  'frame.title': 'Page preview',
  'settings.title': 'Browser',
  'settings.description': 'The browser beside the conversation: the default page width for new tabs, and whether plain-clicking links opens them here.',
  'settings.defaultWidth': 'Default page width',
  'settings.linkIntercept': 'Open links beside the conversation',
  'settings.linkInterceptHint': 'Plain-click a link to open it in the Browser tab; modifier-click always uses the system browser.',
} satisfies Record<DeepBrowserKey, string>
