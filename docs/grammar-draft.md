# Token naming grammar

Signed off by the owner on 2026-10-05, pending the team's review. It joins three inputs: the v1 naming proposal, the pattern the
"Design token naming compared" guide recommends for a team starting fresh (Polaris), and
the shape the color engine's token file already has.

## The rule

A token has one path, made of segments. Every spelling comes from the path:

| Where | How the path is joined | Example |
| --- | --- | --- |
| Token file (Design Tokens format) | nested groups; a reference joins with dots | `{space.400}` |
| Figma variable | slashes | `space/400` |
| CSS custom property | the prefix, then hyphens | `--ds-space-400` |

Nothing spells a name by hand. `ds` stands in for the real prefix throughout.

A path is unique across the whole system, whichever file or Figma collection holds it, so
the name alone identifies a token in code.

## Segments

- Lower-case letters and digits. Words inside one segment join with a hyphen
  (`line-height`, `on-inverse`). No capitals, so no two names differ only by case. Whole
  words, not abbreviations (`negative`, not `neg`), with two words of the system admitted
  as they are: `fg` and `bg`.
- Order: category, then property, then variant, then state. A component token puts the
  component first. State is always last.
- A path is a token or a group, never both. So a default is spelled out, not left bare:
  `space/gap/content/normal` beside `space/gap/content/condensed`, and `…/enabled` beside
  `…/hover`.
- Each segment draws from a closed word list, kept in the generator's declaration. A word
  not on the list fails the build.

## Three layers, told apart by shape

| Layer | Shape | Examples |
| --- | --- | --- |
| Base: a value on a scale, named for its position | category, a property where the category has one, then a position: a step or a named place on the scale | `space/400`, `radius/full`, `font/weight/medium`, `color/brand/paper-1` |
| Semantic: a value named for its purpose | category, property, the family where the role has one, the variant, then the final word: a state, a size, a density or a name | `size/icon/sm`, `space/gap/content/condensed`, `color/bg/positive/solid/enabled` |
| Component: a value only one component needs | component, property, family, variant, state | none yet |

One column is one segment. A base ends in a position; a state as a segment of its
own belongs only to the semantic and component layers. The engine's rows are base tokens
spelled by the engine, a family and one word, and the word is a position too: a band at
a lightness (`pen-70`) or the stamp at a step (`stamp-1`).

The layer is not a segment of the name. It is recorded for every token in the
declaration, so tools can read it without parsing names.

## The five slots

A path is read left to right as category, property, family, variant, leaf. Every token
has a category and a leaf; the three middle slots appear where the category or the layer
needs them. What each slot holds today is an audit of every path in the system, the
color engine's included (507: 212 base tokens, of which 122 are the engine's, and 295
semantic).

| Slot | Base | Semantic | Component |
| --- | --- | --- | --- |
| category | always | always | the component's name takes its place |
| property | only where the category has several scales (`font`, `motion`) | usual; absent in `opacity`, `text`, `grid`, `shadow` | always |
| family | `color` only | `color` only | `color` roles only |
| variant | `negative` only | where, level, role, kind, posture | yes |
| leaf | a position | a state, a size, a density, a word, or a name | a state |

### Category

The first segment: the kind of value, in the everyday word a designer would look for.
A category is the root of a group in the token file and of a folder in Figma.

