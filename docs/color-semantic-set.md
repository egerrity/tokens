# The semantic color set, as it should be

The ideal set, built from the engine's rules and from what the old palette's rows are
actually used for (`color-role-worksheet.csv`, the owner's account of each old row).
`color-role-map.md` carries the migration: one target per old row. Every row here is an
alias to an engine primitive or a pair (an alias plus an opacity), so the set has no
modes of its own and follows the theme's.

## The construction

Property first, then the family, then an emphasis word or a state:

```
color / <property> / <family> / <word | state>
```

- **Property**: `fg` for text and icons, `bg` for a component's own ground, `border`,
  `surface` for the page's planes, `illustration` for the brand's illustration palette.
- **Family**: left out for the neutral, named for the rest: `brand`, `brand-alt`,
  `critical`, `warning`, `positive`, `info`.
- **Word**: one vocabulary of five, each a combo of a text, a ground and a border that
  go together, always listed in one order: `regular`, `accent`, `hint`, `muted`,
  `strong`. The two a designer reaches for first, then the rest in rising emphasis.
  `regular` is the default accessible combo, the most used; `accent` is the signature
  stop, `pencil-47`, in every property, and grabs the eye, so it is not for body text,
  regular borders or card grounds; `hint` is light and versatile, and its text is the
  one that is not AA; `muted` is colored but restrained; `strong` is heavy and bold. A property says once which engine stop each word names, and that holds
  in the neutral and in every family, so `fg/brand/accent` is the brand's `pencil-47`
  exactly as `fg/accent` is the neutral's.
- **Level**, for the interactive grounds, a second axis under `bg` cordoned by its own
  group: `ghost` is nothing at rest and the family's highlighter at an opacity when
  touched (ghost and outline buttons, icon buttons, rows, menu items); `soft` is that
  tint at rest and stronger when touched (chips, a selected tab, a soft button); `solid`
  is the engine's stamp, with its edge under `border` and its on-text under `fg`. The
  words are the library's own button kinds, and every other system's.
- **State**: `enabled`, `hover`, `pressed`, `selected`, on the levels only; the solid
  has no `selected`.

Offered and reserved: a row is either offered to every designer or reserved for
component authors. A reserved row is in the token file and in the library, and hidden
from publishing in Figma, so a consumer of the library never sees it. That is the gate
on the `bg` ladder: designers get two grounds per family today, components get four,
and offering more later is one word in the declaration, not a new name.

Four rules the rows rest on:

1. **Every `bg` row holds text, and says whose.** The highlighter has no on-text, so it
   is never a ground on its own; it is a border, the focus ring, the state layer, and
   icons. The accent fill takes the `on-inverse` text, as the inverse surface does.
2. **The three levels are emitted for every family, for parity**, and offered by
   level: the neutral's `ghost` and `soft` to every designer (what the merge rows were
   used for), the families' levels to components, so a colored icon button no longer
   hovers gray. **The solid is a component color**: the engine's stamp under a palette
   name, always reserved, never a general fill.
4. **Disabled is not a color.** It is `opacity/disabled` on the whole component.

## The ladders

What each word names, per property. A blank cell is a word the property does not use;
a starred stop is reserved for components.

| Word | `fg` | `fg/on-inverse` | `bg` | `border` |
| --- | --- | --- | --- | --- |
| `regular` | `pen-70` | `paper-3` | `paper-3` | `highlighter-26` |
| `accent` | `pencil-47` | `chalk-20` | `pencil-47` | `pencil-47` |
| `hint` | `highlighter-26` | | `paper-1` \* | `chalk-8` |
| `muted` | `pen-58` | `chalk-11` | `paper-5` \* | `chalk-15` |
| `strong` | `pen-100` | `paper-0` | `chalk-20` \* | `pen-70` |

Every `fg` word but `hint` is an AA stop for small text; `hint` clears 3:1 and is for
icons and shapes only, so in Figma it is scoped to shape fills and never appears in
the text picker. On the inverted ground the
four words are all AA against `surface/inverse`, because the pens clear every chalk.
On the grounds: every `fg` word but `hint` reads on `bg/regular`, `muted` and `hint`;
`fg/strong`, `regular` and `muted` read on `bg/strong`; `bg/accent` takes
`fg/on-inverse/strong` and `regular` and nothing else, because the pencil clears every
paper.

## The neutral

| Row | On the engine's | For |
| --- | --- | --- |
| `fg/regular`, `accent`, `hint`, `muted`, `strong` | the `fg` ladder | running text and its icons; the quietest text; icons and large text; secondary text; display text |
| `fg/link/enabled`, `hover`, `pressed` | `link/default/*` | links in running text, which no component owns |
| `fg/on-inverse/regular`, `accent`, `muted`, `strong` | the inverse ladder | the same words on `surface/inverse` |
| `fg/on-inverse/link/enabled`, `hover`, `pressed` | `link/inverse/*` | links on an inverted ground |
| `border/regular`, `accent`, `hint`, `muted`, `strong` | the `border` ladder | the 3:1 border for inputs; the eye-catching border; the card edge; strong dividers; an emphasized outline |
| `border/focus` | `brand/highlighter-26` | the focus ring, drawn the same on every control |
| `border/inverse` | `neutral/paper-0` | borders on an inverted ground |
| `bg/regular`, `accent` | `paper-3`, `pencil-47` | the default ground with color; the fill that grabs the eye, with the on-inverse text |
| `bg/hint`, `muted`, `strong` (reserved) | `paper-1`, `paper-5`, `chalk-20` | the lightest, the restrained and the heavy ground |
| `bg/ghost/enabled`, `hover`, `pressed`, `selected` | transparent, then `highlighter-26` with `opacity/ghost/*` | the ghost ground, as pairs |
| `bg/soft/enabled`, `hover`, `pressed`, `selected` | `highlighter-26` with `opacity/soft/*` | the soft ground, as pairs |
| `bg/solid/enabled`, `hover`, `pressed`; `border/solid`; `fg/on-solid` (reserved) | `stamp/fill`, `fill-hover`, `fill-pressed`; `stamp/edge`; `stamp/on` | the solid ground, its edge and its on-text |
| `surface/high`, `mid`, `low`, `dim` | the planes | elevation, in the engine's order in both modes; an input fills with `high`, like a card |
| `surface/inverse` | `neutral/pen-70` | an inverted banner, card or toast; not interactive |
| `surface/scrim` | black with `opacity/scrim` | a pair |

