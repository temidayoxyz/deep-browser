/**
 * Smoke the running dsh web: boot settles, Deep Browser factory registers,
 * and the Browser guide capsule is in the right sidebar.
 */
import playwright from 'file:///C:/Users/Administrator/deepseek-harness/node_modules/.pnpm/playwright-core@1.61.1/node_modules/playwright-core/index.js'
const { chromium } = playwright

const url = process.argv[2]
if (!url) {
  console.error('usage: node scripts/verify-web.mjs <url>')
  process.exit(2)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (error) => { errors.push(String(error)) })
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
await page.waitForTimeout(4000)

const session = page.getByText('I want you to cleanly', { exact: false }).first()
if (await session.count()) await session.click()
await page.waitForTimeout(1500)

const expand = page.locator('[data-sidebar-right-expand]')
if (await expand.count()) await expand.click()
await page.waitForTimeout(1000)

const browserCard = page.getByText('Open links and local previews beside the conversation', { exact: false }).first()
if (await browserCard.count()) await browserCard.click()
await page.waitForTimeout(1000)

const address = page.getByLabel('Address')
if (await address.count()) {
  await address.fill('example.com')
  await address.press('Enter')
  await page.waitForTimeout(1500)
}

const body = await page.evaluate(() => {
  const text = document.body?.innerText ?? ''
  const iframe = document.querySelector('[data-deep-browser] iframe')
  return {
    title: document.title,
    hasDeepBrowserFactory: Boolean(window.__ModuleLoader__),
    hasGuideCopy: text.includes('Open links and local previews beside the conversation'),
    hasAddressChrome: Boolean(document.querySelector('[data-deep-browser]')),
    iframeSrc: iframe?.getAttribute('src') ?? null,
    widthLabels: ['Fit', '390', '768'].filter(label => text.includes(label)),
  }
})

const screenshot = 'D:/Codebase/deep-browser/scripts/verify-web.png'
await page.screenshot({ path: screenshot, fullPage: true })
await browser.close()

const deepErrors = errors.filter(line => /deep-browser|dsh-deep-browser/i.test(line))
console.log(JSON.stringify({ body, errorCount: errors.length, deepErrors, screenshot }, null, 2))
if (deepErrors.length > 0 || !body.hasAddressChrome) process.exit(1)
