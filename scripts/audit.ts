// The gate, as a command.
//
//   npm run audit
//
// Beyond the roster and document checks (src/audit.ts), it holds two things only a
// command can: the build is deterministic, and the files on disk are the files the
// declarations produce, so a declaration edited without a regenerate fails here.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { brands } from '../declarations/brands.ts'
import { compat } from '../declarations/compat.ts'
import { build, report } from '../src/build.ts'

const root = path.join(import.meta.dirname, '..')
const first = build()
const second = build()
const failures = [...first.failures]

for (const [name, content] of Object.entries(first.files)) {
  if (second.files[name] !== content) failures.push(`${name}: two builds of the same declarations differ`)
  const file = path.join(root, name)
  if (!fs.existsSync(file)) failures.push(`${name}: not on disk; run npm run generate`)
  else if (fs.readFileSync(file, 'utf8') !== content) failures.push(`${name}: on disk it differs from what the declarations produce; run npm run generate`)
}

// a generated folder holds nothing the declarations did not produce
for (const folder of ['dist/tokens', 'dist/figma', 'dist/brands', 'docs/groups']) {
  const dir = path.join(root, folder)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir, { recursive: true }) as string[]) {
    if (fs.statSync(path.join(dir, f)).isDirectory()) continue
    // the Finder's own files are not output and are not ours
    if (path.basename(f) === '.DS_Store') continue
    if (!(`${folder}/${f}` in first.files)) failures.push(`${folder}/${f}: on disk but not produced by the declarations; delete it`)
  }
}

// the bridge covers every name the library's styling reads: defined by each brand's
// theme file, or exempt in the compat declaration for a stated reason
const reads = fs.readFileSync(path.join(root, 'mapping/unify-reads.txt'), 'utf8').split('\n').map(s => s.trim()).filter(Boolean)
const exempt = new Set(Object.entries(compat).flatMap(([n, c]) => (c.how === 'alias' ? [] : [`--${n}`])))
for (const brand of Object.keys(brands)) {
  const css = first.files[`dist/brands/${brand}/web/variables.css`] ?? ''
  const defined = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map(m => m[1]))
  for (const n of reads) if (!exempt.has(n) && !defined.has(n)) failures.push(`${brand}: ${n} is read by the library's styling and is neither defined in its theme file nor exempt in declarations/compat.ts`)
}
for (const n of Object.keys(compat)) if (!reads.includes(`--${n}`)) failures.push(`compat: --${n} is not in mapping/unify-reads.txt; the bridge holds only names the library reads`)

if (failures.length) { report('audit', failures); process.exit(1) }
console.log(`audit ok: ${first.count} tokens, ${Object.keys(first.files).length} files match the declarations, names in the grammar, every token described, scales ascending and named by their values, aliases resolved, two builds identical, ${reads.length} names the library reads defined or exempt`)
