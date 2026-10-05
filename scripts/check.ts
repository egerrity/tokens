// The independent parser: the audit cannot prove conformance to the format it targets,
// so each token file is also checked by a third-party Design Tokens parser, fetched
// through npx. Needs the network.
//
//   npm run check
import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const dir = path.join(import.meta.dirname, '..', 'dist', 'tokens')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tokens.json')).sort()
let failed = 0
for (const f of files) {
  const run = spawnSync('npx', ['-y', '-p', '@terrazzo/cli@latest', 'tz', 'check', path.join(dir, f)], { stdio: 'inherit' })
  if (run.status !== 0) failed++
}
if (failed) { console.error(`check FAILED: ${failed} of ${files.length} files rejected`); process.exit(1) }
console.log(`check ok: ${files.length} files accepted`)
