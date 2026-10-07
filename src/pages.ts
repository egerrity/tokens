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
  color: {
    title: 'Color roles',
    declaration: 'declarations/color.ts, with the opacity steps in declarations/opacity.ts',
    decided: [
      'Each property\'s ladder: which engine stop every emphasis word names, with what the row is for, and which words the neutral and the families are offered.',
      'Whose highlighter draws the focus ring.',
      'The two illustration pair opacities.',
    ],
    derived: [
      'Every row as an alias to an engine primitive: the same word on the same stop in the neutral and in every family.',
      'The interaction levels per family: ghost and soft on the highlighter at the level\'s opacities, solid on the engine\'s stamp with its edge and on-text.',
      'The surfaces per theme context, in the engine\'s plane order.',
      'Each translucent row\'s pair, the opacity it is composed with.',
    ],
  },
  shadow: {
    title: 'Shadow',
    declaration: 'declarations/shadow.ts',
    decided: ['Each level, named for what sits at that height: its layers, as offsets, blur and spread in px and black at a percent, the same in both themes.'],
    derived: ['Each level as a shadow composite, and as an effect style in Figma with its values set in place.', 'Every description.'],
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

export function page(category: Category, tokens: Token[], all: Token[], outside: Token[] = []): string {
  const byPath = new Map([...outside, ...all].map(t => [figmaName(t.path), t]))
  const ref = (p: TokenPath) => `\`${figmaName(p)}\``
  const literal = (v: Value, context?: string): string => {
    if (isAlias(v)) {
      const target = byPath.get(figmaName(v.alias))
      return target ? `${ref(v.alias)} (${literal(valueIn(target, context), context)})` : ref(v.alias)
    }
    switch (v.type) {
      case 'dimension': case 'duration': return `${v.value.value} ${v.value.unit}`
      case 'color': return v.value.alpha === 1 ? v.value.hex : `${v.value.hex} at ${Math.round(v.value.alpha * 100)} percent`
      case 'number': case 'fontWeight': return String(v.value)
      case 'cubicBezier': return v.value.join(', ')
      case 'fontFamily': return v.value.join(', ')
      case 'transition': return `${ref(v.value.timingFunction)} over ${ref(v.value.duration)}`
      case 'typography': {
        const t = v.value
        return `${ref(t.fontFamily)} ${ref(t.fontWeight)}, ${ref(t.fontSize)} (${literal(valueIn(byPath.get(figmaName(t.fontSize))!, context), context)}), line height ${ref(t.lineHeight)}, letter spacing ${t.letterSpacing.value} px`
      }
      case 'shadow': return v.value.map(l => `${l.offsetX.value} ${l.offsetY.value} ${l.blur.value} ${l.spread.value} px, black at ${Math.round(l.color.alpha * 100)} percent`).join('; ')
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
  const row = (t: Token) => `| \`${figmaName(t.path)}\` | ${shown(t)}${t.pair ? ` with \`${figmaName(t.pair)}\`` : ''} | ${t.req}${t.reserved ? ' (reserved for components)' : ''} |`
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

/**
 * The checklist after a Figma run: what the apply script leaves to a person, in order,
 * with the translucent pairs listed as the set orders them, each with its alias and the
 * percent to set. Generated so the list is exactly the pairs the set has.
 */
export function handWorkPage(tokens: Token[], outside: Token[] = []): string {
  const byPath = new Map([...outside, ...tokens].map(t => [figmaName(t.path), t]))
  const pairs = tokens.filter(t => t.pair)
  // an opacity token aliases a step of the scale, so the percent is read through the chain
  const percent = (p: TokenPath): number => {
    let v = byPath.get(figmaName(p))?.value
    for (let hops = 0; v && isAlias(v) && hops < 8; hops++) v = byPath.get(figmaName(v.alias))?.value
    if (!v || isAlias(v) || v.type !== 'number') throw new Error(`${figmaName(p)}: an opacity that does not resolve to a number`)
    return Math.round(v.value * 100)
  }
  // a pair's base is an alias, or a literal where the engine owns no row for it (the
  // scrim's black)
  const base = (t: Token): string => {
    if (isAlias(t.value)) return `\`${figmaName(t.value.alias)}\``
    if (t.value.type === 'color') return t.value.value.hex
    throw new Error(`${figmaName(t.path)}: a pair whose base is neither an alias nor a color`)
  }
  const row = (t: Token) => `| \`${figmaName(t.path)}\` | ${base(t)} | \`${figmaName(t.pair!)}\` | ${percent(t.pair!)} |`
  return [
    '# The hand work after a run',
    '',
    'Generated with the rest of the set. The apply script never deletes and never guesses, so',
    'what follows is a person\'s, in this order, in a copy first and in the real file after.',
    'What is specific to one file (which rows have no successor, which modes go, what to',
    'decide first) is in `dry-run.md`.',
    '',
    '## 1. Read the report',
    '',
    'The run ends in a window with the report; Copy takes it. `problems` first: each line is',
    'a row the script left alone and says why. Then `orphans`, `created` and `renamed`',
    'against what the run was expected to do.',
    '',
    '## 2. List the leftovers',
    '',
    'Run the plugin\'s second command, List the leftovers. After a run every row the set',
    'owns and every engine row it found carries a stamp, so an unstamped variable, text',
    'style or effect style is a leftover, whatever its name. The list gives each with where',
    'it lives and every layer, style and variable that refers to it.',
    '',
    '- Under "Nothing refers to these": delete them.',
    '- Under "Still referred to": open each use listed, bind it to the row\'s successor (the',
    '  role map in `color-role-map.md` names it), then delete the row. A row that has to',
    '  stay for now is marked deprecated instead.',
    '- Under "Collections with no stamped row": delete the collection once its rows are gone.',
    '',
    'Run the list again: it is empty but for what was kept on purpose.',
    '',
    `## 3. Compose the ${pairs.length} pairs`,
    '',
    'A translucent row is its alias at an opacity, set in the variables panel: open the row,',
    'keep the alias, set the opacity to the percent. The script writes the alias and leaves',
    'the opacity to the panel, which the API cannot read or write; a composed row reads back',
    'as its alias, so later runs leave it alone. In the order the set lists them:',
    '',
    '| Row | Alias | Opacity token | Percent |',
    '| --- | --- | --- | --- |',
    ...pairs.map(row),
    '',
    '## 4. Verify',
    '',
    '- Run Apply the set again: the report counts only `same`.',
    '- A component that bound an old row shows the same color under the new name.',
    '- The text styles show their family, bound; the effect styles their layers.',
    '- Reserved rows do not appear in a consuming file\'s picker.',
    '',
  ].join('\n')
}
