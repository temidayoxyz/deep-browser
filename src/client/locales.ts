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
} satisfies Record<DeepBrowserKey, string>
