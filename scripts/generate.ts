// Writes the token files and the group pages.
//
//   npm run generate
//
// Nothing is written unless the audit passes: a set that fails is never left on disk
// looking like output.
import * as fs from 'node:fs'
import * as path from 'node:path'
import { build, report } from '../src/build.ts'

const root = path.join(import.meta.dirname, '..')
const { count, failures, files } = build()
if (failures.length) { report('generate', failures); process.exit(1) }

for (const [name, content] of Object.entries(files)) {
  const file = path.join(root, name)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const changed = !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content
  if (changed) fs.writeFileSync(file, content)
  console.log(`  ${changed ? 'wrote' : 'same '} ${name}`)
}
console.log(`generate ok: ${count} tokens`)
