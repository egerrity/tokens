// The gate. It reads the roster and the documents built from it and returns every
// failure, so one run shows all of them. Nothing here is blessed: each check is a rule
// the grammar or the format states, measured against what was actually emitted.
//
//   A. names: every path is unique, legal, in the grammar, unique as a CSS name, and
//      never both a token and a group
//   B. descriptions: every token says what it is required for and how to use it
//   C. aliases: every reference resolves to a token of the right type, with no cycle
//   D. scales: steps ascend, no value appears twice, and a step's name is its value by
//      the scale's rule; a negative step mirrors its positive step
//   E. values: each type's own rules, and the bounds a declaration sets
//   F. documents: every roster token appears once, in its collection, with exactly
//      $type, $value and $description, and the bytes parse back to the same tokens
import { motion } from '../declarations/motion.ts'
import { cssBody, legalSegment, matchesGrammar, stepName, type TokenPath } from '../grammar/path.ts'
import { isStep, type Category } from '../grammar/words.ts'
import { pxStep } from './derive.ts'
import { serialize, type DtcgGroup, type DtcgToken } from './dtcg.ts'
import { collectionOf } from './roster.ts'
import { isAlias, type Token } from './types.ts'

const key = (path: TokenPath): string => path.join('/')

// a document as path to token, from the emitter's own tree or from the parsed bytes
type Node = DtcgGroup | DtcgToken | { [name: string]: unknown }
const flatten = (node: Node, pre: string[] = [], out = new Map<string, DtcgToken>()): Map<string, DtcgToken> => {
  const entries: [string, unknown][] = node instanceof Map ? [...node] : Object.entries(node)
  for (const [k, v] of entries) {
    if (v instanceof Map || !(v && typeof v === 'object' && '$value' in v)) flatten(v as Node, [...pre, k], out)
    else out.set(key([...pre, k]), v as DtcgToken)
  }
  return out
}

