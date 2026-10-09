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
// a shape names the slot each segment fills, so the audit can hold the slot rules and the
// inventory page can say what fills each slot today
export type Slot = 'property' | 'family' | 'variant' | 'specifier'
export const SLOTS = ['category', 'property', 'family', 'variant', 'specifier'] as const
export type Segment = { readonly slot: Slot; readonly words: readonly string[] | typeof STEP }
const P = (words: readonly string[]): Segment => ({ slot: 'property', words })
const F = (words: readonly string[]): Segment => ({ slot: 'family', words })
const V = (words: readonly string[]): Segment => ({ slot: 'variant', words })
const S = (words: readonly string[] | typeof STEP): Segment => ({ slot: 'specifier', words })
export const isStep = (s: string): boolean => /^\d{3,}$/.test(s)

export const SHAPES = {
  space: [
    [S(STEP)],
    [P(['negative']), S(STEP)],
    [P(['gap']), V(['control', 'content', 'layout']), S(DENSITY)],
    [P(['padding']), V(['card', 'container']), S(DENSITY)],
  ],
  size: [
    [S(STEP)],
    [P(['icon']), S(SIZE)],
    [P(['control']), S(SIZE)],
    [P(['illustration']), V(['spot', 'hero']), S(SIZE)],
    [P(['max-width']), S(['paragraph'])],
  ],
  radius: [[S(STEP)], [S(['full'])]],
  'border-width': [[S(STEP)]],
  opacity: [
    [S(STEP)],
    [S(['disabled', 'scrim'])],
    [V(['ghost']), S(['hover', 'pressed', 'selected'])],
    [V(['soft']), S(STATE)],
  ],
  motion: [
    [P(['easing']), S(['default', 'enter', 'exit', 'linear'])],
    [P(['duration']), S(STEP)],
    [P(['transition']), S(['default', 'default-opacity', 'default-fast', 'open', 'dismiss', 'slide-in', 'slide-out'])],
  ],
  breakpoint: [[S(SIZE)]],
  grid: [[S(['columns', 'margin', 'gutter', 'max-width'])]],
  font: [
    [P(['family']), S(['sans', 'number', 'mono'])],
    [P(['weight']), S(['regular', 'medium', 'semibold'])],
    [P(['size']), S(STEP)],
    [P(['line-height']), S(STEP)],
  ],
  text: [[V(ROLE), S(SIZE)]],
  color: [
    [P(['fg']), S([...WORD, 'on-solid'])],
    [P(['fg']), V(['link']), S(LINK_STATE)],
    [P(['fg']), V(['on-inverse']), S(WORD)],
    [P(['fg']), V(['on-inverse']), V(['link']), S(LINK_STATE)],
    [P(['fg']), F(FAMILY), S([...WORD, 'on-solid'])],
    [P(['bg']), S(WORD)],
    [P(['bg']), V(['ghost', 'soft']), S(STATE)],
    [P(['bg']), V(['solid']), S(SOLID_STATE)],
    [P(['bg']), F(FAMILY), S(WORD)],
    [P(['bg']), F(FAMILY), V(['ghost', 'soft']), S(STATE)],
    [P(['bg']), F(FAMILY), V(['solid']), S(SOLID_STATE)],
    [P(['border']), S([...WORD, 'focus', 'inverse', 'solid'])],
    [P(['border']), F(FAMILY), S([...WORD, 'solid'])],
    [P(['plane']), S(['high', 'mid', 'low', 'dim'])],
    [P(['surface']), S(['high', 'mid', 'low', 'dim', 'inverse', 'scrim'])],
    [P(['illustration']), S(['paper', 'chalk-light', 'chalk', 'highlighter', 'pencil', 'pen', 'shadow', 'shine'])],
  ],
  shadow: [[S(SHADOW)]],
} as const satisfies Record<string, readonly (readonly Segment[])[]>

export type Category = keyof typeof SHAPES
// document order: the order the categories appear in every output
export const CATEGORIES = Object.keys(SHAPES) as Category[]
