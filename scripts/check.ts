// The independent parser: the audit cannot prove conformance to the format it targets,
// so the output is also checked by a third-party Design Tokens parser, fetched through
// npx. Needs the network.
//
//   npm run check
//
// A collection's file references tokens in other files, so each context is checked as
// the joined document a resolver would produce: every set, then that context's file,
// merged into one temporary file.
import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

const dir = path.join(import.meta.dirname, '..', 'dist', 'tokens')
const resolver = JSON.parse(fs.readFileSync(path.join(dir, 'resolver.json'), 'utf8'))
const read = (ref: string) => JSON.parse(fs.readFileSync(path.join(dir, ref), 'utf8'))
const merge = (into: Record<string, unknown>, from: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(from)) {
    const cur = into[k]
    if (cur && typeof cur === 'object' && v && typeof v === 'object' && !('$value' in cur) && !('$value' in v)) merge(cur as Record<string, unknown>, v as Record<string, unknown>)
    else into[k] = v
  }
}
const sets: Record<string, unknown> = {}
for (const set of Object.values(resolver.sets) as { sources: { $ref: string }[] }[]) for (const s of set.sources) merge(sets, read(s.$ref))

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-check-'))
const cases: [string, Record<string, unknown>][] = []
const modifiers = Object.entries(resolver.modifiers) as [string, { contexts: Record<string, { $ref: string }[]>; default?: string }][]
if (modifiers.length === 0) cases.push(['all', sets])
// a joined document needs one context of every modifier, so each case takes the other
// modifiers at their default context and varies one
for (const [name, mod] of modifiers) {
  for (const [context, sources] of Object.entries(mod.contexts)) {
    const doc = JSON.parse(JSON.stringify(sets))
    for (const [other, om] of modifiers) {
      if (other === name) continue
      const d = om.default ?? Object.keys(om.contexts)[0]
      for (const s of om.contexts[d]) merge(doc, read(s.$ref))
    }
    for (const s of sources) merge(doc, read(s.$ref))
    cases.push([`${name}.${context}`, doc])
  }
}
let failed = 0
for (const [label, doc] of cases) {
  const file = path.join(tmp, `${label}.tokens.json`)
  fs.writeFileSync(file, JSON.stringify(doc, null, 2) + '\n')
  console.log(`checking ${label}`)
  const run = spawnSync('npx', ['-y', '-p', '@terrazzo/cli@latest', 'tz', 'check', file], { stdio: 'inherit' })
  if (run.status !== 0) failed++
}
if (failed) { console.error(`check FAILED: ${failed} of ${cases.length} joined documents rejected`); process.exit(1) }
console.log(`check ok: ${cases.length} joined documents accepted`)
