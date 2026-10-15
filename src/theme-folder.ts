// The theme folder an app consumes, written per brand: the two files the apps keep by
// hand today, generated. Web, `variables.css`: every token as a custom property, the
// default context on :root, the theme rows again under html[data-mode='dark'], the
// viewport rows again under a min-width query per viewport; and `variables.scoped.css`,
// the same under html[data-brand='<brand>'], so a page can load several brands and
// switch with one attribute. Mobile, `colors.ts`: the color roles as hex per mode. Each
// ends in a bridge: today's names, each a reference to its successor, from the rename
// map's code names and from the compat declaration, so an app takes the folder without
// changing a line; that block is also the list of names to retire. Values follow the
// token file: an alias stays a reference and a translucent role stays a pair — except in
// colors.ts, which holds resolved hex and renders a pair as eight digits, because a
// native app reads a color, not a reference.
import { brands, PROFILE } from '../declarations/brands.ts'
import { breakpoint } from '../declarations/breakpoint.ts'
import { collectionOf, collections, VIEWPORTS } from '../declarations/collections.ts'
import { prefix } from '../declarations/prefix.ts'
import { compat } from '../declarations/compat.ts'
import { todayCodeName } from '../declarations/renames.ts'
import { cssBody, type TokenPath } from '../grammar/path.ts'
import { engineVersion } from './engine.ts'
import { isAlias, type Color, type Token, type Value } from './types.ts'

const name = (path: TokenPath): string => `--${prefix}-${cssBody(path)}`
const ref = (path: TokenPath): string => `var(${name(path)})`
const key = (path: TokenPath): string => path.join('/')

const GENERIC_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'system-ui', 'ui-monospace', 'cursive', 'fantasy'])
const alphaHex = (alpha: number): string => Math.round(alpha * 255).toString(16).padStart(2, '0')
/** six digits when opaque, eight when not */
const hex = (c: Color): string => (c.alpha >= 1 ? c.hex : `${c.hex}${alphaHex(c.alpha)}`)
const px = (d: { value: number }): string => `${d.value}px`

/** a value as CSS text; a reference where the token file has one */
function css(v: Value): string {
  if (isAlias(v)) return ref(v.alias)
  switch (v.type) {
    case 'color': return hex(v.value)
    case 'dimension': return px(v.value)
    case 'number': return String(v.value)
    case 'duration': return `${v.value.value}ms`
    case 'cubicBezier': return `cubic-bezier(${v.value.join(', ')})`
    case 'fontFamily': return v.value.map(f => (GENERIC_FAMILIES.has(f) ? f : `'${f}'`)).join(', ')
    case 'fontWeight': return String(v.value)
    case 'transition': return `${ref(v.value.duration)} ${v.value.delay.value ? `${v.value.delay.value}ms ` : ''}${ref(v.value.timingFunction)}`
    case 'shadow': return v.value.map(s => `${px(s.offsetX)} ${px(s.offsetY)} ${px(s.blur)} ${px(s.spread)} ${hex(s.color)}`).join(', ')
    case 'typography': throw new Error(`${name([])}: a text style is written as its parts`)
  }
}

/** the custom properties a token declares in a context: one, or a text style's five parts */
function declarations(t: Token, context: string | undefined): [string, string][] {
  const v = context !== undefined && t.byContext?.[context] ? t.byContext[context] : t.value
  if (v.type === 'typography' && !isAlias(v)) {
    const s = v.value
    return [
      [`${name(t.path)}-font-family`, ref(s.fontFamily)],
      [`${name(t.path)}-font-size`, ref(s.fontSize)],
      [`${name(t.path)}-font-weight`, ref(s.fontWeight)],
      [`${name(t.path)}-letter-spacing`, px(s.letterSpacing)],
      [`${name(t.path)}-line-height`, ref(s.lineHeight)],
    ]
  }
  return [[name(t.path), css(v)]]
}

/** the bridge: today's names, each a reference to its successor; the rename map's code names, then the compat declaration's aliases */
function bridge(tokens: Token[]): [string, string][] {
  const renamed = tokens.flatMap(t => { const old = todayCodeName(t.path); return old ? [[`--${old}`, ref(t.path)] as [string, string]] : [] })
  const aliased = Object.entries(compat).flatMap(([old, c]) => (c.how === 'alias' ? [[`--${old}`, ref(c.path)] as [string, string]] : []))
  return [...renamed, ...aliased]
}

const block = (selector: string, lines: [string, string][], indent = ''): string =>
  lines.length === 0 ? '' : `${indent}${selector} {\n${lines.map(([n, v]) => `${indent}  ${n}: ${v};`).join('\n')}\n${indent}}\n`

/** the lines a block adds over the one before it: only what changes */
const changed = (now: [string, string][], before: Map<string, string>): [string, string][] => now.filter(([n, v]) => before.get(n) !== v)

