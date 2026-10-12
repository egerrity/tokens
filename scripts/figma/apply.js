// Applies one Figma payload (dist/figma/*.json) inside Figma. Runs as plugin code: paste
// it, with the payload inlined where the marker is, into a plugin or into the Figma
// connection's script runner (scripts/figma-call.ts prints that text).
//
// Every variable and style is found by its stamp first, then by today's name, then by
// its new name, and is updated in place, so bindings survive. The color engine's rows
// are another writer's: found by name and stamped, never created or written. The stamp is the identity:
// a variable renamed by hand is renamed back. Nothing is deleted and no value is written
// that is already what the payload asks for; a row a designer has composed by hand (an
// alias with an opacity) reads back as its alias and is left alone. A row the script
// cannot settle without guessing, such as two variables carrying one stamp or a name
// another variable holds, is left alone and reported. Where today's row sits in a
// collection the new row cannot live in, the new row is created and every binding to
// the old one moves to it. The return value is the report.
const PAYLOAD = /* PAYLOAD */ null

// the stamp is shared plugin data, which every runtime can write; private plugin data
// is refused outside a private plugin
const NAMESPACE = 'tokens'
const STAMP = 'path'
const COLLECTION_STAMP = 'collection'
const stampOf = (node, key) => node.getSharedPluginData(NAMESPACE, key)
const stamp = (node, key, value) => node.setSharedPluginData(NAMESPACE, key, value)

const report = { created: [], renamed: [], updated: [], same: 0, kept: [], orphans: [], rebound: 0, restyled: 0, problems: [] }

// Every change to a row the file already has is a difference between the file and the
// set, and the run makes two passes over the payloads: the first creates what is missing
// and lists every difference without writing it; the owner then chooses, in a window,
// which to update and which to keep; the second pass writes the updates, and what was
// kept is reported and comes back next run, until the set says the same thing. A row
// created this run is written outright: nothing in it is anyone's hand.
let PLANNING = false
const diffs = []
const keep = new Set()
const fresh = new Set()
const byId = new Map()
const show = (x) => {
  if (x === undefined || x === null || x === '') return 'nothing'
  if (typeof x !== 'object') return String(x)
  if (x.type === 'VARIABLE_ALIAS') { const t = byId.get(x.id); return `alias of ${t ? t.name : x.id}` }
  if ('r' in x) { const h = (n) => Math.round((n === undefined ? 1 : n) * 255).toString(16).padStart(2, '0'); return `#${h(x.r)}${h(x.g)}${h(x.b)}${x.a !== undefined && x.a < 1 ? ` at ${Math.round(x.a * 100)}%` : ''}` }
  if (x.easingFunctionCubicBezier) { const e = x.easingFunctionCubicBezier; return `cubic-bezier(${e.x1}, ${e.y1}, ${e.x2}, ${e.y2})` }
  return JSON.stringify(x)
}
const change = (isNew, key, label, have, want, write) => {
  if (isNew) { write(); return true }
  if (PLANNING) { diffs.push({ key, label, have: show(have), want: show(want) }); return false }
  if (keep.has(key)) { report.kept.push(`${label}: kept ${show(have)}; the set says ${show(want)}`); return false }
  write(); return true
}
// the window: every difference, ticked to update; unticked is kept
const review = (list) => new Promise(resolve => {
  if (typeof figma.showUI !== 'function') return resolve([])
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
  const rows = list.map((d, i) => `<label><input type=checkbox checked data-i=${i}> <b>${esc(d.label)}</b>: ${esc(d.have)} → ${esc(d.want)}</label>`).join('')
  figma.showUI(`<style>body{margin:0;height:100vh;display:flex;flex-direction:column;font:12px/1.5 ui-monospace,Menlo,monospace}header{display:flex;gap:8px;align-items:center;padding:8px;flex-wrap:wrap}main{flex:1;overflow:auto;padding:0 8px 8px}label{display:block;white-space:nowrap}p{margin:0;flex-basis:100%}</style><header><b>tokens: the file differs from the set in ${list.length} places</b><button id=all>Update all</button><button id=none>Keep all</button><button id=go>Apply</button><p>Ticked: the set's value is written. Unticked: the file's value is kept, reported, and listed again next run.</p></header><main>${rows}</main><script>const boxes=[...document.querySelectorAll('input')];document.getElementById('all').onclick=()=>boxes.forEach(b=>b.checked=true);document.getElementById('none').onclick=()=>boxes.forEach(b=>b.checked=false);document.getElementById('go').onclick=()=>{parent.postMessage({pluginMessage:{update:boxes.filter(b=>b.checked).map(b=>+b.dataset.i)}},'*')}</script>`, { width: 760, height: 560, title: 'tokens: review the differences' })
  figma.ui.onmessage = (m) => { if (m && Array.isArray(m.update)) { const on = new Set(m.update); resolve(list.filter((_, i) => !on.has(i)).map(d => d.key)) } }
})
// an orphan is today's row in a collection the new row cannot live in, so the new row
// is created and the old row's bindings move to it afterwards; a retirement is today's
// row the rename map cannot pair, given its successor by the owner, and moves the same way
const orphanPairs = []
const retiredPairs = []
const retiredStyles = []

