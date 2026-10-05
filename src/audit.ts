// The gate. It reads the roster and the documents built from it and returns every
// failure, so one run shows all of them. Nothing here is blessed: each check is a rule
// the grammar or the format states, measured against what was actually emitted.
//
//   A. names: every path is unique, legal, in the grammar, unique as a CSS name, and
//      never both a token and a group
//   B. descriptions: every token says what it is required for and how to use it
//   C. aliases and composites: every reference resolves to a token of the right type,
//      in every context, with no cycle
//   D. scales: steps ascend, no value appears twice, and a step's name is its value by
//      the scale's rule; a negative step mirrors its positive step
//   E. values: each type's own rules, and the bounds a declaration sets
//   F. contexts: a token varies only inside a collection that has contexts, and then
//      holds exactly that collection's contexts
//   G. documents: every roster token appears once per document of its collection, with
//      exactly $type, $value and $description, the documents of one collection hold the
//      same paths, and the bytes parse back to the same tokens
import { collections, collectionOf } from '../declarations/collections.ts'
import { motion } from '../declarations/motion.ts'
import { cssBody, legalSegment, matchesGrammar, stepName, type TokenPath } from '../grammar/path.ts'
import { isStep } from '../grammar/words.ts'
import { pxStep } from './derive.ts'
import { serialize, type DtcgGroup, type DtcgToken, type DocumentKey } from './dtcg.ts'
import { isAlias, valueIn, type Token, type TokenType, type Value } from './types.ts'

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

