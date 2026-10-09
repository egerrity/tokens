// The one grammar: a token has one path, and every spelling is derived from it. Joined
// with slashes it is the Figma variable, with hyphens the CSS name (after the build's
// prefix), with dots inside braces the alias in a token file. Nothing spells a name by
// hand.
import { SHAPES, STEP, isStep, type Category, type Segment, type Slot } from './words.ts'

export type TokenPath = readonly string[]

export const figmaName = (path: TokenPath): string => path.join('/')
/** the CSS name without the build's prefix; unique if and only if the prefixed name is */
export const cssBody = (path: TokenPath): string => path.join('-')
export const aliasOf = (path: TokenPath): string => `{${path.join('.')}}`

// lower-case words and digits, hyphens between words; the format forbids `$`, `.`, `{`
// and `}`, and no capitals means no two names differ only by case
export const legalSegment = (s: string): boolean => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)

/** the step name of a scale position: at least three digits */
export const stepName = (n: number): string => {
  if (!Number.isInteger(n) || n < 0) throw new Error(`stepName: not a whole, positive step: ${n}`)
  return String(n).padStart(3, '0')
}

const matches = (segment: Segment, word: string): boolean =>
  segment.words === STEP ? isStep(word) : segment.words.includes(word)

/** the shape a path matches: its category's shape of the same length whose every segment admits the word */
const shapeOf = (path: TokenPath): readonly Segment[] | undefined => {
  const shapes: readonly (readonly Segment[])[] | undefined = SHAPES[path[0] as Category]
  if (!shapes) return undefined
  const rest = path.slice(1)
  return shapes.find(shape => shape.length === rest.length && shape.every((seg, i) => matches(seg, rest[i])))
}

/** true when the path is its category followed by one of that category's shapes */
export const matchesGrammar = (path: TokenPath): boolean => shapeOf(path) !== undefined

/** the slot each segment after the category fills, for a path the grammar allows */
export const slotsOf = (path: TokenPath): readonly Slot[] | undefined => shapeOf(path)?.map(seg => seg.slot)
