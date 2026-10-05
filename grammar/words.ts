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
  opacity: [[STEP], [['disabled']]],
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
} as const satisfies Record<string, readonly (readonly Segment[])[]>

export type Category = keyof typeof SHAPES
// document order: the order the categories appear in every output
export const CATEGORIES = Object.keys(SHAPES) as Category[]
