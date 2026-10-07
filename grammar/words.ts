// The closed word lists. A path is legal only if, after its category, it matches one of
// the category's shapes segment by segment. The audit reads these shapes and nothing
// else, so a word enters the system here or not at all. Zero imports.

// density reads for a padding as well as for a gap, which distance words do not; size
// words are kept off space so a gap is never mistaken for a component size
export const DENSITY = ['condensed', 'normal', 'spacious'] as const
export type Density = (typeof DENSITY)[number]

// the size words the component property glossary uses, smallest first
export const SIZE = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
export type Size = (typeof SIZE)[number]

// the text style roles: the hierarchical ones first, then the functional ones
export const ROLE = ['display', 'heading', 'title', 'body', 'link', 'tabular-number', 'button', 'code'] as const
export type Role = (typeof ROLE)[number]

// the color families the engine generates; the neutral is implied where a row has none
export const FAMILY = ['brand', 'brand-alt', 'critical', 'warning', 'positive', 'info'] as const
export type Family = (typeof FAMILY)[number]
export const STATE = ['enabled', 'hover', 'pressed', 'selected'] as const
export type State = (typeof STATE)[number]
const LINK_STATE = ['enabled', 'hover', 'pressed'] as const
// the emphasis words, one vocabulary for fg, bg and border, in the neutral and in every
// family; each property says which engine stop a word names. The order is the order
// every list keeps: the two a designer reaches for, then the rest in rising emphasis
export const WORD = ['regular', 'accent', 'hint', 'muted', 'strong'] as const
export type Word = (typeof WORD)[number]
// the interaction levels under bg: nothing at rest, a tint at rest, the engine's stamp
export const LEVEL = ['ghost', 'soft', 'solid'] as const
export type Level = (typeof LEVEL)[number]
// the shadows, named for what sits at that height, lowest first; never a plane word
export const SHADOW = ['raised', 'floating', 'overlay', 'lifted'] as const
export type ShadowRole = (typeof SHADOW)[number]
const SOLID_STATE = ['enabled', 'hover', 'pressed'] as const

/** a scale step: digits only, three or more (`025`, `400`, `3200`) */
export const STEP = 'step'
export type Segment = readonly string[] | typeof STEP
export const isStep = (s: string): boolean => /^\d{3,}$/.test(s)

export const SHAPES = {
  space: [
    [STEP],
    [['negative'], STEP],
    [['gap'], ['control', 'content', 'layout'], DENSITY],
    [['padding'], ['card', 'container'], DENSITY],
  ],
  size: [
    [STEP],
    [['icon'], SIZE],
    [['control'], SIZE],
    [['illustration'], ['spot', 'hero'], SIZE],
    [['measure']],
  ],
  radius: [[STEP], [['full']]],
  'border-width': [[STEP]],
  opacity: [
    [STEP],
    [['disabled', 'scrim']],
    [['ghost'], ['hover', 'pressed', 'selected']],
    [['soft'], STATE],
  ],
  motion: [
    [['easing'], ['default', 'enter', 'exit', 'linear']],
    [['duration'], STEP],
    [['transition'], ['default', 'default-opacity', 'default-fast', 'open', 'dismiss', 'slide-in', 'slide-out']],
  ],
  breakpoint: [[SIZE]],
  grid: [[['columns', 'margin', 'gutter', 'max-width']]],
  font: [
    [['family'], ['sans', 'number', 'mono']],
    [['weight'], ['regular', 'medium', 'semibold']],
    [['size'], STEP],
    [['line-height'], STEP],
  ],
  text: [[ROLE, SIZE]],
  color: [
    [['fg'], [...WORD, 'on-solid']],
    [['fg'], ['link'], LINK_STATE],
    [['fg'], ['on-inverse'], WORD],
    [['fg'], ['on-inverse'], ['link'], LINK_STATE],
    [['fg'], FAMILY, [...WORD, 'on-solid']],
    [['bg'], WORD],
    [['bg'], ['ghost', 'soft'], STATE],
    [['bg'], ['solid'], SOLID_STATE],
    [['bg'], FAMILY, WORD],
    [['bg'], FAMILY, ['ghost', 'soft'], STATE],
    [['bg'], FAMILY, ['solid'], SOLID_STATE],
    [['border'], [...WORD, 'focus', 'inverse', 'solid']],
    [['border'], FAMILY, [...WORD, 'solid']],
    [['plane'], ['high', 'mid', 'low', 'dim']],
    [['surface'], ['high', 'mid', 'low', 'dim', 'inverse', 'scrim']],
    [['illustration'], ['paper', 'chalk-light', 'chalk', 'highlighter', 'pencil', 'pen', 'shadow', 'shine']],
  ],
  shadow: [[SHADOW]],
} as const satisfies Record<string, readonly (readonly Segment[])[]>

export type Category = keyof typeof SHAPES
// document order: the order the categories appear in every output
export const CATEGORIES = Object.keys(SHAPES) as Category[]