## Each colored family

The same for `brand`, `brand-alt`, `critical`, `warning`, `positive` and `info`:

| Row | On the engine's | For |
| --- | --- | --- |
| `fg/<family>/regular`, `accent` | `pen-70`, `pencil-47` | the family color as dark text; as text at the quiet weight |
| `fg/<family>/hint`, `muted` (reserved) | `highlighter-26`, `pen-58` | icons and shapes; secondary text, in the family's color |
| `border/<family>/regular`, `accent`, `muted` | `highlighter-26`, `pencil-47`, `chalk-15` | a 3:1 border; an input in error; the border of the regular ground |
| `border/<family>/hint`, `strong` (reserved) | `chalk-8`, `pen-70` | the faintest border; an emphasized outline, in the family's color |
| `bg/<family>/regular`, `accent` | `paper-3`, `pencil-47` | an alert or callout ground; a solid badge, chip or progress fill, with the on-inverse text |
| `bg/<family>/hint`, `muted`, `strong` (reserved) | `paper-1`, `paper-5`, `chalk-20` | the lightest, the restrained and the heavy ground, for components |
| `bg/<family>/ghost/*`, `soft/*`, `solid/*`; `border/<family>/solid`; `fg/<family>/on-solid` (reserved) | as the neutral's | the three levels in the family's color, for components |

Every word a family has a stop for is emitted, so the whole framework is recorded and
offering a word later is removing it from a reserved list. The one word a family
cannot have is `fg/strong`: the text pole, `pen-100`, is the neutral's alone.

## The illustration palette

The brand's palette for illustrators, and only the brand's: six of its stops under
their own names, plus a shadow and a shine as pairs.

| Row | On the engine's |
| --- | --- |
| `illustration/paper` | `brand/paper-5` |
| `illustration/chalk-light` | `brand/chalk-11` |
| `illustration/chalk` | `brand/chalk-20` |
| `illustration/highlighter` | `brand/highlighter-26` |
| `illustration/pencil` | `brand/pencil-47` |
| `illustration/pen` | `brand/pen-58` |
| `illustration/shadow` | `brand/pen-58` with `opacity/010` |
| `illustration/shine` | `brand/paper-5` with `opacity/020` |

## Semantic opacity

| Row | Step |
| --- | --- |
| `opacity/ghost/hover`, `pressed`, `selected` | 8, 12, 16; at rest the ghost ground is transparent |
| `opacity/soft/enabled`, `hover`, `pressed`, `selected` | 12, 16, 24, 32 |
| `opacity/scrim` | 64 |
| `opacity/disabled` | 38 |
| `opacity/010`, `opacity/020` | the illustration pairs' steps, added to the scale |

## Count

216 color rows: 39 neutral, 27 per family, 8 illustration, 6 surfaces; 128 of them
reserved. 52 pairs.

## Ruled

By the owner on 2026-10-05: `fg` and `bg` stay as words; the focus ring is the brand's
highlighter; every family gets the state layer in the first cut; the illustration
pairs get their own opacity steps, 10 and 20.

By the owner on 2026-10-06, through the worksheet and the screenshot of her ladder: the
five emphasis words and the `fg` stops they name; the same words in the families,
offered as a subset; the stamp is a component color and leaves the palette; `bg` has
static rows, not only the state layer; the inverse surface stops being interactive; the
elevation overlays and the inverse merges have no successor; the skeleton loader binds
surfaces.

By the owner on 2026-10-06, talking through the ladders and then drawing them (the
review file, the frame of five combos): the highlighter is never a ground; `accent`
is `pencil-47` in every property and grabs the eye; `strong` is a chalk, `regular`,
`muted` and `hint` are papers (3, 5, 1); the accent fill takes the on-inverse text;
designers get the regular and accent grounds only for now, and the rest of the `bg`
ladder is reserved for components. The order every list keeps is `regular`, `accent`,
`hint`, `muted`, `strong`: the two reached for first, then rising emphasis, which is
also light to dark in every property.

By the owner on 2026-10-06, on the interactions: three levels, not one, cordoned by a
level group under `bg`, named `ghost`, `soft` and `solid`; the solid is aliased from
the engine's stamp for parity and hidden from designers, rather than generated by the
engine, because the engine emits primitives only and the semantic name is the
palette's. The `muted` border is `chalk-15`. The neutral's `fg/hint` is offered, scoped
to shapes. Every word with a stop is emitted, offered or reserved, so the framework is
recorded in full and what designers see is decided per word.

Open, for her: which reserved words to offer, as the component work asks for them.
