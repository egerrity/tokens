// One build: the roster, its documents, the resolver, the Figma payload and the pages,
// as the files they become. Both commands call this, so what the audit checks is byte
// for byte what generate writes.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { brands, DEFAULT_BRAND } from '../declarations/brands.ts'
import { collections } from '../declarations/collections.ts'
import { CATEGORIES } from '../grammar/words.ts'
import { audit } from './audit.ts'
import { documents, engineFileName, resolver, serialize } from './dtcg.ts'
import { brandFailures, engineDocuments, engineTokens, serializeEngine } from './engine.ts'
import { figmaFiles, figmaPayloads } from './figma.ts'
import { handWorkPage, page, pageName } from './pages.ts'
import { slotsPage } from './slots.ts'
import { externals, roster, tokensOf } from './roster.ts'
import { themeFolder } from './theme-folder.ts'
import type { Token } from './types.ts'

export type Build = { count: number; failures: string[]; files: Record<string, string> }

export function build(): Build {
  const tokens = roster()
  const outside = externals()
  const docs = documents(tokens)
  const files: Record<string, string> = {}
  for (const [name, { doc }] of docs) files[`dist/tokens/${name}`] = serialize(doc)
  // the engine's documents and a resolver per brand; resolver.json is the default brand's
  const engine = collections.theme.external
  for (const brand of Object.keys(brands)) {
    if (engine) for (const [context, doc] of Object.entries(engineDocuments(brand))) files[`dist/tokens/${engineFileName(engine, brand, context)}`] = serializeEngine(doc)
    files[`dist/tokens/resolver.${brand}.json`] = resolver(brand)
    Object.assign(files, themeFolder(brand, tokens, engineTokens(brand)))
  }
  files['dist/tokens/resolver.json'] = resolver(DEFAULT_BRAND)
  for (const [name, content] of Object.entries(figmaFiles(tokens, outside))) files[`dist/figma/${name}`] = content
  Object.assign(files, figmaPlugin(tokens, outside))
  for (const category of CATEGORIES) files[`docs/groups/${pageName(category)}`] = page(category, tokensOf(category), tokens, outside)
  files['docs/hand-work.md'] = handWorkPage(tokens, outside)
  files['docs/slots.md'] = slotsPage(tokens, outside)
  return { count: tokens.length, failures: [...audit(tokens, docs, outside), ...brandFailures()], files }
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
  // today's names and their successors, for the leftovers list to name a successor
  const today: Record<string, string> = {}
  for (const c of collections) for (const v of c.variables) if (v.today) today[v.today] = v.path
  for (const s of styles.styles) if (s.today) today[s.today] = s.name
  for (const e of effects.styles) if (e.today) today[e.today] = e.name
  const script = (name: string) => fs.readFileSync(path.join(import.meta.dirname, '..', 'scripts', 'figma', name), 'utf8')
  const code = [
    '// Generated: scripts/figma/apply.js with every payload inlined, in alias order, and',
    '// scripts/figma/audit.js, as the two commands of manifest.json. Import the manifest',
    '// under Plugins > Development in Figma; each command ends in a window with its report.',
    'const apply = async () => {',
    script('apply.js').replace('/* PAYLOAD */ null', JSON.stringify(payloads)),
    '}',
    'const audit = async () => {',
    script('audit.js').replace('/* TODAY */ null', JSON.stringify(today)),
    '}',
    // the report window: the text with a Copy button, and a CSV of the same report to download
    'const show = (title, text, csv, filename) => {',
    "  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])",
    "  const dl = csv ? `<button id=d>Download CSV</button>` : ''",
    "  figma.showUI(`<style>body{margin:0;height:100vh;display:flex;flex-direction:column;font:12px/1.4 ui-monospace,Menlo,monospace}header{display:flex;gap:8px;align-items:center;padding:8px}textarea{flex:1;margin:0 8px 8px;white-space:pre;font:inherit;resize:none}</style><header><b>${esc(title)}</b><button id=c>Copy</button>${dl}<span id=s></span></header><textarea id=t readonly>${esc(text)}</textarea><script>const t=document.getElementById('t');const s=document.getElementById('s');document.getElementById('c').onclick=()=>{t.select();const done=()=>{s.textContent='copied'};const old=()=>{document.execCommand('copy');done()};(navigator.clipboard&&navigator.clipboard.writeText)?navigator.clipboard.writeText(t.value).then(done,old):old()};const d=document.getElementById('d');if(d){d.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([${JSON.stringify(csv || '')}],{type:'text/csv;charset=utf-8'}));a.download=${JSON.stringify(filename || 'tokens.csv')};document.body.appendChild(a);a.click();a.remove();s.textContent='downloaded'}}</script>`, { width: 640, height: 520, title })",
    '}',
    // the apply report as CSV: a line per item under its section, with a column to tick
    'const applyCsv = r => {',
    "  const q = s => '\"' + String(s == null ? '' : s).replace(/\"/g, '\"\"') + '\"'",
    "  const rows = [['Section', 'Item', 'Done']]",
    "  for (const k of ['created', 'renamed', 'updated', 'orphans', 'problems']) for (const item of r[k] || []) rows.push([k, item, ''])",
    "  rows.push(['same', r.same, ''], ['rebound', r.rebound, ''])",
    "  return '\\uFEFF' + rows.map(x => x.map(q).join(',')).join('\\r\\n') + '\\r\\n'",
    '}',
    "const run = figma.command === 'audit' ? audit().then(r => show('tokens: the leftovers', r.text, r.csv, 'tokens-leftovers.csv')) : apply().then(r => show('tokens: applied', JSON.stringify(r, null, 2), applyCsv(r), 'tokens-applied.csv'))",
    "run.catch(e => show('tokens: failed', [e && e.message, e && e.stack].filter(Boolean).join('\\n') || String(e)))",
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
