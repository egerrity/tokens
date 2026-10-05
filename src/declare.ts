// The shape of each declaration: only what a designer decides. Names, aliases and the
// values that follow from a rule are derived; if a value cannot be derived from a
// decision here, it is a decision and gets a field.
import type { Density, Role, Size } from '../grammar/words.ts'
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
