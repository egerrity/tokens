// The five slots by layer: for each slot, what the slot holds in each layer and what
// fills it today, read from the shapes every path matches. The rules for the slots are
// prose in the grammar; this page is the only record of their contents, so the two
// cannot disagree about what exists.
import { figmaName, slotsOf, type TokenPath } from '../grammar/path.ts'
import { SLOTS, isStep, type Slot } from '../grammar/words.ts'
import type { Token } from './types.ts'

type SlotName = (typeof SLOTS)[number]
type Filled = { layer: string; category: string; slot: SlotName; word: string }

const LAYERS = ['base', 'semantic', 'component'] as const

// what each slot holds in each layer: the rule, in the words the grammar uses
const HOLDS: Record<SlotName, Record<(typeof LAYERS)[number], string>> = {
  category: { base: 'The kind of value, in the everyday word.', semantic: 'The kind of value, in the everyday word.', component: 'The component’s name, in the category’s place.' },
  property: { base: 'Which scale.', semantic: 'Which purpose.', component: 'Always: the property the component sets.' },
  family: { base: 'Which member: the same scale for each, built by one rule.', semantic: 'Which member: the same roles for each.', component: 'As in the semantic layer.' },
  variant: { base: 'Never: a base token narrows by position alone.', semantic: 'Which kind: where it applies (control, content, layout), the level (ghost, soft, solid), the text role (heading, body), the ground it sits on (on-inverse).', component: 'As in the semantic layer.' },
  specifier: { base: 'A position: a step of three or more digits, or a named place on the scale.', semantic: 'A state, a size, a density, an emphasis word, or a name from the group’s own list.', component: 'A state, with the default spelled; a name where the component has no states.' },
}

// the engine's color base tokens are not in our shapes: each is a family and one position word; ours (`transparent`) is
const engineSlots = (path: TokenPath): readonly Slot[] | undefined =>
  path[0] === 'color' && path.length === 3 ? ['family', 'specifier'] : undefined

function filled(tokens: Token[], outside: Token[]): Filled[] {
  const out: Filled[] = []
  const add = (t: Token, slots: readonly Slot[] | undefined) => {
    if (!slots) throw new Error(`${figmaName(t.path)}: matches no shape, so its slots are unknown`)
    out.push({ layer: t.layer, category: t.path[0], slot: 'category', word: t.path[0] })
    slots.forEach((slot, i) => out.push({ layer: t.layer, category: t.path[0], slot, word: t.path[i + 1] }))
  }
  for (const t of tokens) add(t, slotsOf(t.path))
  for (const t of outside) add(t, engineSlots(t.path))
  return out
}

// a scale of steps reads as one entry rather than twenty
const shown = (word: string): string => (isStep(word) ? 'a step' : `\`${word}\``)

/** what fills a slot in a layer today, by category, as one cell */
function today(rows: Filled[], layer: string, slot: SlotName): string {
  const byCategory = new Map<string, Set<string>>()
  for (const r of rows) if (r.layer === layer && r.slot === slot) byCategory.set(r.category, (byCategory.get(r.category) ?? new Set()).add(shown(r.word)))
  if (!byCategory.size) return layer === 'component' ? 'none yet' : 'none'
  if (slot === 'category') return [...byCategory.keys()].map(c => `\`${c}\``).join(', ')
  return [...byCategory].map(([c, words]) => `\`${c}\`: ${[...words].join(', ')}`).join(' · ')
}

export function slotsPage(tokens: Token[], outside: Token[] = []): string {
  const rows = filled(tokens, outside)
  const lines: string[] = [
    '# The five slots, by layer',
    '',
    'Generated with the rest of the set. For each slot: what it holds in each layer, in the',
    'grammar\'s words, and what fills it today, read from the shapes every path matches. The',
    'rules for the slots are in `grammar.md`. The color base tokens are read as a family and one position word;',
    'their words are the engine\'s, not a shape of ours, except `transparent`, the one color base token of',
    'ours, a named position with no scale.',
    '',
  ]
  for (const slot of SLOTS) {
    lines.push(`## ${slot}`, '', '| Layer | Holds | Today |', '| --- | --- | --- |')
    for (const layer of LAYERS) lines.push(`| ${layer[0].toUpperCase()}${layer.slice(1)} | ${HOLDS[slot][layer]} | ${today(rows, layer, slot)} |`)
    lines.push('')
  }
  return lines.join('\n')
}
