// Today's Figma names for the tokens that replace them, so the script that writes Figma
// can find an unstamped variable or style under its old name and rename it in place.
// A path with no entry here is new.
import { SIZE } from '../grammar/words.ts'
import type { TokenPath } from '../grammar/path.ts'

const TEXT_PART: Record<string, string> = { fontFamily: 'font-family', fontSize: 'font-size', fontWeight: 'font-weight' }

// today's palette rows, one per new row where the migration map gives one; an old row
// that did more than one job names the row its dominant use lands on
const PALETTE = (group: string, name: string) => `${group} palette/${name}`
const COLOR_TODAY: Record<string, string> = {
  'surface/high': PALETTE('Background', 'Background Primary'),
  'surface/mid': PALETTE('Background', 'Background Secondary'),
  'surface/dim': PALETTE('Background', 'Background Tertiary'),
  'surface/inverse': PALETTE('Background', 'Background Primary Inverse'),
  'surface/scrim': PALETTE('Background', 'Background Scrim'),
  'fg/neutral/regular': PALETTE('Content', 'Content Primary'),
  'fg/neutral/muted': PALETTE('Content', 'Content Secondary'),
  'fg/neutral/accent': PALETTE('Content', 'Content Tertiary'),
  'fg/neutral/on-inverse/strong': PALETTE('Content', 'Content Primary Inverse'),
  'border/neutral/strong': PALETTE('Stroke', 'Stroke Primary'),
  'border/neutral/regular': PALETTE('Stroke', 'Stroke Secondary'),
  'border/neutral/muted': PALETTE('Stroke', 'Stroke Tertiary'),
  'border/neutral/hint': PALETTE('Stroke', 'Stroke Quaternary'),
  'border/neutral/inverse': PALETTE('Stroke', 'Stroke Primary Inverse'),
  'fg/brand/accent': PALETTE('Brand', 'Brand Primary'),
  'border/brand/muted': PALETTE('Brand', 'Brand Primary Highlight'),
  'bg/brand/regular': PALETTE('Brand', 'Brand Primary Accent'),
  'bg/neutral/ghost/hover': PALETTE('Merge', 'Merge Intensity 1'),
  'bg/neutral/ghost/pressed': PALETTE('Merge', 'Merge Intensity 2'),
  'bg/brand/solid/hover': PALETTE('Merge', 'Merge Intensity 3'),
  'bg/brand/solid/pressed': PALETTE('Merge', 'Merge Intensity 5'),
}
for (const [family, signal] of [['critical', 'Error'], ['warning', 'Warning'], ['positive', 'Success']]) {
  COLOR_TODAY[`fg/${family}/accent`] = PALETTE('Signal', `Signal ${signal}`)
  COLOR_TODAY[`bg/${family}/accent`] = PALETTE('Signal', `Signal ${signal} Spotlight`)
  COLOR_TODAY[`border/${family}/muted`] = PALETTE('Signal', `Signal ${signal} Highlight`)
  COLOR_TODAY[`bg/${family}/regular`] = PALETTE('Signal', `Signal ${signal} Accent`)
}

/** today's variable name for a token path, or for a text style's part */
export function todayVariable(path: TokenPath, part?: string): string | undefined {
  const [category, a, b] = path
  switch (category) {
    case 'space':
      if (a === 'negative') return `Primitives/negative-space-${b}`
      return path.length === 2 ? `Primitives/space-${a}` : undefined
    case 'size':
      if (a === 'icon') return `icon-${b}`
      if (a === 'max-width' && b === 'paragraph') return 'size/measure'
      return path.length === 2 ? `Primitives/size-${a}` : undefined
    case 'radius':
      return `radius-${a}`
    case 'border-width':
      return `width-${a}`
    case 'font':
      return a === 'family' || a === 'weight' ? `font/${a}/${b}` : undefined
    case 'text':
      return part && TEXT_PART[part] ? `${a}/${b}/${TEXT_PART[part]}` : undefined
    case 'color':
      return COLOR_TODAY[path.slice(1).join('/')]
    default:
      return undefined
  }
}

/**
 * The set's own earlier spelling of a path, where the set has renamed one: a row a
 * previous build wrote under the earlier path is found by it and renamed in place, so
 * a copy made before the rename takes the new name with its bindings intact. The
 * neutral's roles were spelled without the family word, and the inverse link carried
 * its variant before its family.
 */
export function previousPath(path: TokenPath): string | undefined {
  const [category, property, family, ...rest] = path
  if (category !== 'color') return undefined
  if (property === 'fg' && family === 'link' && rest[0] === 'on-inverse') return ['color', 'fg', 'on-inverse', 'link', ...rest.slice(1)].join('/')
  if (['fg', 'bg', 'border'].includes(property) && family === 'neutral') return ['color', property, ...rest].join('/')
  return undefined
}

/** today's text style name for a text style token */
export function todayStyle(path: TokenPath): string | undefined {
  const [category, role, size] = path
  if (category === 'shadow') { const level = ['raised', 'floating', 'overlay', 'lifted'].indexOf(role) + 1; return level ? `Elevation shadow/Level ${level}` : undefined }
  if (category !== 'text' || !(SIZE as readonly string[]).includes(size)) return undefined
  const words = role.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  const isDefault = (role === 'body' || role === 'link') && size === 'md'
  return `${words}/${size}${isDefault ? ' (Default)' : ''}`
}

/** today's mode names in the collection a token file collection takes over */
export const todayMode: Readonly<Record<string, string>> = {
  mobile: 'Mobile Web & iOS XS–LG',
  desktop: 'Desktop Web',
}

/**
 * Today's rows the rename map cannot pair with a row of their own, each with the path
 * that replaces it, decided by the owner from the leftovers list. The plugin moves every
 * binding from the old row to the new one; where the new row is a pair, the fill's
 * opacity is set to the pair's value as the binding moves. The old row is left for the
 * delete command once nothing refers to it.
 */
export const retiredVariables: Readonly<Record<string, string>> = {}

/** today's text styles replaced by a style of the set: the archived desktop styles, whose live styles the viewport modes now make responsive */
export const retiredStyles: Readonly<Record<string, string>> = {
  '_ARCHIVE/Desktop styles (responsive)/Display Large': 'text/display/lg',
  '_ARCHIVE/Desktop styles (responsive)/Display Medium': 'text/display/md',
  '_ARCHIVE/Desktop styles (responsive)/Display Small': 'text/display/sm',
  '_ARCHIVE/Desktop styles (responsive)/Heading Large': 'text/heading/lg',
  '_ARCHIVE/Desktop styles (responsive)/Heading Medium': 'text/heading/md',
  '_ARCHIVE/Desktop styles (responsive)/Heading Small': 'text/heading/sm',
  '_ARCHIVE/Desktop styles (responsive)/Heading XSmall': 'text/heading/xs',
  '_LOCAL/Generative AI/Body md': 'text/body/md',
  '_LOCAL/Generative AI/Title md': 'text/title/md',
}

/** today's code name for a color role: the palette name as the apps spell it */
export function todayCodeName(path: TokenPath): string | undefined {
  const today = todayVariable(path)
  const m = today && /^[A-Za-z]+ palette\/(.+)$/.exec(today)
  return m ? `color-palette-${m[1].toLowerCase().replace(/\s+/g, '-')}` : undefined
}
