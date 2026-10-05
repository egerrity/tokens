// The token file emit: one document per collection, in the Design Tokens Format Module
// 2025.10 shape. Every token carries exactly $type, $value and $description, at its path
// from the one grammar; nothing sits at the document root but the groups. An alias is
// written in the curly-brace form and resolves in the joined set of documents.
//
// A group is a Map and the bytes come from the writer below, not from JSON.stringify on
// a plain object: a JavaScript object moves whole-number keys to the front, which would
// put step 100 ahead of step 025. The Map keeps the roster's order, so a scale reads in
// order in the file.
import { aliasOf, type TokenPath } from '../grammar/path.ts'
import { CATEGORIES, type Category } from '../grammar/words.ts'
import { collectionOf } from './roster.ts'
import { isAlias, type Token } from './types.ts'

export type DtcgToken = { $type: string; $value: unknown; $description: string }
export type DtcgGroup = Map<string, DtcgToken | DtcgGroup>

/** the description as the file carries it: one line per part, in this order */
export const describeDocument = (t: Token): string => `Req for: ${t.req}\nUse: ${t.use}`

function valueOf(t: Token): unknown {
  if (isAlias(t)) return aliasOf(t.alias)
  if (t.type === 'transition') {
    return { duration: aliasOf(t.value.duration), delay: t.value.delay, timingFunction: aliasOf(t.value.timingFunction) }
  }
  return t.value
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

/** every collection's document, keyed by collection name */
export function documents(tokens: Token[]): Record<string, DtcgGroup> {
  const out: Record<string, DtcgGroup> = {}
  for (const category of CATEGORIES) {
    const doc = (out[collectionOf(category)] ??= new Map())
    for (const t of tokens) {
      if ((t.path[0] as Category) !== category) continue
      place(doc, t.path, { $type: t.type, $value: valueOf(t), $description: describeDocument(t) })
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

export const fileName = (collection: string): string => `${collection}.tokens.json`
