// The color engine's documents, generated from the brands declaration: for each brand,
// okchroma solves the theme from its elections and renders one Design Tokens document
// per theme context under the color group, on identical paths. Every semantic color
// aliases one of these rows, so the audit needs them to resolve, and the Figma payload
// for the theme collection carries them beside the surfaces, marked external: the
// engine's own plugin writes their values in Figma.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { resolveTheme, themeTokens, tokensToDtcg } from 'okchroma'
import { brands, DEFAULT_BRAND, PROFILE } from '../declarations/brands.ts'
import { collections } from '../declarations/collections.ts'
import type { TokenPath } from '../grammar/path.ts'
import type { Color, Token, Value } from './types.ts'

/** the group every engine path sits under: the color category */
const ROOT_GROUP = 'color'

type DocToken = { $type: string; $value: unknown; $description?: string }
type Doc = { [name: string]: Doc | DocToken }
const isToken = (n: unknown): n is DocToken => !!n && typeof n === 'object' && '$value' in (n as object)

/** the engine's version, from the installed package, so a document says what solved it */
export const engineVersion = (): string =>
  JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '..', 'node_modules', 'okchroma', 'package.json'), 'utf8')).version

/** one brand's documents, by theme context; each says the engine's version and the brand that solved it */
export function engineDocuments(brand: string): Record<string, Doc> {
  const e = brands[brand]
  if (!e) throw new Error(`${brand}: not a brand in declarations/brands.ts`)
  const theme = resolveTheme({
    primaryHex: e.primaryHex, name: brand,
    secondaryHex: e.secondaryHex ?? null, secondaryStyle: e.secondaryStyle, deriveSecondary: !e.secondaryHex,
    contrastProfile: PROFILE,
  })
  const tokens = themeTokens({
    slug: brand, brand: theme.themed,
    secondary: theme.secondary?.scale ?? null, secondaryStyle: theme.secondary?.style ?? e.secondaryStyle,
    neutralLevel: e.neutralLevel, ctaEscape: e.ctaEscape, linkHex: e.linkHex, ctaBorder: e.ctaBorder,
    contrastProfile: PROFILE,
  })
  const docs = tokensToDtcg(tokens, { rootGroup: ROOT_GROUP }) as Record<string, Doc>
  const version = engineVersion()
  const out: Record<string, Doc> = {}
  for (const ctx of collections.theme.contexts) {
    if (!docs[ctx]) throw new Error(`${brand}: the engine has no ${ctx} document`)
    out[ctx] = { $extensions: { okchroma: { version, brand } } as unknown as Doc, ...docs[ctx] }
  }
  return out
}

/** the bytes of an engine document: the engine's own serialization */
export const serializeEngine = (doc: Doc): string => JSON.stringify(doc, null, 2) + '\n'

function* walk(node: Doc, pre: TokenPath = []): Generator<[TokenPath, DocToken]> {
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

/** a brand's engine rows as tokens, each with a value per theme context */
export function engineTokens(brand: string = DEFAULT_BRAND): Token[] {
  const theme = collections.theme
  if (!theme.external) return []
  const docs = engineDocuments(brand)
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
    out.push({ path: p, layer: 'base', req: lines[0].replace(/^Req for: /, ''), use: lines.slice(1).join('\n'), value: byContext[theme.default ?? first], byContext })
  }
  return out
}

/** every brand emits the same paths, so a role's alias resolves whichever brand is built */
export function brandFailures(): string[] {
  const want = engineTokens(DEFAULT_BRAND).map(t => t.path.join('/'))
  const out: string[] = []
  for (const brand of Object.keys(brands)) {
    if (brand === DEFAULT_BRAND) continue
    const have = engineTokens(brand).map(t => t.path.join('/'))
    if (have.length !== want.length || have.some((p, i) => p !== want[i])) out.push(`${brand}: the engine's paths differ from ${DEFAULT_BRAND}'s`)
  }
  return out
}
