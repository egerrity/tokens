// Prints the plugin code that applies one Figma payload: apply.js with the payload
// inlined at its marker.
//
//   node scripts/figma-call.ts <payload>...         any of scale, viewport, motion, text-styles, applied in order
//   node scripts/figma-call.ts <payload> <n> <of>   the nth of <of> chunks of one payload's variables
//
// Chunks exist because a script runner caps the code it takes; each chunk is a complete
// run over part of the variables and the runs can go in any order, except that an alias
// needs its target to exist, so the scale goes first and a payload's chunks go in order.
import * as fs from 'node:fs'
import * as path from 'node:path'

const args = process.argv.slice(2)
if (!args.length) { console.error('usage: node scripts/figma-call.ts <payload>... | <payload> <n> <of>'); process.exit(1) }
const root = path.join(import.meta.dirname, '..')
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(root, 'dist', 'figma', `${name}.json`), 'utf8'))
let inlined: unknown
if (args.length === 3 && /^\d+$/.test(args[1]) && /^\d+$/.test(args[2])) {
  const [name, nth, of] = args
  const payload = read(name)
  const list: unknown[] = payload.kind === 'variables' ? payload.variables : payload.styles
  const size = Math.ceil(list.length / Number(of))
  const slice = list.slice((Number(nth) - 1) * size, Number(nth) * size)
  if (payload.kind === 'variables') payload.variables = slice; else payload.styles = slice
  inlined = payload
} else {
  inlined = args.length === 1 ? read(args[0]) : args.map(read)
}
const script = fs.readFileSync(path.join(root, 'scripts', 'figma', 'apply.js'), 'utf8')
process.stdout.write(script.replace('/* PAYLOAD */ null', JSON.stringify(inlined)))
