// Derive: each declaration becomes its tokens. Every name here comes from a rule and a
// declared value, primitives first and the semantic rows after them, so the order of a
// declaration is the order of the file.
import { baseUnit } from '../declarations/scale.ts'
import { VIEWPORTS, viewportFallback, type Viewport } from '../declarations/collections.ts'
import { stepName, type TokenPath } from '../grammar/path.ts'
import { SIZE, type Size } from '../grammar/words.ts'
import type {
  SpaceDeclaration, SizeDeclaration, RadiusDeclaration, BorderWidthDeclaration,
  OpacityDeclaration, MotionDeclaration, BreakpointDeclaration, GridDeclaration,
  FontDeclaration, TextDeclaration, ShadowDeclaration, ByViewport,
} from './declare.ts'
import { px, ms, color, type Token, type Value } from './types.ts'

/** the step name of a pixel value: its number of base units times 100 */
export const pxStep = (value: number): string => stepName((value * 100) / baseUnit)
/** the step name of a multiple, such as a line height: the multiple times 100 */
export const multipleStep = (value: number): string => stepName(Math.round(value * 100))

const PREFER_SEMANTIC = 'Where a semantic token covers the case, use that instead'

// a semantic row names its target by value; a value with no step is a declaration
// error, raised here so it never reaches a file as a dangling alias
const stepFor = (group: TokenPath, steps: readonly number[], value: number, who: string, name: (v: number) => string = pxStep): TokenPath => {
  if (!steps.includes(value)) throw new Error(`${who}: ${value} is not a step of ${group.join('/')}`)
  return [...group, name(value)]
}

const dim = (v: number): Value => ({ type: 'dimension', value: px(v) })
const alias = (type: Value['type'], target: TokenPath): Value => ({ type, alias: target })

// size words in the glossary's order, whatever order the declaration lists them in
const bySize = <T>(sizes: Partial<Record<Size, T>>): [Size, T][] =>
  SIZE.filter(s => sizes[s] !== undefined).map(s => [s, sizes[s] as T])

/** a declared value per viewport, each missing viewport taking its fallback's */
function perViewport<T>(declared: ByViewport<T>, who: string): Record<Viewport, T> {
  const out = {} as Record<Viewport, T>
  const resolve = (v: Viewport): T => {
    if (declared[v] !== undefined) return declared[v]
    const next = viewportFallback[v]
    if (!next) throw new Error(`${who}: no value for ${v} and nothing to fall back on`)
    return resolve(next)
  }
  for (const v of VIEWPORTS) out[v] = resolve(v)
  return out
}

/** a token whose value differs by viewport; its one value is the default context's */
const contextual = (base: Omit<Token, 'value' | 'byContext'>, byContext: Record<Viewport, Value>): Token =>
  ({ ...base, value: byContext.desktop, byContext })

export function spaceTokens(d: SpaceDeclaration): Token[] {
  const steps: Token[] = d.steps.map(v => ({
    path: ['space', pxStep(v)], layer: 'primitive', value: dim(v),
    req: d.purpose, use: `${v} px. ${PREFER_SEMANTIC}`,
  }))
  const negatives: Token[] = d.negative.steps.map(v => {
    stepFor(['space'], d.steps, v, 'negative space')
    return {
      path: ['space', 'negative', pxStep(v)], layer: 'primitive', value: dim(-v),
      req: d.negative.purpose, use: `-${v} px, the mirror of space/${pxStep(v)}. For overlap only`,
    }
  })
  const semantic: Token[] = d.semantic.map(row => {
    const path = ['space', row.property, row.where, row.density]
    const place = d.places[row.where]
    if (!place) throw new Error(`${path.join('/')}: no place text for "${row.where}"`)
    const target = stepFor(['space'], d.steps, row.px, path.join('/'))
    return {
      path, layer: 'semantic', value: alias('dimension', target),
      req: row.covers.join('; '),
      use: `the ${row.density} ${row.property} ${place}; ${row.px} px through ${target.join('/')}`,
    }
  })
  return [...steps, ...negatives, ...semantic]
}

