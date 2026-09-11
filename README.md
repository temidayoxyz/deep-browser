# Deep Browser

A DeepSeek Harness plugin that opens http(s) pages in the **right sidebar**, beside the conversation.

This is the set that the current Web profile can host honestly:

- New tab, address bar, reload, open in the system browser
- Width presets (Fit / 390 / 768) — CSS layout of the iframe, not device UA emulation
- Click an http(s) link in the UI (without a modifier key) to open it here
- Local `localhost` / loopback URLs as `http://`

It does **not** fake Chromium features the web profile cannot provide: zoom, cookies, cache, annotate, `prefers-color-scheme`, or agent drive. Those need a Desktop browsing-context seam.

Workspace files stay in Document Preview. This pane is for live URLs.

## Settings (Plugins tab)

The plugin registers a `deep-browser` settings namespace, so it shows a
card in the web settings **Plugins** tab with two settings, both applied live:

- **Default page width** (Fit / 390 / 768) — the width new tabs start with.
  Per-tab pills in the pane still override it for that tab.
- **Open links beside the conversation** — whether plain-clicking an http(s)
  link opens it in the Browser tab. Modifier-click always uses the system
  browser.

## Install from GitHub

```sh
dsh plugin --profile web add github:temidayoxyz/deep-browser
```

A git install fetches sources, not built artifacts, so pnpm builds
`lib/` via the package's `prepare` script. pnpm ≥10 refuses to run a
git dependency's build until it is explicitly allowed, so if the first
`add` fails, copy the exact package key pnpm printed into the profile's
`pnpm-workspace.yaml`:

```yaml
allowBuilds:
  dsh-deep-browser: true
```

and re-run the `add`. Only allow packages whose source you trust, and
consider pinning a commit (`github:temidayoxyz/deep-browser#<sha>`).

## Run against a local Harness checkout

```sh
pnpm install
pnpm build
```

From the Harness repository:

```sh
pnpm dsh web --patch D:/Codebase/deep-browser/overlay.yml --no-open
```

Open the printed URL, expand the right sidebar, and pick **Browser** — or click an http(s) link in chat (plain click; Ctrl/Cmd-click still uses the system browser).

Install into a profile:

```sh
dsh plugin --profile web add D:/Codebase/deep-browser
```
