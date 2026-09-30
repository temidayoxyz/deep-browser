/**
 * The browser pane's own glyphs.
 *
 * These are inline SVG rather than imports from the design system's icon set.
 * The harness removed its generic outline icons, so an imported glyph that no
 * longer exists is `undefined` at render, which React reports as an invalid
 * element type and the pane renders blank. Owning three small glyphs removes the
 * dependency on a set that can be renamed again, and they inherit the current
 * text colour like every other icon in the shell.
 *
 * @module dsh-deep-browser/client/icons
 */

/** Props every glyph accepts: pixel size and an optional class for styling. */
export interface GlyphProps {
  /** Rendered width and height in pixels. */
  size?: number
  /** Class applied to the `svg`, for colour and layout. */
  className?: string
}

const base = (size: number | undefined): Record<string, unknown> => ({
  width: size ?? 16,
  height: size ?? 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
  focusable: false,
})

/** A globe, for the tab title and its sidebar entry. */
export function GlobeGlyph({ size, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M1.75 8h12.5M8 1.75c1.6 1.7 2.5 3.8 2.5 6.25S9.6 12.55 8 14.25C6.4 12.55 5.5 10.45 5.5 8S6.4 3.45 8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A plus, for adding a navigation entry. */
export function PlusGlyph({ size, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 3.25v9.5M3.25 8h9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** A circular arrow, for reloading the page. */
export function RefreshGlyph({ size, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M13.25 8a5.25 5.25 0 1 1-1.6-3.79"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M13.5 2.25v3.5H10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** An arrow leaving a box, for opening the page outside the pane. */
export function ExternalLinkGlyph({ size, className }: GlyphProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M9.5 2.75H13.25V6.5M13 3 7.75 8.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 9.5v2.75a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1H5.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}
