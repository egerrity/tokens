// The token model every stage shares: derive writes it, the emitters and the audit read
// it. A token is a literal of one of the format's types, or an alias to another token.
import type { TokenPath } from '../grammar/path.ts'

export type Layer = 'primitive' | 'semantic'

export type Dimension = { value: number; unit: 'px' }
export type Duration = { value: number; unit: 'ms' }
export type Curve = readonly [number, number, number, number]
/** a transition's parts are references, so a pair can never drift from its scale */
export type Transition = { duration: TokenPath; delay: Duration; timingFunction: TokenPath }

export type Literal =
  | { type: 'dimension'; value: Dimension }
  | { type: 'number'; value: number }
  | { type: 'duration'; value: Duration }
  | { type: 'cubicBezier'; value: Curve }
  | { type: 'transition'; value: Transition }
export type TokenType = Literal['type']
export type Alias = { type: TokenType; alias: TokenPath }

export type Token = {
  path: TokenPath
  /** recorded here and never spelled in the name */
  layer: Layer
  /** what the token is required for: documented uses only */
  req: string
  /** how to use it: for what, not for what, always with what */
  use: string
} & (Literal | Alias)

export const isAlias = (t: Token): t is Token & Alias => 'alias' in t

export const px = (value: number): Dimension => ({ value, unit: 'px' })
export const ms = (value: number): Duration => ({ value, unit: 'ms' })
