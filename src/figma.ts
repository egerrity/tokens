// The Figma payload: the same tokens as the Figma variables and text styles they
// become, one file per collection and one for the text styles. A script inside Figma
// applies it (scripts/figma/apply.js): it finds each variable or style by its stamp, or
// by today's name where nothing is stamped yet, renames it in place and sets its values,
// so bindings survive. The payload is a rendering of the roster, never a second source:
// every value here is a conversion of a token value, stated beside the conversion.
import { collections, collectionOf } from '../declarations/collections.ts'
import { todayMode, todayStyle, todayVariable } from '../declarations/renames.ts'
import { figmaName, type TokenPath } from '../grammar/path.ts'
import { isAlias, valueIn, type Token, type Value } from './types.ts'

export type FigmaType = 'FLOAT' | 'STRING' | 'EASING' | 'TIMING' | 'COLOR'
export type FigmaValue = number | string | { alias: string } | { easing: readonly [number, number, number, number] } | { color: string; alpha: number }
export type FigmaVariable = {
  path: string
  today?: string
  type: FigmaType
  /** absent means the variable is left on Figma's default, every picker */
  scopes?: string[]
  description: string
  /** hidden from publishing: in the library for its components, not in the consumers' pickers */
  hidden?: true
  values: Record<string, FigmaValue>
}
export type FigmaCollectionPayload = {
  kind: 'variables'
  collection: string
  today?: string
  modes: string[]
  todayModes: Record<string, string>
  variables: FigmaVariable[]
  /** tokens with no variable form, by path */
  omitted: string[]
}
export type FigmaTextStyle = {
  name: string
  today?: string
  description: string
  family: string
  /** the font's style name, for loading it before the style is set */
  fontStyle: string
  /** the values at the default context, set before the parts are bound; Figma binds line height and letter spacing as pixels */
  fontSize: number
  lineHeightPx: number
  letterSpacingPx: number
  parts: Record<'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing', string>
}
export type FigmaStylesPayload = { kind: 'text-styles'; styles: FigmaTextStyle[] }

// the style word a weight loads under, as the families name their styles
const FONT_STYLE: Record<number, string> = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold' }

const SCOPES: Record<string, string[]> = {
  space: ['GAP'],
  size: ['WIDTH_HEIGHT'],
  radius: ['CORNER_RADIUS'],
  'border-width': ['STROKE_FLOAT'],
  opacity: ['OPACITY'],
  breakpoint: ['WIDTH_HEIGHT'],
  'grid/columns': [],
  'grid/margin': ['GAP'],
  'grid/gutter': ['GAP'],
  'grid/max-width': ['WIDTH_HEIGHT'],
  'font/family': ['FONT_FAMILY'],
  'font/weight': ['FONT_WEIGHT'],
  'font/size': ['FONT_SIZE'],
  'text/font-family': ['FONT_FAMILY'],
  'text/font-size': ['FONT_SIZE'],
  'text/font-weight': ['FONT_WEIGHT'],
  'text/line-height': ['LINE_HEIGHT'],
  'text/letter-spacing': ['LETTER_SPACING'],
  'color/fg': ['TEXT_FILL', 'SHAPE_FILL'],
  'color/bg': ['FRAME_FILL', 'SHAPE_FILL'],
  'color/border': ['STROKE_COLOR'],
  'color/surface': ['FRAME_FILL'],
  'color/illustration': ['ALL_FILLS', 'STROKE_COLOR'],
}
const scopesFor = (path: TokenPath, part?: string): string[] | undefined =>
  SCOPES[part ? `text/${part}` : path[0] === 'grid' || path[0] === 'font' || path[0] === 'color' ? `${path[0]}/${path[1]}` : path[0]]

/**
 * The Figma description: the same lines, minus any line that carries a digit, because
 * Figma's variable picker searches descriptions and a digit would make every query with
 * that digit match the row.
 */
export const describeFigma = (t: Token): string =>
  [`Req for: ${t.req}`, `Use: ${t.use}`, ...(t.pair ? [`Compose by hand with ${figmaName(t.pair)}`] : []), ...(t.reserved ? ['Reserved for components; hidden from publishing'] : [])].filter(line => !/\d/.test(line) || line.startsWith('Compose')).join('\n')

