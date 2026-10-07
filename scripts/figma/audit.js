// Lists what the set does not own, so the hand work after a run deletes nothing that is
// still referred to and misses nothing that is not. Read-only. After a run every row the
// set owns, and every engine row it found, carries a stamp, so an unstamped variable,
// text style or effect style is a leftover by definition, whatever its name. Each is
// listed with where it lives and every layer, style and variable that refers to it, the
// unreferenced ones first. Paint and grid styles are not listed: the set writes none, so
// a stamp says nothing about them; a paint style bound to a leftover is listed as a use.
// A plugin walks every page; a script runner that cannot load pages walks the current
// one and says so. The return value is the list as text, with its counts.
const NAMESPACE = 'tokens'
const STAMP = 'path'
const stampOf = (node, key) => node.getSharedPluginData(NAMESPACE, key)

const variables = await figma.variables.getLocalVariablesAsync()
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const textStyles = await figma.getLocalTextStylesAsync()
const effectStyles = await figma.getLocalEffectStylesAsync()
const paintStyles = await figma.getLocalPaintStylesAsync()
const collectionName = new Map(collections.map(c => [c.id, c.name]))
const modeName = new Map(collections.flatMap(c => c.modes.map(m => [m.modeId, m.name])))

// id -> entry, for every unstamped variable and style
const left = new Map()
for (const v of variables) if (!stampOf(v, STAMP)) left.set(v.id, { name: v.name, where: collectionName.get(v.variableCollectionId) || 'no collection', uses: [] })
for (const s of textStyles) if (!stampOf(s, STAMP)) left.set(s.id, { name: s.name, where: 'text styles', uses: [] })
for (const s of effectStyles) if (!stampOf(s, STAMP)) left.set(s.id, { name: s.name, where: 'effect styles', uses: [] })

const notes = []
const use = (id, text) => { const e = left.get(id); if (e) e.uses.push(text) }
const where = (node) => { const parts = []; for (let n = node; n && n.type !== 'DOCUMENT'; n = n.parent) parts.unshift(n.name); return parts.join(' > ') }
// every variable a boundVariables record refers to, whatever its shape: a field, a list
// (fills, strokes, effects, layout grids) or a map (component properties)
const aliasIds = (bound) => {
  const ids = []
  const walk = (v, field) => {
    if (!v || typeof v !== 'object') return
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${field}[${i}]`)); return }
    if (v.type === 'VARIABLE_ALIAS') { ids.push([v.id, field]); return }
    for (const [k, x] of Object.entries(v)) walk(x, `${field}.${k}`)
  }
  for (const [field, v] of Object.entries(bound || {})) walk(v, field)
  return ids
}

let scope = figma.currentPage
try { await figma.loadAllPagesAsync(); scope = figma.root }
catch (e) { notes.push('only the current page was walked: this runtime cannot load every page; run the plugin for the whole file') }
for (const node of scope.findAll(() => true)) {
  const label = where(node)
  for (const [id, field] of aliasIds(node.boundVariables)) use(id, `${label}: ${field}`)
  if ('textStyleId' in node) {
    if (node.textStyleId === figma.mixed) {
      try { for (const seg of node.getStyledTextSegments(['textStyleId'])) if (seg.textStyleId) use(seg.textStyleId, `${label}: characters ${seg.start}-${seg.end}`) }
      catch (e) { notes.push(`${label}: mixed text styles, not read: ${e.message}`) }
    } else if (node.textStyleId) use(node.textStyleId, `${label}: text style`)
  }
  if ('effectStyleId' in node && node.effectStyleId) use(node.effectStyleId, `${label}: effect style`)
}
for (const v of variables) for (const [modeId, val] of Object.entries(v.valuesByMode)) if (val && val.type === 'VARIABLE_ALIAS') use(val.id, `variable ${v.name} (${modeName.get(modeId) || modeId}): alias`)
for (const s of textStyles) for (const [id, field] of aliasIds(s.boundVariables)) use(id, `text style ${s.name}: ${field}`)
for (const s of effectStyles) for (const e of s.effects) for (const [id, field] of aliasIds(e.boundVariables)) use(id, `effect style ${s.name}: ${field}`)
for (const s of paintStyles) for (const p of s.paints) for (const [id, field] of aliasIds(p.boundVariables)) use(id, `paint style ${s.name}: ${field}`)

const byName = (a, b) => a.name.localeCompare(b.name)
const entries = [...left.values()].sort(byName)
const unbound = entries.filter(e => !e.uses.length)
const bound = entries.filter(e => e.uses.length)
const grouped = (list) => { const g = new Map(); for (const e of list) g.set(e.where, [...(g.get(e.where) || []), e]); return g }
const lines = [`${entries.length} unstamped: ${unbound.length} that nothing refers to, ${bound.length} still referred to`]
for (const n of notes) lines.push(`note: ${n}`)
lines.push('', '## Nothing refers to these; delete them')
for (const [w, es] of grouped(unbound)) { lines.push('', `${w}:`); for (const e of es) lines.push(`  ${e.name}`) }
lines.push('', '## Still referred to; rebind each use to the successor, then delete')
for (const [w, es] of grouped(bound)) {
  lines.push('', `${w}:`)
  for (const e of es) {
    lines.push(`  ${e.name} (${e.uses.length})`)
    for (const u of e.uses.slice(0, 40)) lines.push(`    ${u}`)
    if (e.uses.length > 40) lines.push(`    ... ${e.uses.length - 40} more`)
  }
}
const rowsOf = (c) => variables.filter(v => v.variableCollectionId === c.id)
const unowned = collections.filter(c => rowsOf(c).length && rowsOf(c).every(v => !stampOf(v, STAMP)))
if (unowned.length) { lines.push('', '## Collections with no stamped row; delete each once its rows are gone'); for (const c of unowned) lines.push(`  ${c.name} (${rowsOf(c).length} rows)`) }
return { text: lines.join('\n'), unstamped: entries.length, unreferenced: unbound.length, referenced: bound.length }