export function sizeTokens(d: SizeDeclaration): Token[] {
  const steps: Token[] = d.steps.map(v => ({
    path: ['size', pxStep(v)], layer: 'primitive', value: dim(v),
    req: d.purpose, use: `${v} px. ${PREFER_SEMANTIC}`,
  }))
  const named = (kind: 'icon' | 'control', what: string): Token[] =>
    bySize(d[kind].sizes).map(([word, v]) => {
      const path = ['size', kind, word]
      const target = stepFor(['size'], d.steps, v, path.join('/'))
      return {
        path, layer: 'semantic', value: alias('dimension', target),
        req: d[kind].purpose, use: `the ${word} ${what}; ${v} px through ${target.join('/')}`,
      }
    })
  const illustrations: Token[] = Object.entries(d.illustration).flatMap(([kind, row]) =>
    bySize(row.sizes).map(([word, v]): Token => {
      const path = ['size', 'illustration', kind, word]
      const onScale = d.steps.includes(v)
      return {
        path, layer: 'semantic', value: onScale ? alias('dimension', ['size', pxStep(v)]) : dim(v),
        req: row.purpose,
        use: `the ${word} ${kind} illustration; ${v} px${onScale ? ` through size/${pxStep(v)}` : ', above the size scale'}`,
      }
    }))
  const measure: Token = {
    path: ['size', 'measure'], layer: 'semantic', value: dim(d.measure.px),
    req: d.measure.req, use: `${d.measure.use}; ${d.measure.px} px, above the size scale`,
  }
  return [...steps, ...named('icon', 'icon'), ...named('control', 'control height'), ...illustrations, measure]
}

export function radiusTokens(d: RadiusDeclaration): Token[] {
  return [
    ...d.steps.map((row): Token => ({
      path: ['radius', pxStep(row.px)], layer: 'primitive', value: dim(row.px),
      req: row.req, use: `${row.px} px`,
    })),
    {
      path: ['radius', 'full'], layer: 'primitive', value: dim(d.full.px),
      req: d.full.req, use: 'fully rounded ends at any height',
    },
  ]
}

export function borderWidthTokens(d: BorderWidthDeclaration): Token[] {
  return d.steps.map(v => ({
    path: ['border-width', pxStep(v)], layer: 'primitive', value: dim(v),
    req: d.purpose, use: `${v} px`,
  }))
}

export function opacityTokens(d: OpacityDeclaration): Token[] {
  return [
    ...d.steps.map((percent): Token => ({
      path: ['opacity', stepName(percent)], layer: 'primitive', value: { type: 'number', value: percent / 100 },
      req: d.purpose, use: `${percent} percent`,
    })),
    {
      path: ['opacity', 'disabled'], layer: 'semantic', value: { type: 'number', value: d.disabled.percent / 100 },
      req: d.disabled.req, use: `${d.disabled.percent} percent, applied to the whole component`,
    },
  ]
}

export function motionTokens(d: MotionDeclaration): Token[] {
  const easings: Token[] = Object.entries(d.easing).map(([word, row]) => ({
    path: ['motion', 'easing', word], layer: 'primitive', value: { type: 'cubicBezier', value: row.curve },
    req: row.req, use: `cubic-bezier(${row.curve.join(', ')})`,
  }))
  const durations: Token[] = d.duration.steps.map(row => ({
    path: ['motion', 'duration', stepName(row.ms)], layer: 'primitive', value: { type: 'duration', value: ms(row.ms) },
    req: row.req, use: `${row.ms} ms`,
  }))
  const transitions: Token[] = Object.entries(d.transition).map(([word, row]) => {
    const path = ['motion', 'transition', word]
    if (!d.easing[row.easing]) throw new Error(`${path.join('/')}: no easing named "${row.easing}"`)
    if (!d.duration.steps.some(s => s.ms === row.ms)) throw new Error(`${path.join('/')}: ${row.ms} ms is not a duration step`)
    const duration = ['motion', 'duration', stepName(row.ms)]
    const timingFunction = ['motion', 'easing', row.easing]
    return {
      path, layer: 'semantic', value: { type: 'transition', value: { duration, delay: ms(0), timingFunction } },
      req: row.req, use: `${timingFunction.join('/')} over ${duration.join('/')}, with no delay`,
    }
  })
  return [...easings, ...durations, ...transitions]
}

export function breakpointTokens(d: BreakpointDeclaration): Token[] {
  return bySize(d.widths).map(([word, row]) => ({
    path: ['breakpoint', word], layer: 'primitive', value: dim(row.px),
    req: row.req, use: `a minimum width of ${row.px} px`,
  }))
}

