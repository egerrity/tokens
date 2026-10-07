// One build: the roster, its documents, the resolver, the Figma payload and the pages,
// as the files they become. Both commands call this, so what the audit checks is byte
// for byte what generate writes.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { CATEGORIES } from '../grammar/words.ts'
import { audit } from './audit.ts'
import { documents, resolver, serialize } from './dtcg.ts'
import { figmaFiles, figmaPayloads } from './figma.ts'
import { page, pageName } from './pages.ts'
import { externals, roster, tokensOf } from './roster.ts'
import type { Token } from './types.ts'

export type Build = { count: number; failures: string[]; files: Record<string, string> }

export function build(): Build {
  const tokens = roster()
  const outside = externals()
  const docs = documents(tokens)
  const files: Record<string, string> = {}
  for (const [name, { doc }] of docs) files[`dist/tokens/${name}`] = serialize(doc)
  files['dist/tokens/resolver.json'] = resolver()
  for (const [name, content] of Object.entries(figmaFiles(tokens, outside))) files[`dist/figma/${name}`] = content
  Object.assign(files, figmaPlugin(tokens, outside))
  for (const category of CATEGORIES) files[`docs/groups/${pageName(category)}`] = page(category, tokensOf(category), tokens, outside)
  return { count: tokens.length, failures: audit(tokens, docs, outside), files }
}

// the collections in the order aliases need: an alias's target must exist before it
const PLUGIN_ORDER = ['scale', 'motion', 'viewport', 'theme', 'palette']

/**
 * The development plugin: the apply script with every payload inlined, in alias order,
 * so a Figma file takes the whole set in one run from Plugins > Development, with no
 * script runner and no size cap. The report goes to the plugin console.
 */
function figmaPlugin(tokens: Token[], outside: Token[]): Record<string, string> {
  const { collections, styles, effects } = figmaPayloads(tokens, outside)
  const byName = new Map(collections.map(c => [c.collection, c]))
  const missing = PLUGIN_ORDER.filter(n => !byName.has(n))
  const extra = collections.map(c => c.collection).filter(n => !PLUGIN_ORDER.includes(n))
  if (missing.length || extra.length) throw new Error(`plugin order: missing ${missing.join(', ') || 'none'}, unordered ${extra.join(', ') || 'none'}`)
  const payloads = [...PLUGIN_ORDER.map(n => byName.get(n)), styles, effects]
  const apply = fs.readFileSync(path.join(import.meta.dirname, '..', 'scripts', 'figma', 'apply.js'), 'utf8')
  const code = [
    '// Generated: scripts/figma/apply.js with every payload inlined, in alias order. Import',
    '// manifest.json under Plugins > Development in Figma; the report goes to the console.',
    '(async () => {',
    apply.replace('/* PAYLOAD */ null', JSON.stringify(payloads)),
    '})().then(',
    "  r => { console.log(JSON.stringify(r, null, 2)); figma.closePlugin('tokens: applied; the report is in the console') },",
    "  e => { console.error(e); figma.closePlugin('tokens: failed; see the console') },",
    ')',
    '',
  ].join('\n')
  const manifest = {
    name: 'tokens apply', id: 'tokens-apply', api: '1.0.0', main: 'code.js',
    editorType: ['figma'], documentAccess: 'dynamic-page', networkAccess: { allowedDomains: ['none'] },
  }
  return { 'dist/figma/plugin/code.js': code, 'dist/figma/plugin/manifest.json': JSON.stringify(manifest, null, 2) + '\n' }
}

export function report(name: string, failures: string[]): void {
  console.error(`${name} FAILED (${failures.length})`)
  for (const f of failures.slice(0, 60)) console.error('  ' + f)
  if (failures.length > 60) console.error(`  ... ${failures.length - 60} more`)
}
