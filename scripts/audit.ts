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

if (failures.length) { report('audit', failures); process.exit(1) }
console.log(`audit ok: ${first.count} tokens, ${Object.keys(first.files).length} files match the declarations, names in the grammar, every token described, scales ascending and named by their values, aliases resolved, two builds identical`)
