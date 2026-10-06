// Derive, the color half: the semantic color set as aliases onto the engine's rows, and
// the pairs that a hand composes with an opacity. Property first, then the family, then
// the emphasis word or the state; the neutral has no family word. The surfaces vary by
// theme context and go to the theme collection; everything else is one alias and goes
// to the palette.
import { THEME_CONTEXTS, type ThemeContext } from '../declarations/collections.ts'
import { stepName, type TokenPath } from '../grammar/path.ts'
import { FAMILY, STATE, type State, type Word } from '../grammar/words.ts'
import type { ColorDeclaration, Ladder, OpacityDeclaration } from './declare.ts'
import { color, type Token, type Value } from './types.ts'

/** the engine's path for a family's leaf */
const E = (family: string, leaf: string): TokenPath => ['color', family, ...leaf.split('/')]
const LINK = (posture: 'default' | 'inverse', state: string): TokenPath => ['color', 'link', posture, state]
const alias = (target: TokenPath): Value => ({ type: 'color', alias: target })
const transparent: Value = { type: 'color', value: color('#000000', 0) }
const black: Value = { type: 'color', value: color('#000000') }

const row = (path: TokenPath, value: Value, req: string, use: string, pair?: TokenPath, reserved = false, figmaScopes?: readonly string[]): Token =>
  ({ path, layer: 'semantic', req, use, value, ...(pair ? { pair } : {}), ...(reserved ? { reserved: true as const } : {}), ...(figmaScopes ? { figmaScopes } : {}) })

/** the indefinite article a family word takes */
const an = (word: string): string => `${/^[aeiou]/.test(word) ? 'an' : 'a'} ${word}`

const STATE_TEXT: Record<State, string> = { enabled: 'at rest', hover: 'under the pointer', pressed: 'while pressed', selected: 'when selected' }
const LINK_STATES = ['enabled', 'hover', 'pressed'] as const
const GHOST_STATES = ['hover', 'pressed', 'selected'] as const
const SOLID_STATES = ['enabled', 'hover', 'pressed'] as const

export function opacitySemanticTokens(d: OpacityDeclaration): Token[] {
  const step = (percent: number, who: string): TokenPath => {
    if (!d.steps.includes(percent)) throw new Error(`${who}: ${percent} percent is not a step of the opacity scale`)
    return ['opacity', stepName(percent)]
  }
  const num = (target: TokenPath): Value => ({ type: 'number', alias: target })
  return [
    row(['opacity', 'scrim'], num(step(d.scrim.percent, 'opacity/scrim')), d.scrim.req, `${d.scrim.percent} percent of black, the ground behind a modal`),
    ...GHOST_STATES.map(s => row(['opacity', 'ghost', s], num(step(d.ghost[s], `opacity/ghost/${s}`)), `the ghost ground ${STATE_TEXT[s]}`, `${d.ghost[s]} percent of a family's highlighter over the surface; at rest the ghost ground is transparent`)),
    ...STATE.map(s => row(['opacity', 'soft', s], num(step(d.soft[s], `opacity/soft/${s}`)), `the soft ground ${STATE_TEXT[s]}`, `${d.soft[s]} percent of a family's highlighter over the surface`)),
  ]
}