export function gridTokens(d: GridDeclaration, spaceSteps: readonly number[]): Token[] {
  const columns = perViewport(d.columns.count, 'grid/columns')
  const mapValues = <A, B>(r: Record<Viewport, A>, f: (a: A, v: Viewport) => B): Record<Viewport, B> =>
    Object.fromEntries(VIEWPORTS.map(v => [v, f(r[v], v)])) as Record<Viewport, B>
  const summary = <A>(r: Record<Viewport, A>, show: (a: A) => string): string =>
    VIEWPORTS.map(v => `${show(r[v])} on ${v}`).join(', ')
  const spaced = (name: 'margin' | 'gutter'): Token => {
    const pxs = perViewport(d[name].px, `grid/${name}`)
    return contextual(
      { path: ['grid', name], layer: 'semantic', req: d[name].req, use: summary(pxs, v => `${v} px`) },
      mapValues(pxs, v => alias('dimension', stepFor(['space'], spaceSteps, v, `grid/${name}`))),
    )
  }
  const maxWidth = perViewport(d.maxWidth.px, 'grid/max-width')
  return [
    contextual(
      { path: ['grid', 'columns'], layer: 'semantic', req: d.columns.req, use: summary(columns, c => `${c} columns`) },
      mapValues(columns, c => ({ type: 'number', value: c })),
    ),
    spaced('margin'),
    spaced('gutter'),
    contextual(
      { path: ['grid', 'max-width'], layer: 'semantic', req: d.maxWidth.req, use: `${d.maxWidth.use}; ${summary(maxWidth, v => `${v} px`)}` },
      mapValues(maxWidth, v => dim(v)),
    ),
  ]
}

export function fontTokens(d: FontDeclaration): Token[] {
  const families: Token[] = Object.entries(d.family).map(([word, row]) => ({
    path: ['font', 'family', word], layer: 'primitive', value: { type: 'fontFamily', value: row.names },
    req: row.req, use: `${row.names.slice(0, -1).join(', ')}, falling back to the generic ${row.names[row.names.length - 1]}`,
  }))
  const weights: Token[] = Object.entries(d.weight).map(([word, row]) => ({
    path: ['font', 'weight', word], layer: 'primitive', value: { type: 'fontWeight', value: row.value },
    req: row.req, use: `weight ${row.value}`,
  }))
  const sizes: Token[] = d.size.steps.map(v => ({
    path: ['font', 'size', pxStep(v)], layer: 'primitive', value: dim(v),
    req: d.size.purpose, use: `${v} px. Use a text style, not a size, wherever one exists`,
  }))
  const lineHeights: Token[] = d.lineHeight.steps.map(v => ({
    path: ['font', 'line-height', multipleStep(v)], layer: 'primitive', value: { type: 'number', value: v },
    req: d.lineHeight.purpose, use: `${v} times the font size`,
  }))
  return [...families, ...weights, ...sizes, ...lineHeights]
}

export function textTokens(d: TextDeclaration, f: FontDeclaration): Token[] {
  return d.styles.map(s => {
    const path = ['text', s.role, s.size]
    const who = path.join('/')
    if (!f.family[s.family]) throw new Error(`${who}: no family named "${s.family}"`)
    if (!f.weight[s.weight]) throw new Error(`${who}: no weight named "${s.weight}"`)
    const lineHeight = stepFor(['font', 'line-height'], f.lineHeight.steps, s.lineHeight, who, multipleStep)
    const sizes = perViewport(s.px, who)
    const byContext = {} as Record<Viewport, Value>
    for (const v of VIEWPORTS) byContext[v] = {
      type: 'typography',
      value: {
        fontFamily: ['font', 'family', s.family],
        fontSize: stepFor(['font', 'size'], f.size.steps, sizes[v], who),
        fontWeight: ['font', 'weight', s.weight],
        // the percent the style declares, as the length the format needs, at this size;
        // three decimals keep a tenth of a percent exact at every size on the scale
        letterSpacing: px(Math.round(sizes[v] * s.letterSpacing * 10) / 1000),
        lineHeight,
      },
    }
    const sizeText = sizes.mobile === sizes.desktop
      ? `${sizes.mobile} px at every viewport`
      : `${sizes.mobile} px on mobile and ${sizes.desktop} px on desktop`
    return contextual({
      path, layer: 'semantic',
      req: `${d.roles[s.role]}; the ${s.size} size`,
      use: `${f.family[s.family].names[0]} ${s.weight}, ${sizeText}, line height ${s.lineHeight} times the size, letter spacing ${s.letterSpacing} percent`,
    }, byContext)
  })
}

export function shadowTokens(d: ShadowDeclaration): Token[] {
  return d.levels.map(l => ({
    path: ['shadow', l.name], layer: 'semantic', req: l.req, use: l.use,
    value: { type: 'shadow', value: l.layers.map(s => ({ color: color('#000000', s.alpha / 100), offsetX: px(s.x), offsetY: px(s.y), blur: px(s.blur), spread: px(s.spread) })) },
  }))
}
