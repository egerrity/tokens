// One build: the roster, its documents and its pages, as the files they become. Both
// commands call this, so what the audit checks is byte for byte what generate writes.
import { CATEGORIES } from '../grammar/words.ts'
import { audit } from './audit.ts'
import { documents, fileName, serialize } from './dtcg.ts'
import { page, pageName } from './pages.ts'
import { roster, tokensOf } from './roster.ts'

export type Build = { count: number; failures: string[]; files: Record<string, string> }

export function build(): Build {
  const tokens = roster()
  const docs = documents(tokens)
  const files: Record<string, string> = {}
  for (const [collection, doc] of Object.entries(docs)) files[`dist/tokens/${fileName(collection)}`] = serialize(doc)
  for (const category of CATEGORIES) files[`docs/groups/${pageName(category)}`] = page(category, tokensOf(category), tokens)
  return { count: tokens.length, failures: audit(tokens, docs), files }
}

export function report(name: string, failures: string[]): void {
  console.error(`${name} FAILED (${failures.length})`)
  for (const f of failures.slice(0, 60)) console.error('  ' + f)
  if (failures.length > 60) console.error(`  ... ${failures.length - 60} more`)
}
