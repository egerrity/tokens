// The token file emit: one document per collection and context, in the Design Tokens
// Format Module 2025.10 shape, and the resolver document that joins them. Every token
// carries exactly $type, $value and $description, at its path from the one grammar;
// nothing sits at the document root but the groups. An alias is written in the
// curly-brace form and resolves in the joined set.
//
// A group is a Map and the bytes come from the writer below, not from JSON.stringify on
// a plain object: a JavaScript object moves whole-number keys to the front, which would
// put step 100 ahead of step 025. The Map keeps the roster's order, so a scale reads in
// order in the file.
import { collections, collectionOf } from '../declarations/collections.ts'
import { aliasOf, type TokenPath } from '../grammar/path.ts'
import { isAlias, valueIn, type Token, type Value } from './types.ts'

export type DtcgToken = { $type: string; $value: unknown; $description: string }
export type DtcgGroup = Map<string, DtcgToken | DtcgGroup>
/** a document's place in the set: its collection, and its context where the collection has them */
export type DocumentKey = { collection: string; context?: string }

/**
 * The description as the file carries it: one line per part, in this order. The format
 * has no field for a pair, so the opacity a color is composed with rides in the
 * description, in the alias form a reader of the file can follow.
 */
export const describeDocument = (t: Token): string =>
  [`Req for: ${t.req}`, `Use: ${t.use}`, ...(t.pair ? [`Composed with: ${aliasOf(t.pair)}`] : []), ...(t.reserved ? ['Reserved for components'] : [])].join('\n')

export function valueOf(v: Value): unknown {
  if (isAlias(v)) return aliasOf(v.alias)
  switch (v.type) {
    case 'transition':
      return { duration: aliasOf(v.value.duration), delay: v.value.delay, timingFunction: aliasOf(v.value.timingFunction) }
    case 'typography': {
      const t = v.value
      return { fontFamily: aliasOf(t.fontFamily), fontSize: aliasOf(t.fontSize), fontWeight: aliasOf(t.fontWeight), letterSpacing: t.letterSpacing, lineHeight: aliasOf(t.lineHeight) }
    }
    default:
      return v.value
  }
}

function place(doc: DtcgGroup, path: TokenPath, token: DtcgToken): void {
  let cur = doc
  for (const seg of path.slice(0, -1)) {
    let next = cur.get(seg)
    if (next && !(next instanceof Map)) throw new Error(`dtcg: ${seg} is both a token and a group on the way to ${path.join('/')}`)
    if (!next) cur.set(seg, (next = new Map()))
    cur = next
  }
  const leaf = path[path.length - 1]
  if (cur.has(leaf)) throw new Error(`dtcg: duplicate path ${path.join('/')}`)
  cur.set(leaf, token)
}

export const fileName = (k: DocumentKey): string => `${k.collection}${k.context ? '.' + k.context : ''}.tokens.json`

/** every document in the set, in collection order then context order */
export function documents(tokens: Token[]): Map<string, { key: DocumentKey; doc: DtcgGroup }> {
  const out = new Map<string, { key: DocumentKey; doc: DtcgGroup }>()
  for (const [collection, c] of Object.entries(collections)) {
    const contexts: (string | undefined)[] = c.contexts.length ? [...c.contexts] : [undefined]
    for (const context of contexts) {
      const key: DocumentKey = context ? { collection, context } : { collection }
      const doc: DtcgGroup = new Map()
      for (const t of tokens) {
        if (collectionOf(t) !== collection) continue
        const v = valueIn(t, context)
        place(doc, t.path, { $type: v.type, $value: valueOf(v), $description: describeDocument(t) })
      }
      out.set(fileName(key), { key, doc })
    }
  }
  return out
}

const indent = (depth: number): string => '  '.repeat(depth)
function write(node: DtcgGroup | DtcgToken, depth: number): string {
  if (!(node instanceof Map)) return JSON.stringify(node, null, 2).replace(/\n/g, '\n' + indent(depth))
  if (node.size === 0) return '{}'
  const rows = [...node].map(([name, child]) => `${indent(depth + 1)}${JSON.stringify(name)}: ${write(child, depth + 1)}`)
  return `{\n${rows.join(',\n')}\n${indent(depth)}}`
}

/** the bytes of a document: two-space indent, one trailing newline, tokens in roster order */
export const serialize = (doc: DtcgGroup): string => write(doc, 0) + '\n'

/**
 * The resolver document, the Resolver Module's join: each collection without contexts is
 * a set, each with contexts is a modifier whose contexts name one file each, and the
 * order lists the sets first.
 */
export function resolver(): string {
  const sets: Record<string, { sources: { $ref: string }[] }> = {}
  const modifiers: Record<string, { contexts: Record<string, { $ref: string }[]>; default?: string }> = {}
  const resolutionOrder: { $ref: string }[] = []
  for (const [collection, c] of Object.entries(collections)) {
    if (c.contexts.length === 0) {
      sets[collection] = { sources: [{ $ref: fileName({ collection }) }] }
      resolutionOrder.push({ $ref: `#/sets/${collection}` })
    } else {
      const contexts: Record<string, { $ref: string }[]> = {}
      for (const context of c.contexts) contexts[context] = [
        ...(c.external ? [{ $ref: fileName({ collection: c.external, context }) }] : []),
        { $ref: fileName({ collection, context }) },
      ]
      modifiers[collection] = { contexts, ...(c.default ? { default: c.default } : {}) }
    }
  }
  for (const name of Object.keys(modifiers)) resolutionOrder.push({ $ref: `#/modifiers/${name}` })
  return JSON.stringify({ version: '2025.10', sets, modifiers, resolutionOrder }, null, 2) + '\n'
}
