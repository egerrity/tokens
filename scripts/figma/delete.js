// Deletes what the leftovers walk found nothing referring to: untagged variables and
// styles with no use in this file, chosen in the window and deleted on a click, never
// before. A collection whose every row went this way goes with them. It never touches a
// tagged row, so never one the set or the engine owns, and never a row with a use. What
// "nothing refers to it" cannot see is another file: on a published library, a consumer
// file's bindings are invisible from here, so there this command comes after the
// consumer audit, not before. The return value is what was deleted and what refused.
const remove = async (chosen) => {
  const report = { deleted: [], refused: [] }
  const emptied = new Set()
  for (const c of chosen) {
    try {
      const n = c.kind === 'variable' ? await figma.variables.getVariableByIdAsync(c.id) : await figma.getStyleByIdAsync(c.id)
      if (!n) { report.refused.push(`${c.where}: ${c.name}: no longer exists`); continue }
      if (c.kind === 'variable') emptied.add(n.variableCollectionId)
      n.remove()
      report.deleted.push(`${c.where}: ${c.name}`)
    } catch (e) { report.refused.push(`${c.where}: ${c.name}: ${e.message}`) }
  }
  // a collection emptied by this command has nothing left to hold
  for (const col of await figma.variables.getLocalVariableCollectionsAsync()) {
    if (!emptied.has(col.id) || col.variableIds.length) continue
    try { col.remove(); report.deleted.push(`collection ${col.name}`) } catch (e) { report.refused.push(`collection ${col.name}: ${e.message}`) }
  }
  return report
}