export function audit(tokens: Token[], docs: Record<string, DtcgGroup>): string[] {
  const failures: string[] = []
  const fail = (msg: string) => failures.push(msg)
  const byPath = new Map<string, Token>()

  // A. names
  const cssNames = new Map<string, string>()
  for (const t of tokens) {
    const k = key(t.path)
    if (byPath.has(k)) fail(`${k}: declared twice`)
    byPath.set(k, t)
    if (!t.path.every(legalSegment)) fail(`${k}: a segment is not lower-case words and digits joined by hyphens`)
    if (!matchesGrammar(t.path)) fail(`${k}: not a shape the grammar allows for "${t.path[0]}"`)
    const css = cssBody(t.path)
    const twin = cssNames.get(css)
    if (twin && twin !== k) fail(`${k}: joins to the same CSS name as ${twin} (--${css})`)
    cssNames.set(css, k)
  }
  for (const t of tokens) {
    for (let i = 1; i < t.path.length; i++) {
      const parent = key(t.path.slice(0, i))
      if (byPath.has(parent)) fail(`${parent}: both a token and a group (it holds ${key(t.path)})`)
    }
  }

  // B. descriptions
  for (const t of tokens) {
    if (!t.req.trim()) fail(`${key(t.path)}: no "Req for" text`)
    if (!t.use.trim()) fail(`${key(t.path)}: no "Use" text`)
  }

  // C. aliases
  const resolve = (t: Token, seen: string[] = []): Token | undefined => {
    if (!isAlias(t)) return t
    const k = key(t.alias)
    if (seen.includes(k)) { fail(`${key(t.path)}: alias cycle through ${k}`); return undefined }
    const target = byPath.get(k)
    if (!target) { fail(`${key(t.path)}: alias to ${k}, which is not a token`); return undefined }
    if (target.type !== t.type) fail(`${key(t.path)}: a ${t.type} that aliases ${k}, a ${target.type}`)
    return resolve(target, [...seen, k])
  }
  for (const t of tokens) {
    resolve(t)
    if (!isAlias(t) && t.type === 'transition') {
      const part = (path: TokenPath, want: string, name: string) => {
        const target = byPath.get(key(path))
        if (!target) fail(`${key(t.path)}: ${name} refers to ${key(path)}, which is not a token`)
        else if (target.type !== want) fail(`${key(t.path)}: ${name} refers to ${key(path)}, a ${target.type}, not a ${want}`)
      }
      part(t.value.duration, 'duration', 'duration')
      part(t.value.timingFunction, 'cubicBezier', 'timingFunction')
    }
  }

  // D. scales: the tokens of one group whose last segment is a step
  const scales = new Map<string, Token[]>()
  for (const t of tokens) {
    if (!isStep(t.path[t.path.length - 1])) continue
    const parent = key(t.path.slice(0, -1))
    scales.set(parent, [...(scales.get(parent) ?? []), t])
  }
  // a step's magnitude in the unit its scale is named from: px, percent or ms
  const magnitude = (t: Token): number | undefined => {
    if (isAlias(t)) return undefined
    if (t.type === 'dimension') return Math.abs(t.value.value)
    if (t.type === 'number') return Math.round(t.value * 1e6) / 1e4
    if (t.type === 'duration') return t.value.value
    return undefined
  }
  for (const [parent, steps] of scales) {
    let last = -Infinity
    for (const t of steps) {
      const k = key(t.path)
      const m = magnitude(t)
      if (m === undefined) { fail(`${k}: a scale step must hold a value, not a reference`); continue }
      if (m <= last) fail(`${k}: ${parent} does not ascend here (${m} after ${last})`)
      last = m
      const named = t.path[t.path.length - 1]
      let expected: string
      try { expected = t.type === 'dimension' ? pxStep(m) : stepName(m) } catch { expected = 'no whole step' }
      if (named !== expected) fail(`${k}: the step is named ${named}, its value ${m} makes it ${expected}`)
    }
  }
  for (const t of tokens) {
    if (t.path[0] !== 'space' || t.path[1] !== 'negative' || isAlias(t) || t.type !== 'dimension') continue
    const positive = byPath.get(key(['space', t.path[2]]))
    if (!positive || isAlias(positive) || positive.type !== 'dimension') fail(`${key(t.path)}: no positive step space/${t.path[2]} to mirror`)
    else if (positive.value.value !== -t.value.value) fail(`${key(t.path)}: ${t.value.value} px does not mirror space/${t.path[2]} at ${positive.value.value} px`)
  }

  // E. values
  const { shortest, longest } = motion.duration.bounds
  let lastBreakpoint = -Infinity
  for (const t of tokens) {
    if (isAlias(t)) continue
    const k = key(t.path)
    if (t.type === 'dimension') {
      if (!Number.isFinite(t.value.value)) fail(`${k}: not a finite length`)
      if (t.value.unit !== 'px') fail(`${k}: unit ${t.value.unit}; lengths are declared in px`)
      if (t.path[0] === 'breakpoint') {
        if (t.value.value <= lastBreakpoint) fail(`${k}: breakpoints do not ascend here`)
        lastBreakpoint = t.value.value
      }
    }
    if (t.type === 'number' && t.path[0] === 'opacity' && !(t.value >= 0 && t.value <= 1)) fail(`${k}: opacity ${t.value} is outside 0 to 1`)
    if (t.type === 'duration') {
      if (t.value.unit !== 'ms') fail(`${k}: unit ${t.value.unit}; durations are declared in ms`)
      if (t.value.value < shortest || t.value.value > longest) fail(`${k}: ${t.value.value} ms is outside the declared bounds, ${shortest} to ${longest} ms`)
    }
    if (t.type === 'cubicBezier') {
      const [x1, y1, x2, y2] = t.value
      if (![x1, y1, x2, y2].every(Number.isFinite)) fail(`${k}: a curve needs four finite numbers`)
      if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) fail(`${k}: the curve's x coordinates must sit in 0 to 1`)
    }
    if (t.type === 'transition' && t.value.delay.value < 0) fail(`${k}: a negative delay`)
  }

  // F. documents
  const emitted = new Map<string, string>()
  for (const [collection, doc] of Object.entries(docs)) {
    for (const [k, v] of flatten(doc)) {
      if (emitted.has(k)) fail(`${k}: emitted in both ${emitted.get(k)} and ${collection}`)
      emitted.set(k, collection)
      const t = byPath.get(k)
      if (!t) { fail(`${k}: in ${collection} but not in the roster`); continue }
      const keys = Object.keys(v).sort().join(',')
      if (keys !== '$description,$type,$value') fail(`${k}: carries ${keys}; a token carries exactly $type, $value and $description`)
      if (typeof v.$description !== 'string' || !v.$description.trim()) fail(`${k}: no description in the file`)
      if (v.$type !== t.type) fail(`${k}: the file says ${v.$type}, the roster says ${t.type}`)
      let home: string | undefined
      try { home = collectionOf(t.path[0] as Category) } catch (e) { fail((e as Error).message) }
      if (home && home !== collection) fail(`${k}: filed in ${collection}, its category belongs to ${home}`)
    }
    // the bytes must parse back to the same tokens; key order is not compared, because a
    // JavaScript parser reorders whole-number names and the format gives order no meaning
    const tree = flatten(doc)
    let parsed = new Map<string, DtcgToken>()
    try { parsed = flatten(JSON.parse(serialize(doc))) } catch (e) { fail(`${collection}: the bytes are not valid JSON: ${(e as Error).message}`) }
    if (parsed.size !== tree.size) fail(`${collection}: ${tree.size} tokens emitted, ${parsed.size} read back`)
    for (const [k, v] of tree) if (JSON.stringify(parsed.get(k)) !== JSON.stringify(v)) fail(`${k}: read back from the bytes, it differs from what was emitted`)
  }
  for (const k of byPath.keys()) if (!emitted.has(k)) fail(`${k}: in the roster but in no document`)

  return failures
}