const allVariables = await figma.variables.getLocalVariablesAsync()
const allCollections = await figma.variables.getLocalVariableCollectionsAsync()
// A duplicated variable carries its original's stamp, so two variables can claim one
// path; neither is trusted, and the row is reported instead of guessed at.
const byStamp = new Map()
const byName = new Map()
const duplicated = new Set()
for (const v of allVariables) {
  const s = stampOf(v, STAMP)
  if (s) { if (byStamp.has(s)) duplicated.add(s); else byStamp.set(s, v) }
  byName.set(v.name, v)
  byId.set(v.id, v)
}
for (const s of duplicated) { byStamp.delete(s); report.problems.push(`${s}: two variables carry this identity tag; left alone, keep one by hand`) }
const find = (path) => byStamp.get(path) || byName.get(path)
const collectionName = (v) => { const c = allCollections.find(x => x.id === v.variableCollectionId); return c ? c.name : 'another collection' }
// a row varies when its modes do not all hold one value
const varies = (v) => new Set(Object.values(v.valuesByMode).map(x => JSON.stringify(x))).size > 1
// Figma stores numbers as single-precision floats, so a value reads back a hair off what
// was written; a difference under a millionth is the same value
const near = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-6

async function applyVariables(P) {
  let c = allCollections.find(x => stampOf(x, COLLECTION_STAMP) === P.collection)
    || (P.today && allCollections.find(x => x.name === P.today))
    || allCollections.find(x => x.name === P.collection)
  if (!c) { c = figma.variables.createVariableCollection(P.collection); report.created.push(`collection ${P.collection}`) }
  if (c.name !== P.collection) { report.renamed.push(`collection ${c.name} -> ${P.collection}`); c.name = P.collection }
  stamp(c, COLLECTION_STAMP, P.collection)

  // modes: by name, by today's name, else the lone default mode for the first payload
  // mode, else added. Modes the payload does not name are left in place and reported.
  const modeIds = {}
  for (const [i, m] of P.modes.entries()) {
    let mode = c.modes.find(x => x.name === m) || (P.todayModes[m] && c.modes.find(x => x.name === P.todayModes[m]))
    if (!mode && i === 0 && c.modes.length === 1 && !P.modes.includes(c.modes[0].name)) mode = c.modes[0]
    if (!mode) { const id = c.addMode(m); mode = c.modes.find(x => x.modeId === id); report.created.push(`mode ${m}`) }
    if (mode.name !== m) { c.renameMode(mode.modeId, m); report.renamed.push(`mode ${mode.name} -> ${m}`) }
    modeIds[m] = mode.modeId
  }
  const extra = c.modes.filter(x => !P.modes.includes(x.name)).map(x => x.name)
  if (extra.length) report.problems.push(`modes left in place that the payload does not name: ${extra.join(', ')}`)

  // pass 1: find or create every variable, rename, stamp, describe, scope
  const inCollection = allVariables.filter(v => v.variableCollectionId === c.id)
  const targets = new Map()
  for (const spec of P.variables) {
    if (duplicated.has(spec.path)) continue
    // an external row belongs to another writer, the color engine's plugin: found by
    // name and stamped so aliases resolve, never created and never written
    if (spec.external) {
      const e = inCollection.find(x => x.name === spec.path)
      if (!e) { report.problems.push(`${spec.path}: an engine row that is not in the file; run the color engine's plugin first`); continue }
      if (e.resolvedType !== spec.type) { report.problems.push(`${spec.path}: is a ${e.resolvedType}, the engine's row is a ${spec.type}; left as it is`); continue }
      stamp(e, STAMP, spec.path); byStamp.set(spec.path, e); byName.set(spec.path, e)
      report.same++
      continue
    }
    let v = byStamp.get(spec.path)
    if (v && v.variableCollectionId !== c.id) { report.orphans.push(`${spec.path}: its tagged variable sits in another collection; a new one is created here, rebind by hand`); v = undefined }
    if (!v && spec.today) v = inCollection.find(x => x.name === spec.today)
    if (!v) v = inCollection.find(x => x.name === spec.path)
    // today's row in another collection is an orphan on every run until it is deleted
    // by hand, whether the new row is created now or was created by an earlier run, so
    // a run that stopped before the rebind pass is finished by the next one
    const orphan = spec.today ? allVariables.find(x => x.name === spec.today && x !== v && x.variableCollectionId !== c.id) : undefined
    // an old row that varies by its collection's modes cannot move to a row that does
    // not; whether that variation is wanted is a decision, so the row is left alone
    if (orphan && varies(orphan)) { report.problems.push(`${spec.path}: today's ${spec.today} sits in ${collectionName(orphan)} and varies by its modes; left alone: declare the row into that collection, or give it one value by hand and run again`); continue }
    // the stamp is the identity, so a hand rename is renamed back; but a name another
    // variable in this collection already holds cannot be taken, and Figma would throw
    // mid-run; the same name in another collection is an orphan or a stranger, not a block
    const holder = inCollection.find(x => x.name === spec.path)
    if (holder && holder !== v) { report.problems.push(`${spec.path}: the name is held by another variable (tagged ${stampOf(holder, STAMP) || 'nothing'}); left alone, resolve by hand`); continue }
    const isNew = !v
    if (!v) {
      v = figma.variables.createVariable(spec.path, c, spec.type)
      report.created.push(spec.path); fresh.add(spec.path); byId.set(v.id, v)
    } else if (v.resolvedType !== spec.type) {
      report.problems.push(`${spec.path}: is a ${v.resolvedType}, the payload wants ${spec.type}; left as it is`)
      continue
    }
    if (orphan && orphan.resolvedType === spec.type) { orphanPairs.push({ old: orphan, next: v }); report.orphans.push(`${spec.path}: today's ${spec.today} sits in ${collectionName(orphan)}; its bindings move to this row`) }
    else if (orphan) report.problems.push(`${spec.path}: today's ${spec.today} sits in ${collectionName(orphan)} as a ${orphan.resolvedType}, the payload wants ${spec.type}; the old one left alone`)
    if (v.name !== spec.path) change(isNew, `${spec.path}|name`, `${spec.path} name`, v.name, spec.path, () => { report.renamed.push(`${v.name} -> ${spec.path}`); v.name = spec.path })
    stamp(v, STAMP, spec.path)
    byStamp.set(spec.path, v); byName.set(spec.path, v)
    // scopes are a set: Figma keeps its own order, so a difference is what is added or removed
    if (spec.scopes) {
      const have = new Set(v.scopes), want = new Set(spec.scopes)
      const added = spec.scopes.filter(s => !have.has(s)), removed = v.scopes.filter(s => !want.has(s))
      if (added.length || removed.length) change(isNew, `${spec.path}|scopes`, `${spec.path} scopes`, v.scopes.join(', ') || 'none', [...added.map(s => '+ ' + s), ...removed.map(s => '− ' + s)].join(', '), () => { v.scopes = spec.scopes })
    }
    if (spec.description !== v.description) change(isNew, `${spec.path}|description`, `${spec.path} description`, v.description, spec.description, () => { v.description = spec.description })
    if (!!spec.hidden !== v.hiddenFromPublishing) change(isNew, `${spec.path}|hidden`, `${spec.path} hidden from publishing`, v.hiddenFromPublishing, !!spec.hidden, () => { v.hiddenFromPublishing = !!spec.hidden })
    targets.set(spec.path, v)
  }

  // pass 2: values, once every alias target can exist
  const sameValue = (have, want) => {
    if (have && typeof have === 'object' && have.type === 'VARIABLE_ALIAS') return !!want && want.type === 'VARIABLE_ALIAS' && have.id === want.id
    if (have && typeof have === 'object' && have.easingFunctionCubicBezier) {
      const a = have.easingFunctionCubicBezier, b = want && want.easingFunctionCubicBezier
      return !!b && ['x1', 'y1', 'x2', 'y2'].every(k => near(a[k], b[k]))
    }
    if (have && typeof have === 'object' && 'r' in have) return !!want && typeof want === 'object' && 'r' in want && ['r', 'g', 'b', 'a'].every(k => near(have[k] === undefined ? 1 : have[k], want[k] === undefined ? 1 : want[k]))
    return have === want || near(have, want)
  }
  for (const spec of P.variables) {
    const v = targets.get(spec.path)
    if (!v) continue
    let changed = false
    for (const m of P.modes) {
      const raw = spec.values[m]
      let want
      if (raw && typeof raw === 'object' && 'alias' in raw) {
        const target = find(raw.alias)
        if (!target) { report.problems.push(`${spec.path} (${m}): alias to ${raw.alias}, which does not exist`); continue }
        want = figma.variables.createVariableAlias(target)
      } else if (raw && typeof raw === 'object' && 'easing' in raw) {
        const [x1, y1, x2, y2] = raw.easing
        want = { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1, y1, x2, y2 } }
      } else if (raw && typeof raw === 'object' && 'color' in raw) {
        const h = raw.color.replace('#', '')
        want = { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: raw.alpha }
      } else {
        want = raw
      }
      let have
      try { have = v.valuesByMode[modeIds[m]] } catch (e) { report.problems.push(`${spec.path} (${m}): cannot read its value, left alone: ${e.message}`); continue }
      if (sameValue(have, want)) continue
      // a font family value re-renders every text style bound to it, which Figma allows
      // only with that family's fonts loaded
      if (!PLANNING && spec.type === 'STRING' && (spec.scopes || []).includes('FONT_FAMILY') && typeof want === 'string') {
        for (const f of (await figma.listAvailableFontsAsync()).filter(f => f.fontName.family === want)) {
          try { await figma.loadFontAsync(f.fontName) } catch (e) { report.problems.push(`${spec.path} (${m}): cannot load ${want} ${f.fontName.style}`) }
        }
      }
      change(fresh.has(spec.path), `${spec.path}|value|${m}`, `${spec.path} (${m})`, have, want, () => {
        try { v.setValueForMode(modeIds[m], want); changed = true } catch (e) { report.problems.push(`${spec.path} (${m}): ${e.message}`) }
      })
    }
    if (changed) report.updated.push(spec.path); else if (!PLANNING) report.same++
  }
}

