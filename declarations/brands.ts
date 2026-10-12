// The brands: each one's elections for the color engine, the choices its plugin offers in
// its panel, held as data so the engine's documents are generated with the rest of the
// set and never copied in. Every brand gets its own engine documents and resolver; the
// default brand is the one the shared outputs are built for: resolver.json, the Figma
// payload and the pages. Theming is static at build time, so adding a brand is an entry
// here and a build.
import type { NeutralLevel, SecondaryStyle } from 'okchroma'

export type Election = {
  /** the brand seed */
  primaryHex: string
  /** an exact second family; absent, the engine derives a quiet companion from the brand hue */
  secondaryHex?: string
  secondaryStyle?: SecondaryStyle
  /** how much of the brand hue the neutral carries */
  neutralLevel?: NeutralLevel
  /** the neutral stamp escape: the call to action moves onto the neutral's strong pen when the brand sits on a signal */
  ctaEscape?: boolean
  /** a link seed; the engine resolves the link trios from it */
  linkHex?: string
  /** the gated stamp edge; on by default */
  ctaBorder?: boolean
}

/** the contrast profile every brand is solved under */
export const PROFILE = 'wcag' as const

export const brands: Record<string, Election> = {
  // the showcase's brand: the seed the set was built and proven on
  sample: { primaryHex: '#044BAF' },
  // a deep violet with an exact second family, from the proof of concept
  eggplant: { primaryHex: '#431C5B', secondaryHex: '#4BCD3E', secondaryStyle: 'exact' },
}

export const DEFAULT_BRAND = 'sample'
