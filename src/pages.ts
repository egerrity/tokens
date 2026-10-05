// The page per group: what a designer decides, what the generator derives, and the
// tokens that result. Rendered from the roster, so a page cannot describe a token the
// files do not hold.
import { figmaName, type TokenPath } from '../grammar/path.ts'
import type { Category } from '../grammar/words.ts'
import { isAlias, type Token } from './types.ts'

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
      'The icon sizes and the control heights, each a size word and a step.',
      'The content widths, which sit above the scale and hold their own value.',
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
}

export const pageName = (category: Category): string => `${category}.md`

export function page(category: Category, tokens: Token[], all: Token[]): string {
  const byPath = new Map(all.map(t => [figmaName(t.path), t]))
  const literal = (t: Token): string => {
    if (isAlias(t)) {
      const target = byPath.get(figmaName(t.alias))
      return target ? `\`${figmaName(t.alias)}\` (${literal(target)})` : `\`${figmaName(t.alias)}\``
    }
    if (t.type === 'dimension' || t.type === 'duration') return `${t.value.value} ${t.value.unit}`
    if (t.type === 'number') return String(t.value)
    if (t.type === 'cubicBezier') return t.value.join(', ')
    const ref = (p: TokenPath) => `\`${figmaName(p)}\``
    return `${ref(t.value.timingFunction)} over ${ref(t.value.duration)}`
  }
  const n = NOTES[category]
  const row = (t: Token) => `| \`${figmaName(t.path)}\` | ${literal(t)} | ${t.req} |`
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
