# Token naming grammar

Draft for review. It joins three inputs: the v1 naming proposal, the pattern the
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
  (`line-height`, `fill-hover`). No capitals, so no two names differ only by case. Whole
  words, not abbreviations (`negative`, not `neg`).
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
| Primitive: a raw value on a scale | `category-step`, or `category-property-step` | `space-400`, `radius-200`, `opacity-016` |
| Semantic: a value named for its purpose | `category-property-variant`, plus `-state` where it has one | `size-icon-sm`, `space-gap-content-condensed` |
| Component: a value only one component needs | `component-property-variant-state` | none yet |

The layer is not a segment of the name. It is recorded for every token in the
declaration, so tools can read it without parsing names.

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
| `size` | the sizing scale, and semantic sizes such as icons and control heights |
| `radius` | corner radius |
| `border-width` | border and outline widths |
| `font` | type primitives: `font-size`, `font-weight`, `font-family`, `font-line-height`, `font-letter-spacing` |
| `text` | text styles by role and size, each built from the `font` primitives |
| `motion` | `motion-duration`, `motion-easing`, and the named transitions built from them |
| `breakpoint` | the widths at which layout changes |
| `grid` | columns, margin and gutter |
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
- Type sizes change by platform and text-size setting, and the grid changes by
  breakpoint, so each is a set of contexts on identical paths.

## Figma collections and token files

- A Figma collection maps to one set of token files: one file per mode, on identical
  paths. A mode is a context. A variable's name is the path.
- The collection name appears in the file name and in the resolver document that joins
  the files. It is never a segment of the path.
- A collection name and a category word are never the same word. A collection that holds
  `font/…` and `text/…` is not called "font" or "text".
- Groups that change with different contexts cannot share a collection: color changes
  with light, dark and brand; type with platform and text size; the grid with breakpoint;
  space, size, radius, border width, opacity and motion do not change at all.
- One owner per row. A generated row is written from code to Figma and never read back.
  A hand-authored row in the same collection is told apart by a hidden stamp in Figma and
  by the generator's own list in code, not by its name.

## The semantic layer

Kept slim. Match what exists, name it better, add the obvious gaps.

- Color: the interaction roles keep the spelling the color engine gave them,
  `family-tier-property-state`, under `color` (`color-brand-solid-bg-hover`,
  `color-critical-fg`). Generated colors and hand-authored color roles share the `color`
  group.
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

Kept: the three layers, numeric steps for primitives, the element and state segments,
state last, hyphens in CSS and slashes in Figma, and a full segment breakdown for every
token that tools can read.

Changed:

- Tier and type are no longer segments. The layer shows in the shape and is recorded in
  the declaration; the data type is already a field on every token.
- The category is the everyday word (`space`), not the data type (`dimension`).
- Scope becomes one prefix. Brands and products are contexts on the same names, so a
  component binds to one name whichever brand is showing.
- Segments are lower-case with hyphens, not camelCase.
- A value named for a purpose (`success`) is a semantic token, not a primitive.
- The segment breakdown lives in the generator's declaration, which is where the names
  are built from, not in a second record beside each name.

## Open

1. The Figma collection names, and which groups go in which collection.
2. The map from today's color roles to the color engine's roles.
