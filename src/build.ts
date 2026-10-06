// One build: the roster, its documents, the resolver, the Figma payload and the pages,
// as the files they become. Both commands call this, so what the audit checks is byte
// for byte what generate writes.
import { CATEGORIES } from '../grammar/words.ts'
import { audit } from './audit.ts'
import { documents, resolver, serialize } from './dtcg.ts'
import { figmaFiles } from './figma.ts'
import { page, pageName } from './pages.ts'
import { externals, roster, tokensOf } from './roster.ts'

export type Build = { count: number; failures: string[]; files: Record<string, string> }

export function build(): Build {
  const tokens = roster()
  const outside = externals()
  const docs = documents(tokens)
  const files: Record<string, string> = {}
  for (const [name, { doc }] of docs) files[`dist/tokens/${name}`] = serialize(doc)
  files['dist/tokens/resolver.json'] = resolver()
  for (const [name, content] of Object.entries(figmaFiles(tokens, outside))) files[`dist/figma/${name}`] = content
  for (const category of CATEGORIES) files[`docs/groups/${pageName(category)}`] = page(category, tokensOf(category), tokens, outside)
  return { count: tokens.length, failures: audit(tokens, docs, outside), files }
}

export function report(name: string, failures: string[]): void {
  console.error(`${name} FAILED (${failures.length})`)
  for (const f of failures.slice(0, 60)) console.error('  ' + f)
  if (failures.length > 60) console.error(`  ... ${failures.length - 60} more`)
}