- Holds today: `space`, `size`, `radius`, `border-width`, `opacity`, `motion`,
  `breakpoint`, `grid`, `font`, `text`, `shadow`, `color`. Base tokens live in nine of
  them (the color base tokens are the engine's), semantic tokens in eight.
- Parent: none in the name. A collection is a container, not a parent: a category can
  span collections (`space` steps sit in `scale`, the semantic gaps in `viewport`), and
  a collection never takes a category's word.
- Do: add a category only for a new kind of value with its own scale or its own word
  list (a blur, a z-order), named as a designer says it, lower-case, hyphenated if two
  words; register it with its shapes in `grammar/words.ts`, which is the only place a
  word enters the system.
- Don't: a category for a data type (`dimension`), a layer (`base`), a context
  (`dark`, `mobile`), a collection (`scale`), a component (that is the component layer,
  whose first segment is the component's name), or a synonym of one that exists
  (`spacing`).

### Property

The aspect of the category that the token sets: a kind within the category that has
its own scale or its own list of words. Where a category has one aspect, the property
is omitted and the category stands for it (`space/400`, `radius/full`).

- Holds today. Base: `font/family|weight|size|line-height`,
  `motion/easing|duration`. Semantic: `space/gap|padding`, `size/icon|control|illustration`,
  `motion/transition`, `color/fg|bg|border|surface|plane|illustration`.
- Parent: the category. A property appears only when the category has more than one
  aspect, and then every token of that aspect carries it.
- Do: name the aspect as a noun (`gap`, `weight`, `fg`); add one when a category gains a
  second aspect with its own ladder or list; keep one property per path.
- Don't: a state, a size, a density or a level as a property (those are a leaf or a
  variant); a property for a single value, which is a leaf instead (`size/measure`);
  a second property under the first.

### Family

A color family: a hue role the engine solves per seed. Color only. In a role the family
follows the property (`fg/brand/accent`); in a base it follows the category
(`color/brand/pen-70`), since color has no property at that layer. The neutral is
implied by its absence.

- Holds today. Semantic: `brand`, `brand-alt`, `critical`, `warning`, `positive`,
  `info`. Base: the same six, plus `neutral` spelled (a base has no property
  for an absence to hang off), `link`, and `absolute` for the two seed records.
- Parent: the property in a role; the category in a base. Every family carries the
  same words per property, and a word a family lacks a stop for does not exist for it.
- Do: add a family when the engine emits one, and only then; give it the same word
  lists as the others, with offered and reserved as the only difference.
- Don't: a family right after `color` in a semantic row, since a family in that place
  is what marks a base; a one-off hue outside the engine; a word in one family
  that the others lack.

### Variant

A qualifier that narrows which one, within a property or a category, that is neither a
state nor a position. Each variant is one closed list, one axis per segment.

- Holds today. Base: `negative` (`space`), the only one. Semantic: where
  (`control`, `content`, `layout`, `card`, `container`), kind (`spot`, `hero`), level
  (`ghost`, `soft`, `solid`), role (`display`, `heading`, `title`, `body`, `link`,
  `tabular-number`, `button`, `code`), posture (`on-inverse`, `link`).
- Parent: the property, or the category where there is no property (`text/heading`,
  `opacity/soft`). Two variants may stack when each is its own axis, posture before
  role (`fg/on-inverse/link/hover`); three tokens do, and none stacks further.
- Do: a closed list per axis; the same axis in the same place everywhere; a variant
  where there is a choice among kinds, not among values.
- Don't: a state or a size as a variant (those are the leaf); a variant that exists
  for one token; a variant on a base, whose only qualifier is the sign of its scale.

### Leaf

The last segment: what tells a token from its siblings. Everything before it is the
group the token belongs to, and a path is a token or a group, never both, so a default
is spelled (`normal`, `enabled`, `regular`) rather than left bare. The leaf's kind is
what the layers differ on.

- Base: a position on the scale. A step of three or more digits (`400`, `016`,
  `080`) or a named place on the scale (`full`, `enter`, `sans`, `medium`,
  `breakpoint/md`; in color, a band at a lightness, `pen-70`, or the stamp or a link
  at a step, `stamp-1`, `default-2`).
- Semantic: a state (`enabled`, `hover`, `pressed`, `selected`), a size (`xs` to `lg`),
  a density (`condensed`, `normal`, `spacious`), an emphasis word (`regular`, `accent`,
  `hint`, `muted`, `strong`), or a name from the group's own list (`high`, `scrim`,
  `focus`, `raised`, `open`, `gutter`, `measure`, `disabled`, `on-solid`).
- Component: a state, with the default spelled.
- Parent and siblings: a group's token leaves come from one list. A word's meaning is
  fixed by its group: `regular` under `font/weight` is a weight, under `fg` an emphasis.
