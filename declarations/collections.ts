// A collection is an axis: the one list of contexts a designer switches on a frame. It
// names the token files and the Figma collection and never appears in a path. A token
// sits in the collection whose axis it might need one day; until its value varies, every
// context holds the same value.
import type { Token } from '../src/types.ts'

export const VIEWPORTS = ['mobile', 'tablet', 'desktop', 'wide'] as const
export type Viewport = (typeof VIEWPORTS)[number]

export type Collection = {
  /** the contexts, in file order; none for a collection whose values never change */
  contexts: readonly string[]
  /** the context a resolver picks when none is asked for */
  default?: string
  /** the Figma collection this one takes over, renamed in place, where one exists */
  today?: string
  /** a file set another generator writes into this collection's contexts, read here and never rewritten: the color engine's */
  external?: string
}

export const THEME_CONTEXTS = ['light', 'dark'] as const
export type ThemeContext = (typeof THEME_CONTEXTS)[number]

export const collections: Record<string, Collection> = {
  // the engine's color primitives, with the hand-authored rows that need a light and a dark value
  theme: { contexts: THEME_CONTEXTS, default: 'light', today: 'theme', external: 'engine' },
  // the semantic colors, every one an alias, so the theme's modes carry them
  palette: { contexts: [], today: 'Color palettes' },
  // names pending the team's review
  scale: { contexts: [], today: 'Layout' },
  viewport: { contexts: VIEWPORTS, default: 'desktop', today: 'Type scale' },
  motion: { contexts: [] },
}

/** a viewport with no declared value takes this one's */
export const viewportFallback: Readonly<Record<Viewport, Viewport | null>> = {
  mobile: null,
  tablet: 'desktop',
  desktop: 'mobile',
  wide: 'desktop',
}

/** the collection a token is filed in: by what might ever vary it */
export function collectionOf(t: Token): string {
  const category = t.path[0]
  if (category === 'color') return t.path[1] === 'plane' ? 'theme' : 'palette'
  if (category === 'grid' || category === 'text') return 'viewport'
  if ((category === 'space' || category === 'size') && t.layer === 'semantic') return 'viewport'
  if (category === 'motion') return 'motion'
  return 'scale'
}