async function applyTextStyles(P) {
  const styles = await figma.getLocalTextStylesAsync()
  for (const spec of P.styles) {
    let s = styles.find(x => stampOf(x, STAMP) === spec.path)
      || (spec.today && styles.find(x => x.name === spec.today))
      || styles.find(x => x.name === spec.name)
    try { await figma.loadFontAsync({ family: spec.family, style: spec.fontStyle }) }
    catch (e) { report.problems.push(`${spec.name}: cannot load ${spec.family} ${spec.fontStyle}; skipped`); continue }
    let changed = false
    const isNew = !s
    if (!s) { s = figma.createTextStyle(); report.created.push(spec.name); changed = true }
    if (s.name !== spec.name) change(isNew, `${spec.path}|name`, `text style ${spec.name} name`, s.name, spec.name, () => { if (!isNew) report.renamed.push(`${s.name} -> ${spec.name}`); s.name = spec.name; changed = true })
    if (s.description !== spec.description) change(isNew, `${spec.path}|description`, `text style ${spec.name} description`, s.description, spec.description, () => { s.description = spec.description; changed = true })
    // a bound property takes its value from the variable, so the raw value is set only
    // on the way to binding it; setting a raw value on a bound property would unbind it
    const raw = {
      fontFamily: () => { s.fontName = { family: spec.family, style: spec.fontStyle } },
      fontWeight: () => { s.fontName = { family: spec.family, style: spec.fontStyle } },
      fontSize: () => { s.fontSize = spec.fontSize },
      lineHeight: () => { s.lineHeight = { unit: 'PIXELS', value: spec.lineHeightPx } },
      letterSpacing: () => { s.letterSpacing = { unit: 'PIXELS', value: spec.letterSpacingPx } },
    }
    for (const [field, path] of Object.entries(spec.parts)) {
      const v = find(path)
      if (!v) { report.problems.push(`${spec.name}: no variable ${path} to bind ${field} to`); continue }
      const bound = (s.boundVariables || {})[field]
      if (bound && bound.id === v.id) continue
      // once family and weight are bound, the style's font is whatever those rows hold,
      // and it must be loaded before any other property is written
      if (!PLANNING && field !== 'fontFamily' && field !== 'fontWeight') {
        try { await figma.loadFontAsync(s.fontName) }
        catch (e) { report.problems.push(`${spec.name}: its bound family and weight resolve to ${s.fontName.family} ${s.fontName.style}, which cannot be loaded; ${field} left as it is`); continue }
      }
      change(isNew, `${spec.path}|${field}`, `text style ${spec.name} ${field}`, bound ? `bound to ${(byId.get(bound.id) || {}).name || bound.id}` : 'not bound', `bound to ${path}`, () => {
        try { raw[field](); s.setBoundVariable(field, v); changed = true } catch (e) { report.problems.push(`${spec.name}: binding ${field}: ${e.message}`) }
      })
    }
    if (stampOf(s, STAMP) !== spec.path) stamp(s, STAMP, spec.path)
    if (changed) report.updated.push(spec.name); else if (!PLANNING) report.same++
  }
}