- Do: take the leaf from the list its group uses; spell the default; digits only for a
  step, three or more.
- Don't: a state on a base, which names its steps inside the position word
  instead (`stamp-1`); a synonym beside an existing word (`subtle` next to `muted`); a
  leaf that is a group elsewhere; a number under three digits.

## Scales

- A dimension step is a number: the base unit is 4 px, and the step is the number of
  base units times 100, at least three digits. So 2 px is `050`, 4 px is `100`, 10 px is
  `250`, 16 px is `400`. This is the rule the current space, size, radius and border
  width variables already follow; their step numbers do not change.
- A step on a scale that is not a dimension is the value itself, three digits: an opacity
  step is the percent (`opacity-016`), a duration step is the milliseconds
  (`motion-duration-080`).
- Negative space is a sub-group of space, `space/negative/400`. Each negative step is
  generated from the positive step of the same number, so the two cannot drift.
- Named sizes (`2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`) are for semantic tokens only:
  text styles, icon sizes, control heights. They are the size words the component
  property glossary already uses.
- Breakpoints are the one scale named by size word (`breakpoint/sm` to `breakpoint/2xl`),
  because those are the keys the styling framework gives them.
- Semantic space uses density words, `condensed`, `normal`, `spacious`, never size
  words, so a gap is not mistaken for a component size.

## Categories

| Category | Holds |
| --- | --- |
| `space` | the spacing scale, its negative steps, and the semantic gaps and paddings |
| `size` | the sizing scale, and semantic sizes such as icons, control heights and the measure |
| `radius` | corner radius |
| `border-width` | border and outline widths |
| `font` | the type scales: `font-size`, `font-weight`, `font-family`, `font-line-height`, `font-letter-spacing` |
| `text` | text styles by role and size, each built from the `font` scales |
| `motion` | `motion-duration`, `motion-easing`, and the named transitions built from them |
| `breakpoint` | the widths at which layout changes |
| `grid` | columns, margin, gutter and the width at which content stops growing |
| `opacity` | the opacity scale, and the disabled opacity |
| `shadow` | the elevation shadows |
| `color` | the color families the color engine generates, and the color roles built on them |

Inside `color`, the next segment is the family, spelled as the color engine writes it:
`neutral`, `brand`, `brand-alt`, `critical`, `warning`, `positive`, `info`, `link`,
`absolute`. The engine's own paths are unchanged below that point
(`color/brand/pencil-47`, `color/neutral/paper-0`).

## State words

One closed list, used wherever a token changes with a state:

| Word | Meaning | In code |
| --- | --- | --- |
| `enabled` | at rest, interactive | no pseudo-class |
| `hover` | pointer over | `:hover` |
| `pressed` | being clicked or tapped | `:active` |
| `focus` | keyboard focus | `:focus-visible` |
| `selected` | chosen or on | `aria-selected`, `aria-checked`, `:checked` |
| `disabled` | not interactive | `:disabled`, `aria-disabled` |

`enabled`, `hover` and `pressed` are the three in use today. `pressed` is kept over
`active` because "active" also gets used for "selected". When a condition and an
interaction combine, the condition comes first: `selected-hover`.

The other conditions in the component property glossary (loading, locked, error,
destructive, entered, expanded, required) are component properties. They do not become
token state words: error and destructive are a color family, the rest change structure,
not a token value.

## The prefix, brands and modes

- One prefix for the whole system. It is set once in the build and added to CSS names. It
  is not part of the path and does not appear in Figma or in the token file.
- A brand, a product, light or dark, a platform, a text-size setting or a breakpoint
  never appears in a name. Each is a context: the same paths with different values.
- Type sizes and the grid change by viewport (mobile, tablet, desktop, wide), one axis
  that web reads by breakpoint and native by device class, so each is a set of contexts
  on identical paths. A user's text-size setting is applied by the operating system from
  the base size; it is not a context the tokens carry.

## Figma collections and token files

- A Figma collection maps to one set of token files: one file per mode, on identical
  paths. A mode is a context. A variable's name is the path.
