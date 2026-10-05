// Derive: each declaration becomes its tokens. Every name here comes from a rule and a
// declared value, primitives first and the semantic rows after them, so the order of a
// declaration is the order of the file.
import { baseUnit } from '../declarations/scale.ts'
import { stepName, type TokenPath } from '../grammar/path.ts'
import { SIZE, type Size } from '../grammar/words.ts'
import type {
  SpaceDeclaration, SizeDeclaration, RadiusDeclaration, BorderWidthDeclaration,
  OpacityDeclaration, MotionDeclaration, BreakpointDeclaration,
} from './declare.ts'
import { px, ms, type Token } from './types.ts'

/** the step name of a pixel value: its number of base units times 100 */
export const pxStep = (value: number): string => stepName((value * 100) / baseUnit)

const PREFER_SEMANTIC = 'Where a semantic token covers the case, use that instead'

// a semantic row names its target by pixel value; a value with no step is a declaration
// error, raised here so it never reaches a file as a dangling alias
const stepFor = (group: string, steps: readonly number[], value: number, who: string): TokenPath => {
  if (!steps.includes(value)) throw new Error(`${who}: ${value} px is not a step of ${group}`)
  return [group, pxStep(value)]
}

// size words in the glossary's order, whatever order the declaration lists them in
const bySize = <T>(sizes: Partial<Record<Size, T>>): [Size, T][] =>
  SIZE.filter(s => sizes[s] !== undefined).map(s => [s, sizes[s] as T])

export function spaceTokens(d: SpaceDeclaration): Token[] {
  const steps: Token[] = d.steps.map(v => ({
    path: ['space', pxStep(v)], layer: 'primitive', type: 'dimension', value: px(v),
    req: d.purpose, use: `${v} px. ${PREFER_SEMANTIC}`,
  }))
  const negatives: Token[] = d.negative.steps.map(v => {
    stepFor('space', d.steps, v, 'negative space')
    return {
      path: ['space', 'negative', pxStep(v)], layer: 'primitive', type: 'dimension', value: px(-v),
      req: d.negative.purpose, use: `-${v} px, the mirror of space/${pxStep(v)}. For overlap only`,
    }
  })
  const semantic: Token[] = d.semantic.map(row => {
    const path = ['space', row.property, row.where, row.density]
    const place = d.places[row.where]
    if (!place) throw new Error(`${path.join('/')}: no place text for "${row.where}"`)
    const target = stepFor('space', d.steps, row.px, path.join('/'))
    return {
      path, layer: 'semantic', type: 'dimension', alias: target,
      req: row.covers.join('; '),
      use: `the ${row.density} ${row.property} ${place}; ${row.px} px through ${target.join('/')}`,
    }
  })
  return [...steps, ...negatives, ...semantic]
}

export function sizeTokens(d: SizeDeclaration): Token[] {
  const steps: Token[] = d.steps.map(v => ({
    path: ['size', pxStep(v)], layer: 'primitive', type: 'dimension', value: px(v),
    req: d.purpose, use: `${v} px. ${PREFER_SEMANTIC}`,
  }))
  const named = (kind: 'icon' | 'control', what: string): Token[] =>
    bySize(d[kind].sizes).map(([word, v]) => {
      const path = ['size', kind, word]
      const target = stepFor('size', d.steps, v, path.join('/'))
      return {
        path, layer: 'semantic', type: 'dimension', alias: target,
        req: d[kind].purpose, use: `the ${word} ${what}; ${v} px through ${target.join('/')}`,
      }
    })
  const content: Token[] = Object.entries(d.content).map(([word, row]) => ({
    path: ['size', 'content', word], layer: 'semantic', type: 'dimension', value: px(row.px),
    req: row.req, use: `${row.px} px, a width above the size scale`,
  }))
  return [...steps, ...named('icon', 'icon'), ...named('control', 'control height'), ...content]
}

export function radiusTokens(d: RadiusDeclaration): Token[] {
  return [
    ...d.steps.map((row): Token => ({
      path: ['radius', pxStep(row.px)], layer: 'primitive', type: 'dimension', value: px(row.px),
      req: row.req, use: `${row.px} px`,
    })),
    {
      path: ['radius', 'full'], layer: 'primitive', type: 'dimension', value: px(d.full.px),
      req: d.full.req, use: 'fully rounded ends at any height',
    },
  ]
}

export function borderWidthTokens(d: BorderWidthDeclaration): Token[] {
  return d.steps.map(v => ({
    path: ['border-width', pxStep(v)], layer: 'primitive', type: 'dimension', value: px(v),
    req: d.purpose, use: `${v} px`,
  }))
}

export function opacityTokens(d: OpacityDeclaration): Token[] {
  return [
    ...d.steps.map((percent): Token => ({
      path: ['opacity', stepName(percent)], layer: 'primitive', type: 'number', value: percent / 100,
      req: d.purpose, use: `${percent} percent`,
    })),
    {
      path: ['opacity', 'disabled'], layer: 'semantic', type: 'number', value: d.disabled.percent / 100,
      req: d.disabled.req, use: `${d.disabled.percent} percent, applied to the whole component`,
    },
  ]
}

export function motionTokens(d: MotionDeclaration): Token[] {
  const easings: Token[] = Object.entries(d.easing).map(([word, row]) => ({
    path: ['motion', 'easing', word], layer: 'primitive', type: 'cubicBezier', value: row.curve,
    req: row.req, use: `cubic-bezier(${row.curve.join(', ')})`,
  }))
  const durations: Token[] = d.duration.steps.map(row => ({
    path: ['motion', 'duration', stepName(row.ms)], layer: 'primitive', type: 'duration', value: ms(row.ms),
    req: row.req, use: `${row.ms} ms`,
  }))
  const transitions: Token[] = Object.entries(d.transition).map(([word, row]) => {
    const path = ['motion', 'transition', word]
    if (!d.easing[row.easing]) throw new Error(`${path.join('/')}: no easing named "${row.easing}"`)
    if (!d.duration.steps.some(s => s.ms === row.ms)) throw new Error(`${path.join('/')}: ${row.ms} ms is not a duration step`)
    const duration = ['motion', 'duration', stepName(row.ms)]
    const timingFunction = ['motion', 'easing', row.easing]
    return {
      path, layer: 'semantic', type: 'transition', value: { duration, delay: ms(0), timingFunction },
      req: row.req, use: `${timingFunction.join('/')} over ${duration.join('/')}, with no delay`,
    }
  })
  return [...easings, ...durations, ...transitions]
}

export function breakpointTokens(d: BreakpointDeclaration): Token[] {
  return bySize(d.widths).map(([word, row]) => ({
    path: ['breakpoint', word], layer: 'primitive', type: 'dimension', value: px(row.px),
    req: row.req, use: `a minimum width of ${row.px} px`,
  }))
}
