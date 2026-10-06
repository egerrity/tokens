// The color engine's documents, read as tokens. The engine writes them (okchroma's
// `tokens:emit` with the root group), one per theme context on identical paths; they are
// copied into dist/tokens as `engine.<context>.tokens.json` and never rewritten here.
// Every semantic color aliases one of these rows, so the audit needs them to resolve, and
// the Figma payload for the theme collection carries them beside the surfaces.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { collections } from '../declarations/collections.ts'
import type { TokenPath } from '../grammar/path.ts'
import type { Color, Token, Value } from './types.ts'

const ROOT = path.join(import.meta.dirname, '..', 'dist', 'tokens')

type Doc = { [name: string]: Doc | { $type: string; $value: unknown; $description?: string } }
const isToken = (n: unknown): n is { $type: string; $value: unknown; $description?: string } =>
  !!n && typeof n === 'object' && '$value' in (n as object)

function* walk(node: Doc, pre: TokenPath = []): Generator<[TokenPath, { $type: string; $value: unknown; $description?: string }]> {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue
    if (isToken(v)) yield [[...pre, k], v]
    else yield* walk(v as Doc, [...pre, k])
  }
}

const ALIAS = /^\{([^{}]+)\}$/
function valueOf(raw: unknown, where: string): Value {
  if (typeof raw === 'string') {
    const m = ALIAS.exec(raw)
    if (!m) throw new Error(`${where}: not a color and not an alias: ${raw}`)
    return { type: 'color', alias: m[1].split('.') }
  }
  const c = raw as Color
  if (!c || c.colorSpace !== 'srgb' || !Array.isArray(c.components) || typeof c.hex !== 'string') throw new Error(`${where}: not an sRGB color`)
  return { type: 'color', value: { colorSpace: 'srgb', components: [c.components[0], c.components[1], c.components[2]], alpha: c.alpha, hex: c.hex } }
}

/** the engine's tokens, each with a value per theme context, or none when the files are absent */
export function engineTokens(): Token[] {
  const theme = collections.theme
  if (!theme.external) return []
  const docs: Record<string, Doc> = {}
  for (const ctx of theme.contexts) {
    const file = path.join(ROOT, `${theme.external}.${ctx}.tokens.json`)
    if (!fs.existsSync(file)) return []
    docs[ctx] = JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  const [first, ...rest] = theme.contexts
  const out: Token[] = []
  for (const [p, t] of walk(docs[first])) {
    const key = p.join('/')
    if (t.$type !== 'color') throw new Error(`${key}: the engine's file carries a ${t.$type}; only colors are expected`)
    const byContext: Record<string, Value> = { [first]: valueOf(t.$value, key) }
    for (const ctx of rest) {
      let node: unknown = docs[ctx]
      for (const seg of p) node = node && (node as Doc)[seg]
      if (!isToken(node)) throw new Error(`${key}: missing from the engine's ${ctx} file`)
      byContext[ctx] = valueOf(node.$value, `${key} (${ctx})`)
    }
    const lines = (t.$description ?? '').split('\n')
    out.push({ path: p, layer: 'primitive', req: lines[0].replace(/^Req for: /, ''), use: lines.slice(1).join('\n'), value: byContext[theme.default ?? first], byContext })
  }
  return out
}