// an effect style's layers are set as literals: a shadow's color cannot be bound through
// a pair, and nothing in a shadow varies by theme
async function applyEffectStyles(P) {
  const styles = await figma.getLocalEffectStylesAsync()
  const rgba = (hex, a) => { const h = hex.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a } }
  for (const spec of P.styles) {
    let s = styles.find(x => stampOf(x, STAMP) === spec.path)
      || (spec.today && styles.find(x => x.name === spec.today))
      || styles.find(x => x.name === spec.name)
    let changed = false
    const isNew = !s
    if (!s) { s = figma.createEffectStyle(); report.created.push(spec.name); changed = true }
    if (s.name !== spec.name) change(isNew, `${spec.path}|name`, `effect style ${spec.name} name`, s.name, spec.name, () => { if (!isNew) report.renamed.push(`${s.name} -> ${spec.name}`); s.name = spec.name; changed = true })
    if (s.description !== spec.description) change(isNew, `${spec.path}|description`, `effect style ${spec.name} description`, s.description, spec.description, () => { s.description = spec.description; changed = true })
    const want = spec.layers.map(l => ({ type: 'DROP_SHADOW', color: rgba(l.color, l.alpha), offset: { x: l.x, y: l.y }, radius: l.blur, spread: l.spread, visible: true, blendMode: 'NORMAL' }))
    const have = s.effects
    const same = have.length === want.length && have.every((e, i) => e.type === 'DROP_SHADOW' && near(e.offset.x, want[i].offset.x) && near(e.offset.y, want[i].offset.y)
      && near(e.radius, want[i].radius) && near(e.spread || 0, want[i].spread) && ['r', 'g', 'b', 'a'].every(k => near(e.color[k], want[i].color[k])))
    const layers = (list) => list.map(e => `${e.offset.x} ${e.offset.y} ${e.radius} ${e.spread || 0} ${show(e.color)}`).join('; ')
    if (!same) change(isNew, `${spec.path}|effects`, `effect style ${spec.name} layers`, layers(have), layers(want), () => { s.effects = want; changed = true })
    if (stampOf(s, STAMP) !== spec.path) stamp(s, STAMP, spec.path)
    if (changed) report.updated.push(spec.name); else if (!PLANNING) report.same++
  }
}

