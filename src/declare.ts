// The shape of each declaration: only what a designer decides. Names, aliases and the
// values that follow from a rule are derived; if a value cannot be derived from a
// decision here, it is a decision and gets a field.
import type { Density, Family, Level, Role, Size, State, Word } from '../grammar/words.ts'
import type { Curve } from './types.ts'

export type SpaceDeclaration = {
  purpose: string
  /** the scale, in px, ascending */
  steps: readonly number[]
  negative: { purpose: string; steps: readonly number[] }
  /** where a semantic gap or padding applies, in the words its description uses */
  places: Record<string, string>
  semantic: readonly {
    property: 'gap' | 'padding'
    where: string
    density: Density
    /** the primitive step it aliases, by its px value */
    px: number
    /** the documented cases it covers */
    covers: readonly string[]
  }[]
}

export type SizeDeclaration = {
  purpose: string
  steps: readonly number[]
  icon: { purpose: string; sizes: Partial<Record<Size, number>> }
  control: { purpose: string; sizes: Partial<Record<Size, number>> }
  /** each kind of illustration at its sizes; a size on the scale aliases its step, one above the scale holds its value */
  illustration: Record<string, { purpose: string; sizes: Partial<Record<Size, number>> }>
  /** the longest line of running text, a width above the scale */
  measure: { px: number; req: string; use: string }
}

export type RadiusDeclaration = {
  steps: readonly { px: number; req: string }[]
  full: { px: number; req: string }
}

export type BorderWidthDeclaration = { purpose: string; steps: readonly number[] }

export type OpacityDeclaration = {
  purpose: string
  /** the scale, in percent, ascending */
  steps: readonly number[]
  disabled: { percent: number; req: string }
  scrim: { percent: number; req: string }
  /** the two translucent interaction levels' steps per state, each a step of the scale; the ghost level is transparent at rest */
  ghost: Record<Exclude<State, 'enabled'>, number>
  soft: Record<State, number>
}

/**
 * An emphasis word's stop on the engine's ladder, and what the row is for. A rung that
 * is shapes-only is kept out of Figma's text picker: a stop that clears the non-text
 * bar but not the text bar.
 */
export type Rung = { stop: string; req: string; use: string; shapesOnly?: true }
/**
 * One property's ladder: which engine stop each emphasis word names (the same in the
 * neutral and in every family), which words the neutral and the families get, and which
 * of those are reserved for component authors: emitted, but hidden from publishing.
 */
export type Ladder = { stops: Partial<Record<Word, Rung>>; neutral: readonly Word[]; family: readonly Word[]; reserved?: { neutral?: readonly Word[]; family?: readonly Word[] } }

export type ColorDeclaration = {
  fg: Ladder
  /** text on the inverted surface; the neutral only */
  onInverse: Ladder
  bg: Ladder
  border: Ladder
  /** whose highlighter draws the focus ring */
  focus: Family | 'neutral'
  /**
   * The interaction levels under bg, every one emitted: ghost and soft on the family's
   * highlighter at the opacity scale's steps, solid on the engine's stamp. The levels
   * the neutral and the families are offered; the rest are reserved for components.
   */
  interaction: { neutral: readonly Level[]; family: readonly Level[] }
  /** the brand illustration palette's two pairs, as percent steps of the opacity scale */
  illustration: { shadow: number; shine: number }
}

export type MotionDeclaration = {
  easing: Record<string, { curve: Curve; req: string }>
  /** the scale, in ms, ascending; no duration may sit outside the bounds */
  duration: { bounds: { shortest: number; longest: number }; steps: readonly { ms: number; req: string }[] }
  /** each transition is one easing with one duration, by name and by ms */
  transition: Record<string, { easing: string; ms: number; req: string }>
}

export type BreakpointDeclaration = {
  /** minimum widths, in px */
  widths: Partial<Record<Size, { px: number; req: string }>>
}

/** a value per viewport; a viewport left out takes the one its fallback names */
export type ByViewport<T> = Readonly<Record<string, T>>

export type GridDeclaration = {
  columns: { req: string; count: ByViewport<number> }
  /** the width at which page content stops growing, per viewport */
  maxWidth: { req: string; use: string; px: ByViewport<number> }
  /** margin and gutter alias space steps, by px */
  margin: { req: string; px: ByViewport<number> }
  gutter: { req: string; px: ByViewport<number> }
}

export type FontDeclaration = {
  /** each family as the names a renderer tries in order, ending in a generic one */
  family: Record<string, { names: readonly string[]; req: string }>
  weight: Record<string, { value: number; req: string }>
  size: { purpose: string; steps: readonly number[] }
  /** multiples of the font size */
  lineHeight: { purpose: string; steps: readonly number[] }
}

export type TextDeclaration = {
  /** what each role is for */
  roles: Record<Role, string>
  styles: readonly {
    role: Role
    size: Size
    family: string
    weight: string
    /** a multiple of the font size, one of the line height steps */
    lineHeight: number
    /** percent of the font size; negative tightens */
    letterSpacing: number
    /** font size per viewport, by px on the font size scale; mobile is required */
    px: ByViewport<number> & { mobile: number }
  }[]
}
