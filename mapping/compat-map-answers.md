# The compatibility map: answers for the mapping agent

The owner's rulings of 2026-10-14 applied. Row-level answers are in
`compat/compat-aliases-reviewed-2026-10-14.csv`, one row per name with `my_target` and
`review`. Roles are spelled as the set spells them; a base token is spelled
`color/<family>/<stop>`. The spec is implemented as section 5 says: the bridge reads
`declarations/compat.ts`, each brand has a `variables.scoped.css`, the brand is renamed, and
the audit checks every name in `mapping/unify-reads.txt`.

## First, the file

The sheet export turned every cell that begins with `--` into `#NAME?`: the `name` column
and every non-color `target` were lost from the CSV the owner holds; kinds, values, color
targets and notes survived. The agent's own CSV is intact. For this review the names were
rebuilt from the reads list, whose alphabetical order the CSV follows once the 26 names the
compatibility block already defines are removed; every kind matches its prefix and twelve
values were spot-checked. `compat/compat-aliases-names-restored-2026-10-14.csv` is that
rebuild. Next time, export the agent's CSV directly, or prefix the cells with an apostrophe
in the sheet.

## 1. A map from the app's CSS names to tokens

There is no complete one; the agent's is the first. What exists: `todayCodeName` in
`src/theme-folder.ts` derives the `color-palette-…` code names from the Figma names in
`declarations/renames.ts` (33 names, 26 of them read), which is the compatibility block;
the role map's "Code name" column is the same list in prose. For the non-color names there
is nothing in the repo. Outside it, the research note `code-vs-declarations-2026-10-12.md`
lists the names in code with no declaration (the control heights below `sm`, the minimum
width, the shadcn block, the 36 derivatives), which is where the agent's gaps come from.

## 2. Shades

Ruled: a shade is solved by stepping along the base scale, or by the correct step in the
interactive semantics where the property is known. In the bridge, where one name must take
one value, the scale step applies: `-dark`, `-darker` and `-darkest` are one, two and
three stops toward the pen from the stop the base name's role lands on; `-light`,
`-lighter` and `-lightest` are the same toward the paper; the scale clamps at its ends
(the brand has no `pen-100`). The codemod then rewrites each use by its job, and uses the
interactive step (`bg/F/solid/hover`, `pressed`; the ghost pairs) where it knows the
property. Every used shade gets a by-step alias, including the ten the agent marked
"codemod, no alias"; unused shades get none.

One fact behind the corrections: in `variables.css` a ghost or soft row is the color half
of its pair only (`--ds-color-bg-neutral-ghost-hover: var(--ds-color-neutral-highlighter-26)`;
the opacity is its own token). An alias onto one of those rows renders an opaque
highlighter-26, a mid gray-blue block. Eight of the proposed aliases did that (`--accent`,
`--secondary`, the three page-background shades, the two `brand-primary-accent` shades,
`merge-default`); all are replaced.

Consequences to expect in the demo, all bridge-only: the page background's shades land on
`paper-1`, `paper-3` and `paper-5`, lighter than today's hover grays, so a hovered row is
faint until the codemod moves it to the ghost pair; the inverse ground's `-lighter` and
`-lightest` land on `pencil-47` and `highlighter-26`, lighter than today's near-blacks,
because the inverse ground itself moves to `pen-70`; `content-tertiary-lightest` lands on
`chalk-15`, a stop that is never text, which the codemod corrects.

## 3. The shadcn names

Targets confirmed as proposed except `--accent` and `--secondary` (a light gray ground is
`bg/neutral/regular`, paper-3, not a pair's color half), and `--primary` and
`--destructive`, which are aliases, not "codemod": a Tailwind theme color needs a value
for the demo, and the fill is the dominant use (`bg/brand/solid/enabled`,
`bg/critical/solid/enabled`). `--input` moves in value on purpose: the set gives an input
at rest the 3:1 border.

Ruled: the `hsl(var(--x))` wrapper is the reader's to fix. The library's Tailwind config
reads `var(--x)` without the wrapper for these fourteen names; the generator emits one
format per token and the bridge aliases as usual. No triplets.

## 4. Non-color names

Confirmed by value against the declarations, with the targets derived again (the CSV
column `my_target` carries them, since the export lost the agent's): breakpoints to
`--ds-breakpoint-*`; the default heights `sm`, `md`, `lg` to `--ds-size-control-*`, and
`xs`, `xxs` to size steps (the set has no control below `sm`); the compact heights to the
icon run `--ds-size-icon-*`, which the code calls compact heights, or to size steps if
they size something other than icons; the widths to size steps; the desktop max to
`--ds-grid-max-width`; durations, easings, radii, weights, line heights and families to
their rows. The two moves are by declaration and intended: the paragraph width is 640
(`declarations/size.ts`, justified in `starting-set.md`), and `radius/full` is 10000
(renders the same). The monospace family becomes `Roboto Mono` with the space, so the
loaded face must match.

`--layout-width-min` gets no token and no alias. The starting set rules it is not a size
to bind anything to; the compatibility block holds successors only, so a literal there
is a token by another door. The app keeps the literal in its own stylesheet.

## 5. The step-two spec

Implementable with these changes, on the owner's word, because it changes her generator:

1. **The brand.** Ruled: the company's name is allowed as a brand key in the tokens repo
   (the repo's rule line now says so). The rename is `eggplant` to `fis` as the spec says,
   with its seed `#431C5B` kept: the eggplant purple is the company's brand color, and the
   blue `sample` is the white-label default, which stays the default brand. The owner
   supplies the exact brand hex if `#431C5B` is not it.
2. **The compatibility declaration.** Yes, as `declarations/compat.ts`, one decision per
   file: today's code name to a token path, for every category, never to a `--ds-*`
   string (the generator spells names from paths). The `how` column lives there too
   (`skip`, `codemod`, `exclude`), so the audit reads one declaration. A name in both maps
   fails, as the spec says.
3. **Pairs.** Moot for the two merge names: ruled retired, no alias, the codemod rewrites
   every use to the ghost pairs. No other alias points at a pair after section 2.
4. **Triplets.** Not in the generator; the reader changes.
5. **Scoped output.** Fine as an additive file beside the `:root` file.
6. **The audit check.** Fine. The reads list goes into the repo under a neutral file name
   (the names themselves carry no employer word), and the exemptions are the declaration's
   `how` column, not a second list.
7. **`--layout-width-min`.** Not emitted; see 4 above.

## Retired names

`--color-palette-merge-default` and `--color-palette-merge-inverse`: not used anywhere
after the change (ruled). No alias; the codemod rewrites each use to `bg/neutral/ghost/*`
with `opacity/ghost/*`.
