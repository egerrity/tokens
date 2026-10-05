// Today's Figma names for the tokens that replace them, so the script that writes Figma
// can find an unstamped variable or style under its old name and rename it in place.
// A path with no entry here is new.
import { SIZE } from '../grammar/words.ts'
import type { TokenPath } from '../grammar/path.ts'

const TEXT_PART: Record<string, string> = { fontFamily: 'font-family', fontSize: 'font-size', fontWeight: 'font-weight' }

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
    default:
      return undefined
  }
}

/** today's text style name for a text style token */
export function todayStyle(path: TokenPath): string | undefined {
  const [category, role, size] = path
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