function variablesCss(brand: string, tokens: Token[], engine: Token[], scoped = false): string {
  const all = [...engine, ...tokens]
  // the root file speaks for the page; the scoped file for one brand among several
  const sel = scoped ? `html[data-brand='${brand}']` : ':root'
  const darkSel = scoped ? `html[data-brand='${brand}'][data-mode='dark']` : "html[data-mode='dark']"
  const header = `/* The theme for the brand "${brand}"${scoped ? `, scoped to ${sel}` : ''}, generated from the declarations with okchroma ${engineVersion()}; edit a declaration, not this file. */\n`
  // the engine's rows sit in the theme collection, beside the planes
  const collection = (t: Token): string => (engine.includes(t) ? 'theme' : collectionOf(t))
  const base = (t: Token): string | undefined => {
    const c = collections[collection(t)]
    return c.contexts.length ? c.contexts[0] : undefined
  }
  const root = all.flatMap(t => declarations(t, base(t)))

  // the theme's other contexts, as their own selectors
  const theme = all.filter(t => collection(t) === 'theme')
  const light = new Map(theme.flatMap(t => declarations(t, collections.theme.contexts[0])))
  const dark = changed(theme.flatMap(t => declarations(t, 'dark')), light)

  // the viewports, smallest first; each query adds what changes from the one before
  const viewport = all.filter(t => collectionOf(t) === 'viewport')
  let before = new Map(viewport.flatMap(t => declarations(t, VIEWPORTS[0])))
  const queries: string[] = []
  for (const vp of VIEWPORTS.slice(1)) {
    const start = breakpoint.starts[vp]
    const width = start && breakpoint.widths[start]
    if (!width) throw new Error(`${vp}: no breakpoint starts this viewport (declarations/breakpoint.ts)`)
    const lines = viewport.flatMap(t => declarations(t, vp))
    const delta = changed(lines, before)
    if (delta.length) queries.push(`@media (min-width: ${width.px}px) {\n${block(sel, delta, '  ')}}\n`)
    before = new Map(lines)
  }

  return [
    header,
    block(sel, root),
    dark.length ? `\n${block(darkSel, dark)}` : '',
    ...queries.map(q => `\n${q}`),
    `\n/* Today's names, each a reference to its successor above. Delete this block once code reads the names above. */\n`,
    block(sel, bridge(tokens)),
  ].join('')
}

/** a token's literal value in a mode, aliases followed to their end */
function resolved(t: Token, mode: string, byPath: Map<string, Token>): Value {
  const seen = new Set<string>()
  let cur: Token = t
  let v: Value = cur.byContext?.[mode] ?? cur.value
  while (isAlias(v)) {
    const k = key(v.alias)
    if (seen.has(k)) throw new Error(`${key(t.path)}: aliases loop at ${k}`)
    seen.add(k)
    const next = byPath.get(k)
    if (!next) throw new Error(`${key(t.path)}: aliases ${k}, which does not exist`)
    cur = next
    v = cur.byContext?.[mode] ?? cur.value
  }
  return v
}

/** a color role resolved to hex in a mode, its pair folded in */
function resolveHex(t: Token, mode: string, byPath: Map<string, Token>): string {
  const v = resolved(t, mode, byPath)
  if (v.type !== 'color' || isAlias(v)) throw new Error(`${key(t.path)}: resolves to a ${v.type}, not a color`)
  let alpha = v.value.alpha
  if (t.pair) {
    const o = byPath.get(key(t.pair))
    const ov = o && resolved(o, mode, byPath)
    if (!ov || isAlias(ov) || ov.type !== 'number') throw new Error(`${key(t.path)}: its pair ${key(t.pair)} is not an opacity`)
    alpha = ov.value
  }
  return hex({ ...v.value, alpha })
}

function colorsTs(brand: string, tokens: Token[], engine: Token[]): string {
  const byPath = new Map([...engine, ...tokens].map(t => [key(t.path), t]))
  // the roles only: what an app picks from, as today's file holds; the engine's rows and the planes stay behind them
  const roles = tokens.filter(t => collectionOf(t) === 'palette' && t.value.type === 'color')
  const modes = collections.theme.contexts
  const header = `// The color roles for the brand "${brand}" as hex per mode, generated from the declarations with okchroma ${engineVersion()}; edit a declaration, not this file.\n// A translucent role is its color and its opacity token folded into eight digits.\n`
  const lines = (mode: string): string => {
    const own = roles.map(t => `    '${cssBody(t.path)}': '${resolveHex(t, mode, byPath)}',`)
    const old = roles.flatMap(t => { const o = todayCodeName(t.path); return o ? [`    '${o}': '${resolveHex(t, mode, byPath)}',`] : [] })
    // the compat declaration's aliases, those that name a color
    const aliased = Object.entries(compat).flatMap(([o, c]) => {
      const t = c.how === 'alias' ? byPath.get(key(c.path)) : undefined
      return t && t.value.type === 'color' ? [`    '${o}': '${resolveHex(t, mode, byPath)}',`] : []
    })
    return [...own, `    // today's names, each the same color as its successor above; delete once code reads the names above`, ...old, ...aliased].join('\n')
  }
  return `${header}const colors = {\n${modes.map(m => `  ${m}: {\n${lines(m)}\n  },`).join('\n')}\n};\nexport default colors;\n`
}

/**
 * The brand's record in its portable form: the elections and the engine version that
 * solved them, as JSON a client's configuration folder can hold and a build can read
 * back. The stops are never in it; they are computed from it.
 */
const brandJson = (brand: string): string =>
  JSON.stringify({ brand, okchroma: engineVersion(), contrastProfile: PROFILE, elections: brands[brand] }, null, 2) + '\n'

/** the folder for one brand: its files by path under dist/brands/<brand>/ */
export function themeFolder(brand: string, tokens: Token[], engine: Token[]): Record<string, string> {
  return {
    [`dist/brands/${brand}/brand.json`]: brandJson(brand),
    [`dist/brands/${brand}/web/variables.css`]: variablesCss(brand, tokens, engine),
    [`dist/brands/${brand}/web/variables.scoped.css`]: variablesCss(brand, tokens, engine, true),
    [`dist/brands/${brand}/mobile/colors.ts`]: colorsTs(brand, tokens, engine),
  }
}
