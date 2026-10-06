# The color role map

Today's semantic color rows, each with its one home in the ideal set
(`color-semantic-set.md`). The owner's account of what each old row is used for and
what is wrong with it is `color-role-worksheet.csv`; this page is the map that comes
out of it. Where an old row did more than one job, the map gives the dominant use its
home and names the others, and the code-side audit moves each use to its own row.

## How to read the engine's scale

Every family (`neutral`, `brand`, `brand-alt`, `critical`, `warning`, `positive`,
`info`) has the same ladder, lightest first, each stop with a promise it keeps whatever
the brand's seed color:

| Stop | Job | Promise |
| --- | --- | --- |
| `paper-0` | the page pole: white in light, the deepest plane in dark (neutral only) | none |
| `paper-1`, `paper-3`, `paper-5` | backgrounds, inverted text | none; the contrast stops are cleared against them |
| `chalk-8`, `chalk-11`, `chalk-15`, `chalk-20` | decorative borders, tinted grounds, signal hierarchy; never text on a paper | the pens clear them, both ways |
| `highlighter-26` | focus rings, icons, UI borders, large text; the state layer at an opacity | 3:1 on every paper of its family and the neutral |
| `pencil-47` | regular text, the emphasis fill | 4.5:1 on every paper |
| `pen-58`, `pen-70` | regular and strong text, inverted backgrounds | 4.5:1 on every paper and chalk, both ways |
| `pen-100` | the text pole: black in light, white in dark (neutral only) | the maximum; the engine prefers `pen-70` for running text |
| `stamp/fill`, `fill-hover`, `fill-pressed`, `edge`, `on` | the solid button and its states, its gated outline, and the one text color over it | solved per brand; a component's rows, not the palette's |

Two rules carry over from the engine. The same token serves both modes; the theme moves
the value, never the reference. And a solid fill that carries text is always the stamp,
never a scale stop, because only the stamp's on-text is guaranteed.

## The migration map

One row per old row. "Code name" is what the product code reads today.