export function colorTokens(d: ColorDeclaration, o: OpacityDeclaration): Token[] {
  const out: Token[] = []
  const n = (leaf: string) => E('neutral', leaf)

  // surfaces: the planes, in the engine's order per mode, so elevation always moves
  // toward the page pole's side of the ramp
  const planes: Record<string, Record<ThemeContext, string>> = {
    dim: { light: 'paper-5', dark: 'paper-0' },
    low: { light: 'paper-3', dark: 'paper-1' },
    mid: { light: 'paper-1', dark: 'paper-3' },
    high: { light: 'paper-0', dark: 'paper-5' },
  }
  const planeText: Record<string, string> = {
    high: 'the raised surface: a card, a menu, a dialog, an input', mid: 'the resting surface of a panel or a section',
    low: 'a recessed surface: an inset well, a table header', dim: 'the page behind everything',
  }
  for (const [name, by] of Object.entries(planes)) {
    const byContext = Object.fromEntries(THEME_CONTEXTS.map(c => [c, alias(n(by[c]))])) as Record<ThemeContext, Value>
    out.push({ path: ['color', 'surface', name], layer: 'semantic', req: planeText[name], use: 'elevation moves toward the page pole in both modes; a shadow marks the step in light', value: byContext.light, byContext })
  }
  out.push(row(['color', 'surface', 'inverse'], alias(n('pen-70')), 'an inverted banner, card or toast', 'the ground the on-inverse text and links are solved against; not interactive'))
  out.push(row(['color', 'surface', 'scrim'], black, 'the scrim behind a modal', 'black', ['opacity', 'scrim']))

  // a property's ladder for one family: each word the family is offered, on the stop
  // the word names
  const ladder = (property: string, l: Ladder, family: string | null, prefix: string[] = []): void => {
    const words: readonly Word[] = family ? l.family : l.neutral
    for (const w of words) {
      const rung = l.stops[w]
      if (!rung) throw new Error(`color/${property}: the word ${w} is offered but names no stop`)
      const path: TokenPath = ['color', property, ...prefix, ...(family ? [family] : []), w]
      const req = family ? `${rung.req}, in the ${family} color` : rung.req
      out.push(row(path, alias(E(family ?? 'neutral', rung.stop)), req, rung.use, undefined, !!(family ? l.reserved?.family : l.reserved?.neutral)?.includes(w), rung.shapesOnly ? ['SHAPE_FILL'] : undefined))
    }
  }

  // the interaction levels under bg, cordoned by level: ghost and soft are the family's
  // highlighter at the level's opacity, as pairs; solid is the engine's stamp, with its
  // edge under border and its on-text under fg. Every level is emitted for parity; a
  // level the family is not offered is reserved for components.
  const interaction = (family: string | null): void => {
    const fam = family ?? 'neutral'
    const into: TokenPath = ['color', 'bg', ...(family ? [family] : [])]
    const who = family ? `${an(family)} control` : 'a neutral control'
    const offered = family ? d.interaction.family : d.interaction.neutral
    const hl = E(fam, 'highlighter-26')
    const ghost = !offered.includes('ghost'), soft = !offered.includes('soft'), solid = !offered.includes('solid')
    out.push(row([...into, 'ghost', 'enabled'], transparent, `the ghost ground of ${who}, at rest`, 'transparent: ghost and outline buttons, icon buttons, rows and menu items show the surface', undefined, ghost))
    for (const s of GHOST_STATES) out.push(row([...into, 'ghost', s], alias(hl), `the ghost ground of ${who}, ${STATE_TEXT[s]}`, 'the highlighter at an opacity, over the surface', ['opacity', 'ghost', s], ghost))
    for (const s of STATE) out.push(row([...into, 'soft', s], alias(hl), `the soft ground of ${who}, ${STATE_TEXT[s]}`, 'a tint at rest, stronger when touched: chips, a selected tab, a soft button; the highlighter at an opacity', ['opacity', 'soft', s], soft))
    const stampLeaf: Record<(typeof SOLID_STATES)[number], string> = { enabled: 'stamp/fill', hover: 'stamp/fill-hover', pressed: 'stamp/fill-pressed' }
    for (const s of SOLID_STATES) out.push(row([...into, 'solid', s], alias(E(fam, stampLeaf[s])), `the solid ground of ${who}, ${STATE_TEXT[s]}`, `the engine's stamp, solved per brand; always with the on-solid text and the solid border`, undefined, solid))
    out.push(row(['color', 'border', ...(family ? [family] : []), 'solid'], alias(E(fam, 'stamp/edge')), `the edge of the solid ground of ${who}`, 'always drawn; it resolves to transparent where the fill needs no edge, so layout never shifts', undefined, solid))
    out.push(row(['color', 'fg', ...(family ? [family] : []), 'on-solid'], alias(E(fam, 'stamp/on')), `text and icons over the solid ground of ${who}`, 'the only text color over the solid fill; never elsewhere', undefined, solid))
  }

  // the neutral
  ladder('fg', d.fg, null)
  for (const s of LINK_STATES) out.push(row(['color', 'fg', 'link', s], alias(LINK('default', s)), `a link in running text, ${STATE_TEXT[s]}`, 'links no component owns; the Link component binds the same rows'))
  ladder('fg', d.onInverse, null, ['on-inverse'])
  for (const s of LINK_STATES) out.push(row(['color', 'fg', 'on-inverse', 'link', s], alias(LINK('inverse', s)), `a link on an inverted ground, ${STATE_TEXT[s]}`, 're-solved for the inverted ground'))
  ladder('border', d.border, null)
  out.push(row(['color', 'border', 'focus'], alias(E(d.focus, 'highlighter-26')), 'the focus ring', 'drawn the same on every control, outside its edge'))
  out.push(row(['color', 'border', 'inverse'], alias(n('paper-0')), 'borders on an inverted ground', `on ${['color', 'surface', 'inverse'].join('/')} only`))
  ladder('bg', d.bg, null)
  interaction(null)

  // each colored family: the same ladders, the words the families are offered
  for (const f of FAMILY) {
    ladder('fg', d.fg, f)
    ladder('border', d.border, f)
    ladder('bg', d.bg, f)
    interaction(f)
  }

  // the brand illustration palette
  const ill: Record<string, [string, string]> = {
    paper: ['paper-5', 'the palest wash'], 'chalk-light': ['chalk-11', 'a light fill'], chalk: ['chalk-20', 'a mid fill'],
    highlighter: ['highlighter-26', 'an accent'], pencil: ['pencil-47', 'a line or a dark fill'], pen: ['pen-58', 'the darkest line'],
  }
  for (const [name, [leaf, req]] of Object.entries(ill)) out.push(row(['color', 'illustration', name], alias(E('brand', leaf)), `illustration: ${req}`, 'the brand illustration palette only; never UI'))
  const opStep = (percent: number, who: string): TokenPath => {
    if (!o.steps.includes(percent)) throw new Error(`${who}: ${percent} percent is not a step of the opacity scale`)
    return ['opacity', stepName(percent)]
  }
  out.push(row(['color', 'illustration', 'shadow'], alias(E('brand', 'pen-58')), 'illustration: a cast shadow', 'the darkest line at an opacity', opStep(d.illustration.shadow, 'illustration/shadow')))
  out.push(row(['color', 'illustration', 'shine'], alias(E('brand', 'paper-5')), 'illustration: a highlight', 'the palest wash at an opacity', opStep(d.illustration.shine, 'illustration/shine')))
  return out
}