// An orphan's bindings move to its successor: every binding on every layer (a fill, a
// stroke, an effect, a layout grid, and every plain field: a radius, a width, a gap, a
// text layer's font), every binding on a local style, and every variable aliasing the
// old row, now point at the new one. The old row is left in place, to be deleted by
// hand once nothing refers to it. A component property bound to an old row, a layer
// whose fills are mixed and so cannot be read, and a layer that refuses the edit are
// reported for the hand, and the walk goes on: one layer never ends the run. A plugin
// walks every page; a script runner that cannot load pages walks the current one and
// says so.
async function rebind(pairs) {
  if (!pairs.length) return
  let scope = figma.currentPage
  try { await figma.loadAllPagesAsync(); scope = figma.root }
  catch (e) { report.problems.push(`rebind: only the current page was walked, this runtime cannot load every page; run the plugin for the whole file`) }
  const byOldId = new Map(pairs.map(p => [p.old.id, p]))
  const next = (alias) => alias && alias.type === 'VARIABLE_ALIAS' ? byOldId.get(alias.id) : undefined
  const mixed = []
  const byHand = []
  const fontsOf = async (node) => {
    try { for (const f of node.getRangeAllFontNames(0, node.characters.length)) await figma.loadFontAsync(f); return true }
    catch (e) { byHand.push(`${node.name}: its font cannot be loaded`); return false }
  }
  // a list whose entries carry their own binding (paints, effects, grids) is rebuilt
  const swapList = async (node, prop, setter) => {
    const list = node[prop]
    if (list === figma.mixed) { mixed.push(`${node.name} (${prop})`); return }
    if (!Array.isArray(list) || !list.some(x => Object.values(x.boundVariables || {}).some(next))) return
    if (node.type === 'TEXT' && !(await fontsOf(node))) return
    let count = 0
    const swapped = list.map(x => {
      let out = x
      for (const [field, alias] of Object.entries(x.boundVariables || {})) {
        const pair = next(alias)
        if (!pair) continue
        out = setter(out, field, pair.next)
        // a successor that is a pair carries its opacity onto the paint, composed here
        if (pair.opacity !== undefined && setter === paint) out = { ...out, opacity: pair.opacity }
        count++
      }
      return out
    })
    try { node[prop] = swapped; report.rebound += count }
    catch (e) { byHand.push(`${node.name}: ${prop}: ${e.message}`) }
  }
  const paint = (p, field, v) => figma.variables.setBoundVariableForPaint(p, field, v)
  const effect = (e, field, v) => figma.variables.setBoundVariableForEffect(e, field, v)
  const grid = (g, field, v) => figma.variables.setBoundVariableForLayoutGrid(g, field, v)
  // a window says where the walk is, and the walk yields between batches so Figma can
  // repaint; without that a long walk looks like a hang
  let progress = () => {}
  try {
    figma.showUI('<style>body{margin:0;padding:12px;font:12px/1.4 ui-monospace,Menlo,monospace}</style><pre id=p>starting</pre><script>onmessage=e=>{document.getElementById("p").textContent=e.data.pluginMessage.text}</script>', { width: 420, height: 100, title: 'tokens: rebinding' })
    progress = (text) => figma.ui.postMessage({ text })
  } catch (e) { /* a runtime without a UI */ }
  // the walk runs again until a pass moves nothing: editing an instance re-creates its
  // nested sublayers, which a walk that began earlier never saw
  for (let pass = 1; pass <= 4; pass++) {
  const before = report.rebound
  // only a layer with a binding can bind an old row; asking each layer whether it has
  // any is cheap, reading every layer's paints is not
  const bound = scope.findAll(n => { try { const b = n.boundVariables; return !!b && Object.keys(b).length > 0 } catch (e) { return false } })
  progress(`pass ${pass}: ${bound.length} bound layers to walk`)
  let visited = 0
  for (const node of bound) {
    if (++visited % 250 === 0) { progress(`pass ${pass}: ${visited} of ${bound.length} bound layers walked, ${report.rebound} bindings moved`); await new Promise(r => setTimeout(r, 0)) }
    // editing an instance re-creates its nested sublayers, so a reference taken when the
    // walk began can be gone by the time it is reached; such a layer is skipped, and its
    // name is read once, before any edit, so a failure can still be labelled
    let label = 'a layer that no longer exists'
    try { if (node.removed) continue; label = node.name } catch (e) { continue }
    try {
      if ('fills' in node) await swapList(node, 'fills', paint)
      if ('strokes' in node) await swapList(node, 'strokes', paint)
      if ('effects' in node) await swapList(node, 'effects', effect)
      if ('layoutGrids' in node) await swapList(node, 'layoutGrids', grid)
      for (const [field, alias] of Object.entries(node.boundVariables || {})) {
        if (['fills', 'strokes', 'effects', 'layoutGrids'].includes(field)) continue
        if (field === 'componentProperties') {
          for (const [prop, a] of Object.entries(alias || {})) { const pair = next(a); if (pair) byHand.push(`${node.name}: component property ${prop} binds ${pair.old.name}`) }
          continue
        }
        if (Array.isArray(alias)) { if (alias.some(next)) byHand.push(`${node.name}: ${field} binds an old row`); continue }
        const pair = next(alias)
        if (!pair) continue
        if (node.type === 'TEXT' && !(await fontsOf(node))) continue
        try { node.setBoundVariable(field, pair.next); report.rebound++ } catch (e) { byHand.push(`${node.name}: ${field}: ${e.message}`) }
      }
    } catch (e) { byHand.push(`${label}: ${e.message}`) }
  }
  if (report.rebound === before) break
  }
  for (const s of await figma.getLocalTextStylesAsync()) {
    for (const [field, alias] of Object.entries(s.boundVariables || {})) {
      const pair = next(alias)
      if (!pair) continue
      try { await figma.loadFontAsync(s.fontName); s.setBoundVariable(field, pair.next); report.rebound++ } catch (e) { byHand.push(`text style ${s.name}: ${field}: ${e.message}`) }
    }
  }
  for (const s of await figma.getLocalEffectStylesAsync()) await swapList(s, 'effects', effect)
  for (const s of await figma.getLocalPaintStylesAsync()) await swapList(s, 'paints', paint)
  for (const v of await figma.variables.getLocalVariablesAsync()) {
    for (const [modeId, val] of Object.entries(v.valuesByMode)) {
      const pair = next(val)
      if (!pair || v === pair.next) continue
      try { v.setValueForMode(modeId, figma.variables.createVariableAlias(pair.next)); report.rebound++ } catch (e) { byHand.push(`variable ${v.name}: ${e.message}`) }
    }
  }
  const mixedOnce = [...new Set(mixed)]
  if (mixedOnce.length) report.problems.push(`rebind: ${mixedOnce.length} layers have mixed fills or strokes, which cannot be read; if one binds an old row, rebind it by hand: ${mixedOnce.slice(0, 12).join(', ')}${mixedOnce.length > 12 ? ', ...' : ''}`)
  for (const h of new Set(byHand)) report.problems.push(`rebind: ${h}; rebound by hand`)
  for (const { old, next } of pairs) report.orphans.push(`${old.name}: its bindings now point at ${next.name}; delete it by hand once nothing refers to it`)
}