| Today | Code name | Becomes | On the engine's | Note |
| --- | --- | --- | --- | --- |
| Background Primary | `color-palette-background-primary` | `surface/high` | `paper-0` light, `paper-5` dark | cards, menus, inputs, most page grounds |
| Background Secondary | `color-palette-background-secondary` | `surface/mid` | `paper-1` / `paper-3` | `surface/low` (`paper-3` / `paper-1`) is new, to close the gap to tertiary |
| Background Tertiary | `color-palette-background-tertiary` | `surface/dim` | `paper-5` / `paper-0` | the lowest ground only; its disabled use goes to `opacity/disabled` |
| Background Primary Inverse | `color-palette-background-primary-inverse` | `surface/inverse` | `neutral/pen-70` | inverted banners, cards, toasts; its button use goes to the brand's stamp |
| Background Scrim | `color-palette-background-scrim` | `surface/scrim` | black with `opacity/scrim` | a pair |
| Content Primary | `color-palette-content-primary` | `fg/regular` | `neutral/pen-70` | one stop in from the pole; `fg/strong` keeps the pole |
| Content Secondary | `color-palette-content-secondary` | `fg/muted` | `neutral/pen-58` | |
| Content Tertiary | `color-palette-content-tertiary` | `fg/accent` | `neutral/pencil-47` | one stop in, so the quietest text passes; its disabled use goes to `opacity/disabled` |
| Content Primary Inverse | `color-palette-content-primary-inverse` | `fg/on-inverse/strong` | `neutral/paper-0` | on dark surfaces; its button use goes to the stamp's on-text |
| Stroke Primary | `color-palette-stroke-primary` | `border/strong` | `neutral/pen-70` | kept in case |
| Stroke Secondary | `color-palette-stroke-secondary` | `border/regular` | `neutral/highlighter-26` | the border that passes |
| Stroke Tertiary | `color-palette-stroke-tertiary` | `border/muted` | `neutral/chalk-15` | strong dividers |
| Stroke Quaternary | `color-palette-stroke-quaternary` | `border/hint` | `neutral/chalk-8` | the card edge |
| Stroke Primary Inverse | `color-palette-stroke-primary-inverse` | `border/inverse` | `neutral/paper-0` | |
| Signal Negative | `color-palette-signal-negative` | `fg/critical/accent` | `critical/pencil-47` | as text; as a border `border/critical/accent`, as a fill `bg/critical/accent`: the same stop, so the split is by property only |
| Signal Negative Spotlight | | `bg/critical/accent` | `critical/pencil-47` | progress fills and indicators, one stop in; as a border `border/critical/regular`; icons take `fg/critical/accent` |
| Signal Negative Highlight | `color-palette-signal-negative-highlight` | `border/critical/muted` | `critical/chalk-15` | the border of the regular ground; as a fill `bg/critical/strong`, reserved for components |
| Signal Negative Accent | `color-palette-signal-negative-accent` | `bg/critical/regular` | `critical/paper-3` | |
| Signal Warning | `color-palette-signal-warning` | `fg/warning/accent` | `warning/pencil-47` | as the negative |
| Signal Warning Spotlight | | `bg/warning/accent` | `warning/pencil-47` | as the negative |
| Signal Warning Highlight | `color-palette-signal-warning-highlight` | `border/warning/muted` | `warning/chalk-15` | as the negative |
| Signal Warning Accent | `color-palette-signal-warning-accent` | `bg/warning/regular` | `warning/paper-3` | |
| Signal Positive | `color-palette-signal-positive` | `fg/positive/accent` | `positive/pencil-47` | as the negative |
| Signal Positive Spotlight | | `bg/positive/accent` | `positive/pencil-47` | as the negative |
| Signal Positive Highlight | `color-palette-signal-positive-highlight` | `border/positive/muted` | `positive/chalk-15` | as the negative |
| Signal Positive Accent | `color-palette-signal-positive-accent` | `bg/positive/regular` | `positive/paper-3` | |
| Brand Primary | `color-palette-brand-primary` | `fg/brand/accent` | `brand/pencil-47` | as text; as a border `border/brand/accent`; as a link `fg/link/enabled`; as a button fill `bg/brand/solid/enabled`, a component's row (split below) |
| Brand Primary Highlight | `color-palette-brand-primary-highlight` | `border/brand/muted` | `brand/chalk-15` | as a fill `bg/brand/strong`, reserved for components |
| Brand Primary Accent | `color-palette-brand-primary-accent` | `bg/brand/regular` | `brand/paper-3` | |
| Merge Intensity 1 | `color-palette-merge-default`, `merge-amount-intensity-1` | `bg/ghost/hover` | `neutral/highlighter-26` with `opacity/ghost/hover` | a pair; a colored control takes its family's |
| Merge Intensity 2 | `color-palette-overlay-darker` | `bg/ghost/pressed` | with `opacity/ghost/pressed` | a pair |
| Merge Intensity 3 | `color-palette-overlay-darkest` | `bg/brand/solid/hover` | `brand/stamp/fill-hover` | a component's row |
| Merge Intensity 4 | | nothing | | unused |
| Merge Intensity 5 | | `bg/brand/solid/pressed` | `brand/stamp/fill-pressed` | a component's row |
| Merge Intensity 1 to 5 (Inverse) | `palette-overlay-light`, `lighter`, `lightest` | nothing | | the inverse surface is no longer interactive |
| Skeleton loader Fill, Start, End | | `surface/low`, `mid`, `dim` | | the component binds the surfaces |
| (int) Elevation overlay Level 1 to 4 | | nothing | | unused; the planes move the paper per mode |

## Where uses split

Four old rows did more than one job, and the code-side audit sorts their uses:

| Old row | As text | As a border | As a fill |
| --- | --- | --- | --- |
| Signal Negative, Warning, Positive | `fg/<family>/accent` | `border/<family>/accent` | `bg/<family>/accent` with `fg/on-inverse/*`; a button, `bg/<family>/solid/*` (a component's row) |
| Brand Primary | `fg/brand/accent`; as a link `fg/link/*` | `border/brand/accent` | `bg/brand/solid/*` with `fg/brand/on-solid` and `border/brand/solid` (a component's rows) |

## Open

1. The `muted` border on `chalk-15` moves today's family highlight borders from
   `chalk-11`.
2. Whether the neutral's `fg/hint` (the 3:1 stop) is offered to designers.
3. Two code names in the owner's export look copied rather than assigned: every
   `on-inverse` row carried `color-palette-content-primary-inverse`, and the skeleton
   rows carried the merge names. Not trusted here; the audit reads the code.