- The collection name appears in the file name and in the resolver document that joins
  the files. It is never a segment of the path.
- A composite token, such as a text style, is one token in the file. In Figma its parts
  are variables of their own, named by the token's path plus the part
  (`text/heading/lg/font-size`), and the text style itself binds to them.
- A collection name and a category word are never the same word. A collection that holds
  `font/…` and `text/…` is not called "font" or "text".
- A collection is an axis, one per thing a designer switches on a frame, and a group
  sits in the collection whose axis it might need one day: color changes with light, dark
  and brand; type, the grid and the semantic space and size rows change with viewport;
  the scales never change; motion will change with reduced motion.
- One owner per row. A generated row is written from code to Figma and never read back.
  A hand-authored row in the same collection is told apart by a hidden stamp in Figma and
  by the generator's own list in code, not by its name.

## The semantic layer

Kept slim. Match what exists, name it better, add the obvious gaps.

- Color: property first (`fg`, `bg`, `border`, `surface`), then the family where the
  role has one (the neutral is implied by its absence), then the word, or the level and
  its state (`color/fg/critical/regular`, `color/bg/brand/soft/hover`). The roles and
  the engine's base tokens share the `color` group; the engine's rows are family-first
  and hidden, so the two orders never meet in a picker.
- Space: a gap or a padding, then where it applies (inside a control, between pieces of
  content, between blocks of layout, inside a card or a container), then a density word.
  The documented cases each one covers go in its description.
- Size: icon sizes and control heights.
- Typography: the text styles. The roles and sizes of today's styles are kept; the
  per-style size, family and weight variables are replaced by styles that reference a
  shared `font` scale.
- Motion: the named transitions, each a pair of one easing and one duration.

## Today's names, renamed

| Today | Path | CSS |
| --- | --- | --- |
| `Primitives/space-400` | `space/400` | `--ds-space-400` |
| `Primitives/negative-space-400` | `space/negative/400` | `--ds-space-negative-400` |
| `radius-200` | `radius/200` | `--ds-radius-200` |
| `width-025` | `border-width/025` | `--ds-border-width-025` |
| `icon-sm` | `size/icon/sm` | `--ds-size-icon-sm` |
| `font/weight/medium` | `font/weight/medium` | `--ds-font-weight-medium` |
| `heading/lg/font-size` and its two siblings | one text style, `text/heading/lg` | per part, `--ds-text-heading-lg-font-size` |
| `motion-easing-enter` | `motion/easing/enter` | `--ds-motion-easing-enter` |

## What changed from the v1 proposal

Kept: the three layers, numeric steps for base tokens, the element and state segments,
state last, hyphens in CSS and slashes in Figma, and a full segment breakdown for every
token that tools can read.

Changed:

- Tier and type are no longer segments. The layer shows in the shape and is recorded in
  the declaration; the data type is already a field on every token.
- The category is the everyday word (`space`), not the data type (`dimension`).
- Scope becomes one prefix. Brands and products are contexts on the same names, so a
  component binds to one name whichever brand is showing.
- Segments are lower-case with hyphens, not camelCase.
- A value named for a purpose (`success`) is a semantic token, not a base.
- The segment breakdown lives in the generator's declaration, which is where the names
  are built from, not in a second record beside each name.

## The collections, as they stand

| Collection | Axis | Holds |
| --- | --- | --- |
| `theme` | light, dark; brand extensions | the color engine's `color/…` base tokens |
| `palette` | none | the semantic colors: roles, surfaces, scrim, each an alias |
| `viewport` | mobile, tablet, desktop, wide | the grid, the text styles, the semantic space and size rows |
| `scale` | none | the base tokens that never vary: space, size, radius, border width, opacity, breakpoints, font families, weights, sizes and line heights |
| `motion` | default, reduced (reduced not yet declared) | durations and easings |

`theme` and `palette` are the owner's names; the other three are placeholders pending the
team's review. Renaming a collection later costs nothing, since the Figma script finds a
collection by its stamp.

## Open

1. The map from today's color roles to the color engine's roles.
