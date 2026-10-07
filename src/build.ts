// One build: the roster, its documents, the resolver, the Figma payload and the pages,
// as the files they become. Both commands call this, so what the audit checks is byte
// for byte what generate writes.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { CATEGORIES } from '../grammar/words.ts'
import { audit } from './audit.ts'
import { documents, resolver, serialize } from './dtcg.ts'
import { figmaFiles, figmaPayloads } from './figma.ts'
import { handWorkPage, page, pageName } from './pages.ts'
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
  files['docs/hand-work.md'] = handWorkPage(tokens, outside)
  return { count: tokens.length, failures: audit(tokens, docs, outside), files }
}

// the collections in the order aliases need: an alias's target must exist before it
const PLUGIN_ORDER = ['scale', 'motion', 'viewport', 'theme', 'palette']

/**
 * The development plugin: the apply script with every payload inlined, in alias order,
 * and the audit script, as two menu commands, so a Figma file takes the whole set in
 * one run from Plugins > Development with no script runner and no size cap, and the
 * leftovers are listed the same way. Each command ends in a window holding its report
 * with a Copy button, and the plugin stays open until the window is closed: a console
 * shows a report only while it is open, a window shows it until it is read.
 */
function figmaPlugin(tokens: Token[], outside: Token[]): Record<string, string> {
  const { collections, styles, effects } = figmaPayloads(tokens, outside)
  const byName = new Map(collections.map(c => [c.collection, c]))
  const missing = PLUGIN_ORDER.filter(n => !byName.has(n))
  const extra = collections.map(c => c.collection).filter(n => !PLUGIN_ORDER.includes(n))
  if (missing.length || extra.length) throw new Error(`plugin order: missing ${missing.join(', ') || 'none'}, unordered ${extra.join(', ') || 'none'}`)
  const payloads = [...PLUGIN_ORDER.map(n => byName.get(n)), styles, effects]
  const script = (name: string) => fs.readFileSync(path.join(import.meta.dirname, '..', 'scripts', 'figma', name), 'utf8')
  const code = [
    '// Generated: scripts/figma/apply.js with every payload inlined, in alias order, and',
    '// scripts/figma/audit.js, as the two commands of manifest.json. Import the manifest',
    '// under Plugins > Development in Figma; each command ends in a window with its report.',
    'const apply = async () => {',
    script('apply.js').replace('/* PAYLOAD */ null', JSON.stringify(payloads)),
    '}',
    'const audit = async () => {',
    script('audit.js'),
    '}',
    'const show = (title, text) => {',
    "  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])",
    "  figma.showUI(`<style>body{margin:0;height:100vh;display:flex;flex-direction:column;font:12px/1.4 ui-monospace,Menlo,monospace}header{display:flex;gap:8px;align-items:center;padding:8px}textarea{flex:1;margin:0 8px 8px;white-space:pre;font:inherit;resize:none}</style><header><b>${esc(title)}</b><button id=c>Copy</button><span id=s></span></header><textarea id=t readonly>${esc(text)}</textarea><script>const t=document.getElementById('t');document.getElementById('c').onclick=()=>{t.select();document.execCommand('copy');document.getElementById('s').textContent='copied'}</script>`, { width: 640, height: 520, title })",
    '}',
    "const run = figma.command === 'audit' ? audit().then(r => show('tokens: the leftovers', r.text)) : apply().then(r => show('tokens: applied', JSON.stringify(r, null, 2)))",
    "run.catch(e => show('tokens: failed', (e && e.stack) || e))",
    '',
  ].join('\n')
  const manifest = {
    name: 'tokens apply', id: 'tokens-apply', api: '1.0.0', main: 'code.js',
    editorType: ['figma'], documentAccess: 'dynamic-page', networkAccess: { allowedDomains: ['none'] },
    menu: [{ name: 'Apply the set', command: 'apply' }, { name: 'List the leftovers', command: 'audit' }],
  }
  return { 'dist/figma/plugin/code.js': code, 'dist/figma/plugin/manifest.json': JSON.stringify(manifest, null, 2) + '\n' }
}

export function report(name: string, failures: string[]): void {
  console.error(`${name} FAILED (${failures.length})`)
  for (const f of failures.slice(0, 60)) console.error('  ' + f)
  if (failures.length > 60) console.error(`  ... ${failures.length - 60} more`)
}
