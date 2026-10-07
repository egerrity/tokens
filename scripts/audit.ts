// The gate, as a command.
//
//   npm run audit
//
// Beyond the roster and document checks (src/audit.ts), it holds two things only a
// command can: the build is deterministic, and the files on disk are the files the
// declarations produce, so a declaration edited without a regenerate fails here.
import * as fs from 'node:fs'
import * as path from 'node:path'
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
for (const folder of ['dist/tokens', 'dist/figma', 'docs/groups']) {
  const dir = path.join(root, folder)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir, { recursive: true }) as string[]) {
    if (fs.statSync(path.join(dir, f)).isDirectory()) continue
    // the engine's own files are copied in, never produced here
    if (folder === 'dist/tokens' && f.startsWith('engine.')) continue
    if (!(`${folder}/${f}` in first.files)) failures.push(`${folder}/${f}: on disk but not produced by the declarations; delete it`)
  }
}

if (failures.length) { report('audit', failures); process.exit(1) }
console.log(`audit ok: ${first.count} tokens, ${Object.keys(first.files).length} files match the declarations, names in the grammar, every token described, scales ascending and named by their values, aliases resolved, two builds identical`)