// Today's text styles given a successor: every layer set to the old style is set to the
// new one, mixed text by its runs, and the old style is left for the delete command.
async function restyle(map) {
  if (!map.length) return
  try { await figma.loadAllPagesAsync() } catch (e) { /* already loaded, or a runtime that cannot */ }
  const byOld = new Map(map.map(m => [m.old.id, m]))
  const byHand = []
  const fontsFor = async (node, style) => {
    try { for (const f of node.getRangeAllFontNames(0, node.characters.length)) await figma.loadFontAsync(f); await figma.loadFontAsync(style.fontName); return true }
    catch (e) { byHand.push(`${node.name}: its font cannot be loaded`); return false }
  }
  for (const node of figma.root.findAll(n => n.type === 'TEXT')) {
    let label = 'a layer that no longer exists'
    try { if (node.removed) continue; label = node.name } catch (e) { continue }
    try {
      if (node.textStyleId === figma.mixed) {
        for (const seg of node.getStyledTextSegments(['textStyleId'])) {
          const m = byOld.get(seg.textStyleId)
          if (!m) continue
          if (!(await fontsFor(node, m.next))) break
          await node.setRangeTextStyleIdAsync(seg.start, seg.end, m.next.id); report.restyled++
        }
      } else {
        const m = byOld.get(node.textStyleId)
        if (!m) continue
        if (!(await fontsFor(node, m.next))) continue
        await node.setTextStyleIdAsync(m.next.id); report.restyled++
      }
    } catch (e) { byHand.push(`${label}: ${e.message}`) }
  }
  for (const h of new Set(byHand)) report.problems.push(`restyle: ${h}; restyled by hand`)
  for (const { old, next } of map) report.orphans.push(`text style ${old.name}: its layers now use ${next.name}; delete it once nothing refers to it`)
}

