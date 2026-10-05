// The page per group: what a designer decides, what the generator derives, and the
// tokens that result. Rendered from the roster, so a page cannot describe a token the
// files do not hold.
import { figmaName, type TokenPath } from '../grammar/path.ts'
import type { Category } from '../grammar/words.ts'
import { isAlias, valueIn, type Token, type Value } from './types.ts'

type Notes = { title: string; declaration: string; decided: string[]; derived: string[] }

const NOTES: Record<Category, Notes> = {
  space: {
    title: 'Space',
    declaration: 'declarations/space.ts',
    decided: [
      'The scale: the list of steps, in px.',
      'Which steps get a negative.',
      'Each semantic row: a gap or a padding, where it applies, its density, the step it uses and the cases it covers.',
      'The words that say where a semantic row applies.',
    ],
    derived: [
      'Each step\'s name, from the base unit.',
      'Each negative step, as the mirror of its positive step.',
      'Each semantic token\'s reference to its step.',
      'Every description.',
    ],
  },
  size: {
    title: 'Size',
    declaration: 'declarations/size.ts',
    decided: [
      'The scale: the list of steps, in px.',
      'The icon sizes, the control heights and the illustration sizes, each a size word with a px value; a value on the scale references its step, one above it holds its value.',
      'The measure, the longest line of running text, which sits above the scale and holds its own value.',
    ],
    derived: ['Each step\'s name, from the base unit.', 'Each semantic token\'s reference to its step.', 'Every description.'],
  },
  radius: {
    title: 'Radius',
    declaration: 'declarations/radius.ts',
    decided: ['The steps, in px, each with what it is for.', 'The value that stands for fully rounded.'],
    derived: ['Each step\'s name, from the base unit.', 'Every description.'],
  },
  'border-width': {
    title: 'Border width',
    declaration: 'declarations/border-width.ts',
    decided: ['The steps, in px.'],
    derived: ['Each step\'s name, from the base unit.', 'Every description.'],
  },
  opacity: {
    title: 'Opacity',
    declaration: 'declarations/opacity.ts',
    decided: ['The scale: the list of steps, in percent.', 'The disabled opacity.'],
    derived: ['Each step\'s name, which is its percent.', 'Every description.'],
  },
  motion: {
    title: 'Motion',
    declaration: 'declarations/motion.ts',
    decided: [
      'The easing curves, each with what it is for.',
      'The durations, in ms, each with what it is for, and the bounds no duration may leave.',
      'Each transition: one easing with one duration.',
    ],
    derived: ['Each duration\'s name, which is its milliseconds.', 'Each transition\'s references to its easing and its duration.', 'Every description.'],
  },
  breakpoint: {
    title: 'Breakpoints',
    declaration: 'declarations/breakpoint.ts',
    decided: ['The minimum widths, in px, each under a size word, with what starts there.'],
    derived: ['The order, which follows the size words.', 'Every description.'],
  },
  grid: {
    title: 'Grid',
    declaration: 'declarations/grid.ts',
    decided: ['The column count per viewport.', 'The margin and the gutter per viewport, as px on the space scale.', 'The width at which page content stops growing, per viewport.'],
    derived: ['Each margin and gutter as a reference to its space step, per viewport.', 'Every description.'],
  },
  font: {
    title: 'Font',
    declaration: 'declarations/font.ts',
    decided: [
      'The families, each as the names a renderer tries in order.',
      'The weights.',
      'The size scale, in px.',
      'The line heights, as multiples of the font size.',
    ],
    derived: ['Each size step\'s name, from the base unit; each line height\'s name, from the multiple.', 'Every description.'],
  },
  text: {
    title: 'Text styles',
    declaration: 'declarations/text.ts',
    decided: [
      'What each role is for.',
      'Each style: its role and size, family, weight, line height, letter spacing in percent, and its font size per viewport.',
    ],
    derived: [
      'Each style as a composite whose family, size, weight and line height reference the font scale.',
      'The font size of a viewport that declares none, from its fallback.',
      'Letter spacing as a length, from the percent and the size at each viewport.',
      'Every description.',
    ],
  },
}

export const pageName = (category: Category): string => `${category}.md`

export function page(category: Category, tokens: Token[], all: Token[]): string {
  const byPath = new Map(all.map(t => [figmaName(t.path), t]))
  const ref = (p: TokenPath) => `\`${figmaName(p)}\``
  const literal = (v: Value, context?: string): string => {
    if (isAlias(v)) {
      const target = byPath.get(figmaName(v.alias))
      return target ? `${ref(v.alias)} (${literal(valueIn(target, context), context)})` : ref(v.alias)
    }
    switch (v.type) {
      case 'dimension': case 'duration': return `${v.value.value} ${v.value.unit}`
      case 'number': case 'fontWeight': return String(v.value)
      case 'cubicBezier': return v.value.join(', ')
      case 'fontFamily': return v.value.join(', ')
      case 'transition': return `${ref(v.value.timingFunction)} over ${ref(v.value.duration)}`
      case 'typography': {
        const t = v.value
        return `${ref(t.fontFamily)} ${ref(t.fontWeight)}, ${ref(t.fontSize)} (${literal(valueIn(byPath.get(figmaName(t.fontSize))!, context), context)}), line height ${ref(t.lineHeight)}, letter spacing ${t.letterSpacing.value} px`
      }
    }
  }
  // a value per context, with contexts that share a value folded together
  const shown = (t: Token): string => {
    if (!t.byContext) return literal(t.value)
    const groups = new Map<string, string[]>()
    for (const [context, v] of Object.entries(t.byContext)) {
      const text = literal(v, context)
      groups.set(text, [...(groups.get(text) ?? []), context])
    }
    return [...groups].map(([text, contexts]) => `${text} (${contexts.join(', ')})`).join('; ')
  }
  const n = NOTES[category]
  const row = (t: Token) => `| \`${figmaName(t.path)}\` | ${shown(t)} | ${t.req} |`
  return [
    `# ${n.title}`,
    '',
    `Generated from \`${n.declaration}\`. To change anything here, edit the declaration and run \`npm run generate\`.`,
    '',
    '## Decided',
    '',
    ...n.decided.map(l => `- ${l}`),
    '',
    '## Derived',
    '',
    ...n.derived.map(l => `- ${l}`),
    '',
    '## Tokens',
    '',
    '| Token | Value | Required for |',
    '| --- | --- | --- |',
    ...tokens.map(row),
    '',
  ].join('\n')
}