export function audit(tokens: Token[], docs: Map<string, { key: DocumentKey; doc: DtcgGroup }>): string[] {
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

  // C. aliases and composites, in every context a token has
  const contextsOf = (t: Token): (string | undefined)[] => (t.byContext ? Object.keys(t.byContext) : [undefined])
  const resolve = (v: Value, who: string, context: string | undefined, seen: string[] = []): Value | undefined => {
    if (!isAlias(v)) return v
    const k = key(v.alias)
    if (seen.includes(k)) { fail(`${who}: alias cycle through ${k}`); return undefined }
    const target = byPath.get(k)
    if (!target) { fail(`${who}: alias to ${k}, which is not a token`); return undefined }
    if (target.value.type !== v.type) fail(`${who}: a ${v.type} that aliases ${k}, a ${target.value.type}`)
    return resolve(valueIn(target, context), who, context, [...seen, k])
  }
  const part = (who: string, path: TokenPath, want: TokenType, name: string) => {
    const target = byPath.get(key(path))
    if (!target) fail(`${who}: ${name} refers to ${key(path)}, which is not a token`)
    else if (target.value.type !== want) fail(`${who}: ${name} refers to ${key(path)}, a ${target.value.type}, not a ${want}`)
  }
  for (const t of tokens) {
    for (const context of contextsOf(t)) {
      const who = context ? `${key(t.path)} (${context})` : key(t.path)
      const v = valueIn(t, context)
      resolve(v, who, context)
      if (isAlias(v)) continue
      if (v.type === 'transition') {
        part(who, v.value.duration, 'duration', 'duration')
        part(who, v.value.timingFunction, 'cubicBezier', 'timingFunction')
      }
      if (v.type === 'typography') {
        part(who, v.value.fontFamily, 'fontFamily', 'fontFamily')
        part(who, v.value.fontSize, 'dimension', 'fontSize')
        part(who, v.value.fontWeight, 'fontWeight', 'fontWeight')
        part(who, v.value.lineHeight, 'number', 'lineHeight')
        if (!Number.isFinite(v.value.letterSpacing.value)) fail(`${who}: letterSpacing is not a finite length`)
      }
    }
  }

  // D. scales: the tokens of one group whose last segment is a step
  const scales = new Map<string, Token[]>()
  for (const t of tokens) {
    if (!isStep(t.path[t.path.length - 1])) continue
    const parent = key(t.path.slice(0, -1))
    scales.set(parent, [...(scales.get(parent) ?? []), t])
  }
  // a step's magnitude in the unit its scale is named from: px, percent, hundredths or ms
  const magnitude = (v: Value): number | undefined => {
    if (isAlias(v)) return undefined
    if (v.type === 'dimension') return Math.abs(v.value.value)
    if (v.type === 'number') return Math.round(v.value * 1e6) / 1e4
    if (v.type === 'duration') return v.value.value
    return undefined
  }
  for (const [parent, steps] of scales) {
    let last = -Infinity
    for (const t of steps) {
      const k = key(t.path)
      if (t.byContext) fail(`${k}: a scale step holds one value, not one per context`)
      const m = magnitude(t.value)
      if (m === undefined) { fail(`${k}: a scale step must hold a value, not a reference`); continue }
      if (m <= last) fail(`${k}: ${parent} does not ascend here (${m} after ${last})`)
      last = m
      const named = t.path[t.path.length - 1]
      let expected: string
      try { expected = t.value.type === 'dimension' ? pxStep(m) : stepName(m) } catch { expected = 'no whole step' }
      if (named !== expected) fail(`${k}: the step is named ${named}, its value ${m} makes it ${expected}`)
    }
  }
  for (const t of tokens) {
    if (t.path[0] !== 'space' || t.path[1] !== 'negative' || isAlias(t.value) || t.value.type !== 'dimension') continue
    const positive = byPath.get(key(['space', t.path[2]]))
    if (!positive || isAlias(positive.value) || positive.value.type !== 'dimension') fail(`${key(t.path)}: no positive step space/${t.path[2]} to mirror`)
    else if (positive.value.value.value !== -t.value.value.value) fail(`${key(t.path)}: ${t.value.value.value} px does not mirror space/${t.path[2]} at ${positive.value.value.value} px`)
  }

  // E. values
  const { shortest, longest } = motion.duration.bounds
  let lastBreakpoint = -Infinity
  for (const t of tokens) {
    for (const context of contextsOf(t)) {
      const v = valueIn(t, context)
      if (isAlias(v)) continue
      const k = context ? `${key(t.path)} (${context})` : key(t.path)
      if (v.type === 'dimension') {
        if (!Number.isFinite(v.value.value)) fail(`${k}: not a finite length`)
        if (v.value.unit !== 'px') fail(`${k}: unit ${v.value.unit}; lengths are declared in px`)
        if (t.path[0] === 'breakpoint') {
          if (v.value.value <= lastBreakpoint) fail(`${k}: breakpoints do not ascend here`)
          lastBreakpoint = v.value.value
        }
      }
      if (v.type === 'number' && t.path[0] === 'opacity' && !(v.value >= 0 && v.value <= 1)) fail(`${k}: opacity ${v.value} is outside 0 to 1`)
      if (v.type === 'number' && t.path[0] === 'grid' && !(Number.isInteger(v.value) && v.value > 0)) fail(`${k}: a column count must be a whole number above zero`)
      if (v.type === 'duration') {
        if (v.value.unit !== 'ms') fail(`${k}: unit ${v.value.unit}; durations are declared in ms`)
        if (v.value.value < shortest || v.value.value > longest) fail(`${k}: ${v.value.value} ms is outside the declared bounds, ${shortest} to ${longest} ms`)
      }
      if (v.type === 'cubicBezier') {
        const [x1, y1, x2, y2] = v.value
        if (![x1, y1, x2, y2].every(Number.isFinite)) fail(`${k}: a curve needs four finite numbers`)
        if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) fail(`${k}: the curve's x coordinates must sit in 0 to 1`)
      }
      if (v.type === 'transition' && v.value.delay.value < 0) fail(`${k}: a negative delay`)
      if (v.type === 'fontWeight' && !(v.value >= 1 && v.value <= 1000)) fail(`${k}: a font weight sits in 1 to 1000`)
      if (v.type === 'fontFamily' && (v.value.length === 0 || v.value.some(n => !n.trim()))) fail(`${k}: a font family lists at least one name`)
    }
  }

  // F. contexts
  for (const t of tokens) {
    const k = key(t.path)
    const c = collections[collectionOf(t)]
    if (!c) { fail(`${k}: filed in "${collectionOf(t)}", which is not a collection`); continue }
    if (t.byContext) {
      const have = Object.keys(t.byContext).join(',')
      const want = [...c.contexts].join(',')
      if (!c.contexts.length) fail(`${k}: varies by context inside ${collectionOf(t)}, which has no contexts`)
      else if (have !== want) fail(`${k}: holds contexts ${have}; its collection has ${want}`)
    }
  }

  // G. documents
  const seenIn = new Map<string, Set<string>>()
  for (const [file, { key: dk, doc }] of docs) {
    const tree = flatten(doc)
    const expected = tokens.filter(t => collectionOf(t) === dk.collection)
    if (tree.size !== expected.length) fail(`${file}: ${tree.size} tokens, its collection has ${expected.length}`)
    for (const t of expected) if (!tree.has(key(t.path))) fail(`${file}: lacks ${key(t.path)}`)
    for (const [k, v] of tree) {
      const t = byPath.get(k)
      if (!t) { fail(`${file}: ${k} is not in the roster`); continue }
      if (collectionOf(t) !== dk.collection) fail(`${file}: ${k} belongs to ${collectionOf(t)}`)
      const keys = Object.keys(v).sort().join(',')
      if (keys !== '$description,$type,$value') fail(`${file}: ${k} carries ${keys}; a token carries exactly $type, $value and $description`)
      if (typeof v.$description !== 'string' || !v.$description.trim()) fail(`${file}: ${k} has no description`)
      if (v.$type !== valueIn(t, dk.context).type) fail(`${file}: ${k} says ${v.$type}, the roster says ${valueIn(t, dk.context).type}`)
      seenIn.set(k, (seenIn.get(k) ?? new Set()).add(dk.collection))
    }
    // the bytes must parse back to the same tokens; key order is not compared, because a
    // JavaScript parser reorders whole-number names and the format gives order no meaning
    let parsed = new Map<string, DtcgToken>()
    try { parsed = flatten(JSON.parse(serialize(doc))) } catch (e) { fail(`${file}: the bytes are not valid JSON: ${(e as Error).message}`) }
    if (parsed.size !== tree.size) fail(`${file}: ${tree.size} tokens emitted, ${parsed.size} read back`)
    for (const [k, v] of tree) if (JSON.stringify(parsed.get(k)) !== JSON.stringify(v)) fail(`${file}: ${k} read back from the bytes differs from what was emitted`)
  }
  for (const [k, where] of seenIn) if (where.size > 1) fail(`${k}: emitted in ${[...where].join(' and ')}`)
  for (const k of byPath.keys()) if (!seenIn.has(k)) fail(`${k}: in the roster but in no document`)

  return failures
}