/** a token value as a Figma value, or undefined where Figma has no form for it */
function figmaValue(t: Token, v: Value): FigmaValue | undefined {
  if (isAlias(v)) return { alias: figmaName(v.alias) }
  switch (v.type) {
    case 'color': return { color: v.value.hex, alpha: v.value.alpha }
    case 'dimension': return v.value.value
    // opacity and line height are shown as percents in Figma
    // opacity is shown as a percent in Figma; a line height multiple has no variable form there
    case 'number': return t.path[1] === 'line-height' ? undefined : t.path[0] === 'opacity' ? Math.round(v.value * 1e4) / 100 : v.value
    case 'fontWeight': return v.value
    case 'fontFamily': return v.value[0]
    case 'duration': return v.value.value
    case 'cubicBezier': return { easing: v.value }
    default: return undefined
  }
}
const figmaType = (v: Value): FigmaType =>
  v.type === 'color' ? 'COLOR' : v.type === 'fontFamily' ? 'STRING' : v.type === 'cubicBezier' ? 'EASING' : v.type === 'duration' ? 'TIMING' : 'FLOAT'

/** the font size a text style has at a context, read through its reference */
function sizeAt(t: Token, context: string | undefined, byPath: Map<string, Token>): number {
  const v = valueIn(t, context)
  if (isAlias(v) || v.type !== 'typography') throw new Error(`${figmaName(t.path)}: not a text style`)
  const size = byPath.get(figmaName(v.value.fontSize))
  const sv = size && valueIn(size, context)
  if (!sv || isAlias(sv) || sv.type !== 'dimension') throw new Error(`${figmaName(t.path)}: its font size does not resolve to a length`)
  return sv.value.value
}
/** a text style's letter spacing at a context, the length the token already holds */
const letterSpacingPx = (t: Token, context: string | undefined): number => {
  const v = valueIn(t, context)
  return isAlias(v) || v.type !== 'typography' ? 0 : v.value.letterSpacing.value
}
/** a text style's line height at a context as a length: Figma binds line height in pixels, so the multiple is applied to the size here */
const lineHeightPx = (t: Token, context: string | undefined, byPath: Map<string, Token>): number => {
  const v = valueIn(t, context)
  if (isAlias(v) || v.type !== 'typography') return 0
  const lh = byPath.get(figmaName(v.value.lineHeight))?.value
  if (!lh || isAlias(lh) || lh.type !== 'number') throw new Error(`${figmaName(t.path)}: its line height does not resolve to a number`)
  return Math.round(sizeAt(t, context, byPath) * lh.value * 100) / 100
}

/** a text style's five parts, each a variable of its own in the style's collection */
function textParts(t: Token, modes: string[], byPath: Map<string, Token>): FigmaVariable[] {
  const parts: FigmaTextStyle['parts'] = {
    fontFamily: `${figmaName(t.path)}/font-family`,
    fontSize: `${figmaName(t.path)}/font-size`,
    fontWeight: `${figmaName(t.path)}/font-weight`,
    lineHeight: `${figmaName(t.path)}/line-height`,
    letterSpacing: `${figmaName(t.path)}/letter-spacing`,
  }
  const per = (f: (v: Extract<Value, { type: 'typography' }>, context: string) => FigmaValue): Record<string, FigmaValue> =>
    Object.fromEntries(modes.map(m => {
      const v = valueIn(t, m)
      if (isAlias(v) || v.type !== 'typography') throw new Error(`${figmaName(t.path)}: not a text style`)
      return [m, f(v, m)]
    }))
  const variable = (part: keyof typeof parts, type: FigmaType, values: Record<string, FigmaValue>): FigmaVariable => ({
    path: parts[part], today: todayVariable(t.path, part), type, scopes: scopesFor(t.path, part.replace(/[A-Z]/g, c => '-' + c.toLowerCase())),
    description: describeFigma(t), values,
  })
  return [
    variable('fontFamily', 'STRING', per(v => ({ alias: figmaName(v.value.fontFamily) }))),
    variable('fontSize', 'FLOAT', per(v => ({ alias: figmaName(v.value.fontSize) }))),
    variable('fontWeight', 'FLOAT', per(v => ({ alias: figmaName(v.value.fontWeight) }))),
    variable('lineHeight', 'FLOAT', per((_, m) => lineHeightPx(t, m, byPath))),
    variable('letterSpacing', 'FLOAT', per((_, m) => letterSpacingPx(t, m))),
  ]
}

