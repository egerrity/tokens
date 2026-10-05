// The shape of each declaration: only what a designer decides. Names, aliases and the
// values that follow from a rule are derived; if a value cannot be derived from a
// decision here, it is a decision and gets a field.
import type { Density, Size } from '../grammar/words.ts'
import type { Curve } from './types.ts'

/** a step on a pixel scale, with the use the docs give it where they give one */
export type PxStep = number | { px: number; req: string }

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
  /** widths above the scale: each holds its own value */
  content: Record<string, { px: number; req: string }>
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
