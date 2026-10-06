// The token model every stage shares: derive writes it, the emitters and the audit read
// it. A token holds one value, a literal of one of the format's types or an alias to
// another token, and may hold a different value per context when its collection has
// contexts.
import type { TokenPath } from '../grammar/path.ts'

export type Layer = 'primitive' | 'semantic'

export type Dimension = { value: number; unit: 'px' }
export type Duration = { value: number; unit: 'ms' }
export type Curve = readonly [number, number, number, number]
/** a transition's parts are references, so a pair can never drift from its scale */
export type Transition = { duration: TokenPath; delay: Duration; timingFunction: TokenPath }
/** a text style's parts reference the font scale; letter spacing is a length the style computes from its size */
export type Typography = { fontFamily: TokenPath; fontSize: TokenPath; fontWeight: TokenPath; letterSpacing: Dimension; lineHeight: TokenPath }

/** the Color Module shape the engine's files use: the 8-bit channels over 255 and the same color as hex */
export type Color = { colorSpace: 'srgb'; components: readonly [number, number, number]; alpha: number; hex: string }

export type Literal =
  | { type: 'color'; value: Color }
  | { type: 'dimension'; value: Dimension }
  | { type: 'number'; value: number }
  | { type: 'duration'; value: Duration }
  | { type: 'cubicBezier'; value: Curve }
  | { type: 'transition'; value: Transition }
  | { type: 'fontFamily'; value: readonly string[] }
  | { type: 'fontWeight'; value: number }
  | { type: 'typography'; value: Typography }
export type TokenType = Literal['type']
export type Alias = { type: TokenType; alias: TokenPath }
export type Value = Literal | Alias

export type Token = {
  path: TokenPath
  /** recorded here and never spelled in the name */
  layer: Layer
  /** what the token is required for: documented uses only */
  req: string
  /** how to use it: for what, not for what, always with what */
  use: string
  value: Value
  /** one value per context, for a token whose collection has contexts; absent means the same value in every context */
  byContext?: Readonly<Record<string, Value>>
  /** the opacity token this color is composed with by hand; neither the file nor the plugin API can compose them */
  pair?: TokenPath
  /** emitted for component authors and hidden from publishing in Figma, so the wider designers do not see it */
  reserved?: true
  /** Figma scopes narrower than the property's, where a row must stay out of a picker */
  figmaScopes?: readonly string[]
}

export const isAlias = (v: Value): v is Alias => 'alias' in v

/** the value a token holds in a context, or its one value */
export const valueIn = (t: Token, context?: string): Value => (context !== undefined && t.byContext?.[context]) || t.value

export const px = (value: number): Dimension => ({ value, unit: 'px' })
/** a color from six hex digits and an alpha, components as the engine writes them */
export const color = (hex: string, alpha = 1): Color => {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!m) throw new Error(`color: not six hex digits: ${hex}`)
  const c = (s: string) => Math.round((parseInt(s, 16) / 255) * 1e4) / 1e4
  return { colorSpace: 'srgb', components: [c(m[1]), c(m[2]), c(m[3])], alpha, hex: hex.toLowerCase() }
}
export const ms = (value: number): Duration => ({ value, unit: 'ms' })