export function figmaPayloads(tokens: Token[], outside: Token[] = []): { collections: FigmaCollectionPayload[]; styles: FigmaStylesPayload } {
  const byPath = new Map(tokens.map(t => [figmaName(t.path), t]))
  const out: FigmaCollectionPayload[] = []
  for (const [collection, c] of Object.entries(collections)) {
    const modes = c.contexts.length ? [...c.contexts] : ['value']
    const payload: FigmaCollectionPayload = {
      kind: 'variables', collection, today: c.today, modes,
      todayModes: Object.fromEntries(modes.filter(m => todayMode[m]).map(m => [m, todayMode[m]])),
      variables: [], omitted: [],
    }
    // the engine's rows ride first in the collection they are external to, so the rows
    // that alias them can resolve; our own rows go where collectionOf files them
    const rows: Token[] = [...(c.external ? outside : []), ...tokens.filter(t => collectionOf(t) === collection)]
    for (const t of rows) {
      if (t.value.type === 'typography') { payload.variables.push(...textParts(t, modes, byPath)); continue }
      const values: Record<string, FigmaValue> = {}
      let omitted = false
      for (const m of modes) {
        const fv = figmaValue(t, valueIn(t, c.contexts.length ? m : undefined))
        if (fv === undefined) { omitted = true; break }
        values[m] = fv
      }
      if (omitted) { payload.omitted.push(figmaName(t.path)); continue }
      payload.variables.push({
        path: figmaName(t.path), today: todayVariable(t.path), type: figmaType(t.value),
        scopes: t.figmaScopes ? [...t.figmaScopes] : scopesFor(t.path), description: describeFigma(t), ...(t.reserved ? { hidden: true as const } : {}), values,
      })
    }
    out.push(payload)
  }
  const styles: FigmaTextStyle[] = tokens.filter(t => t.value.type === 'typography').map(t => {
    const v = t.value
    if (isAlias(v) || v.type !== 'typography') throw new Error('unreachable')
    const family = byPath.get(figmaName(v.value.fontFamily))?.value
    const weight = byPath.get(figmaName(v.value.fontWeight))?.value
    const lineHeight = byPath.get(figmaName(v.value.lineHeight))?.value
    if (!family || isAlias(family) || family.type !== 'fontFamily') throw new Error(`${figmaName(t.path)}: family does not resolve`)
    if (!weight || isAlias(weight) || weight.type !== 'fontWeight') throw new Error(`${figmaName(t.path)}: weight does not resolve`)
    if (!lineHeight || isAlias(lineHeight) || lineHeight.type !== 'number') throw new Error(`${figmaName(t.path)}: line height does not resolve`)
    const fontStyle = FONT_STYLE[weight.value]
    if (!fontStyle) throw new Error(`${figmaName(t.path)}: no font style name for weight ${weight.value}`)
    const name = figmaName(t.path)
    return {
      name, today: todayStyle(t.path), description: describeFigma(t),
      family: family.value[0], fontStyle,
      fontSize: sizeAt(t, undefined, byPath),
      lineHeightPx: lineHeightPx(t, undefined, byPath),
      letterSpacingPx: letterSpacingPx(t, undefined),
      parts: {
        fontFamily: `${name}/font-family`, fontSize: `${name}/font-size`, fontWeight: `${name}/font-weight`,
        lineHeight: `${name}/line-height`, letterSpacing: `${name}/letter-spacing`,
      },
    }
  })
  return { collections: out, styles: { kind: 'text-styles', styles } }
}

/** the payload as files, keyed by file name */
export function figmaFiles(tokens: Token[], outside: Token[] = []): Record<string, string> {
  const { collections: cs, styles } = figmaPayloads(tokens, outside)
  const files: Record<string, string> = {}
  for (const c of cs) files[`${c.collection}.json`] = JSON.stringify(c, null, 2) + '\n'
  files['text-styles.json'] = JSON.stringify(styles, null, 2) + '\n'
  return files
}
