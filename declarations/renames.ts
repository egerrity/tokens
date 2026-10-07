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
  'fg/regular': PALETTE('Content', 'Content Primary'),
  'fg/muted': PALETTE('Content', 'Content Secondary'),
  'fg/accent': PALETTE('Content', 'Content Tertiary'),
  'fg/on-inverse/strong': PALETTE('Content', 'Content Primary Inverse'),
  'border/strong': PALETTE('Stroke', 'Stroke Primary'),
  'border/regular': PALETTE('Stroke', 'Stroke Secondary'),
  'border/muted': PALETTE('Stroke', 'Stroke Tertiary'),
  'border/hint': PALETTE('Stroke', 'Stroke Quaternary'),
  'border/inverse': PALETTE('Stroke', 'Stroke Primary Inverse'),
  'fg/brand/accent': PALETTE('Brand', 'Brand Primary'),
  'border/brand/muted': PALETTE('Brand', 'Brand Primary Highlight'),
  'bg/brand/regular': PALETTE('Brand', 'Brand Primary Accent'),
  'bg/ghost/hover': PALETTE('Merge', 'Merge Intensity 1'),
  'bg/ghost/pressed': PALETTE('Merge', 'Merge Intensity 2'),
  'bg/brand/solid/hover': PALETTE('Merge', 'Merge Intensity 3'),
  'bg/brand/solid/pressed': PALETTE('Merge', 'Merge Intensity 5'),
}
for (const [family, signal] of [['critical', 'Negative'], ['warning', 'Warning'], ['positive', 'Positive']]) {
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
