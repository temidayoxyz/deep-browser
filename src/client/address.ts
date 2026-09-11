/**
 * Resource addresses this tab type claims: `dsh-resource://page/<url-encoded http(s) URL>`.
 * The whole URL is one path segment so `://` in the page does not split the address.
 */

/** Scheme + type prefix every page resource carries. */
export const PAGE_RESOURCE_PREFIX = 'dsh-resource://page/'

/**
 * Build the Sidebar resource address for one http(s) page.
 * @param url - absolute http(s) URL.
 * @returns `dsh-resource://page/<encodeURIComponent(url)>`.
 */
export function pageResourceAddress(url: string): string {
  return `${PAGE_RESOURCE_PREFIX}${encodeURIComponent(url)}`
}

/**
 * Read the page URL out of a resource address this type claims.
 * @param address - a Sidebar resource or page address.
 * @returns the http(s) URL, or `undefined` for the blank landing tab / a malformed address.
 */
export function urlFromAddress(address: string): string | undefined {
  if (!address.startsWith(PAGE_RESOURCE_PREFIX)) return undefined
  try {
    const raw = decodeURIComponent(address.slice(PAGE_RESOURCE_PREFIX.length))
    return isHttpUrl(raw) ? raw : undefined
  }
  catch {
    return undefined
  }
}

/**
 * Whether a string is an http or https URL the pane will load.
 * @param value - candidate.
 */
export function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  }
  catch {
    return false
  }
}

/**
 * Turn an address-bar string into an absolute http(s) URL.
 * Bare `localhost` / loopback keep `http:`; other hostnames get `https:`.
 * @param raw - what the user typed.
 * @returns a URL this pane can open, or `undefined` when the input is empty or not a location.
 */
export function normalizeInput(raw: string): string | undefined {
  const trimmed = raw.trim()
  if (trimmed === '') return undefined
  if (/^https?:\/\//iu.test(trimmed)) return isHttpUrl(trimmed) ? trimmed : undefined
  if (
    /^localhost(?::\d+)?(?:[/?#]|$)/iu.test(trimmed)
    || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?(?:[/?#]|$)/u.test(trimmed)
    || /^\[[0-9a-f:]+\](?::\d+)?(?:[/?#]|$)/iu.test(trimmed)
  ) {
    const candidate = `http://${trimmed}`
    return isHttpUrl(candidate) ? candidate : undefined
  }
  if (/^[a-z0-9][a-z0-9.-]*(:\d+)?([/?#]|$)/iu.test(trimmed)) {
    const candidate = `https://${trimmed}`
    return isHttpUrl(candidate) ? candidate : undefined
  }
  return undefined
}

/**
 * Chip / header label for a page: hostname, or the whole URL when it has no host.
 * @param url - absolute http(s) URL.
 */
export function hostnameOf(url: string): string {
  try {
    const host = new URL(url).host
    return host === '' ? url : host
  }
  catch {
    return url
  }
}