// The retirements payload: today's rows and styles the owner gave a successor. The old
// is found by name, untagged; the new by its tag, which every row has by now.
async function applyRetirements(P) {
  const textStyles = await figma.getLocalTextStylesAsync()
  for (const r of P.variables) {
    const old = allVariables.find(x => x.name === r.today && !stampOf(x, STAMP))
    const next = byStamp.get(r.path)
    if (!old) continue
    if (!next) { report.problems.push(`retire ${r.today}: ${r.path} is not in the file; left alone`); continue }
    if (old.resolvedType !== next.resolvedType) { report.problems.push(`retire ${r.today}: it is a ${old.resolvedType}, ${r.path} a ${next.resolvedType}; left alone`); continue }
    retiredPairs.push({ old, next, opacity: r.opacity })
  }
  for (const r of P.styles) {
    const old = textStyles.find(s => s.name === r.today && !stampOf(s, STAMP))
    const next = textStyles.find(s => stampOf(s, STAMP) === r.path)
    if (!old) continue
    if (!next) { report.problems.push(`retire ${r.today}: ${r.path} is not in the file; left alone`); continue }
    retiredStyles.push({ old, next })
  }
}

if (!PAYLOAD) throw new Error('no payload inlined')
const payloads = Array.isArray(PAYLOAD) ? PAYLOAD : [PAYLOAD]
const pass = async () => {
  for (const P of payloads) {
    if (P.kind === 'variables') await applyVariables(P)
    else if (P.kind === 'text-styles') await applyTextStyles(P)
    else if (P.kind === 'effect-styles') await applyEffectStyles(P)
    else if (P.kind === 'retirements') await applyRetirements(P)
    else throw new Error(`unknown payload kind ${P.kind}`)
  }
}
// the first pass creates and lists; the owner chooses; the second pass writes
PLANNING = true
await pass()
PLANNING = false
if (diffs.length) for (const k of await review(diffs)) keep.add(k)
report.same = 0; orphanPairs.length = 0; retiredPairs.length = 0; retiredStyles.length = 0
await pass()
for (const k of ['created', 'renamed', 'updated', 'orphans', 'problems']) report[k] = [...new Set(report[k])]
await rebind([...orphanPairs, ...retiredPairs])
await restyle(retiredStyles)
return report
