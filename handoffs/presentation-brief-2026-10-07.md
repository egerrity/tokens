# Presentation brief: the semantic color set and the token generator

For the session that prints this into a FigJam board, and for the owner presenting it.
Everything here is decided unless marked open; the record behind each point is in the
repo's `docs/`. No names: the work is the owner's and the team's.

## 1. What this is, in one paragraph

A generator that turns a handful of declarations (scales, words, stops, levels) into
the design tokens as files (the Design Tokens Format Module, with a resolver for the
modes), into Figma (variables, text styles, effect styles, applied in place), and into
documentation pages, deterministically: every name and every alias follows from a rule
and a declared value, and an audit plus an independent parser prove it on every run.
The color half is the first full use of it: a semantic color set on top of the color
engine's primitives, built with the owner's account of what each of today's rows is
used for and what is wrong with it.

## 2. What was wrong with today's color palette

From the owner's worksheet (`docs/color-role-worksheet.csv`, one row per old variable
with "used for" and "existing problems"):

- Catch-all rows: each Signal color and the Brand Primary served as text, fill and
  border at once; "needs to be forked."
- Content Tertiary did not pass AA and was used as a text color anyway; designers also
  used it, and Background Tertiary, to mean "disabled."
- The Spotlight rows were "added hastily" with no coherent usage; the Highlight rows'
  names promised more than their one use (a border).
- Merge intensities were neutral only ("looks odd with colored icon buttons"), lacked a
  selected state, and two of them overlaid the brand fill with no way to know whether
  to go lighter or darker.
- The inverse backgrounds doubled as buttons, which blocked brand color on buttons.
- No real elevation system; the elevation overlays were unused.

## 3. The framework: one vocabulary

**Five words, each a combo of a text, a ground and a border that go together**, always
listed in one order: `regular`, `accent`, `hint`, `muted`, `strong`. The two a
designer reaches for first, then the rest in rising emphasis (which is also light to
dark in every property).

- `regular`: the default accessible combo, the most used.
- `accent`: the signature stop, `pencil-47`, in every property; it grabs the eye, so
  not for body text, regular borders or card grounds.
- `hint`: light and versatile; its text is the one that is not AA, so in Figma it is
  scoped to shape fills and never appears in the text picker.
- `muted`: colored but restrained.
- `strong`: heavy and bold.

Each property maps the words to engine stops once, and that holds in the neutral and
in every family: `fg/brand/accent` is the brand's `pencil-47` exactly as `fg/accent`
is the neutral's.

| Word | `fg` | `fg/on-inverse` | `bg` | `border` |
| --- | --- | --- | --- | --- |
| `regular` | `pen-70` | `paper-3` | `paper-3` | `highlighter-26` |
| `accent` | `pencil-47` | `chalk-20` | `pencil-47` | `pencil-47` |
| `hint` | `highlighter-26` | | `paper-1` | `chalk-8` |
| `muted` | `pen-58` | `chalk-11` | `paper-5` | `chalk-15` |
| `strong` | `pen-100` | `paper-0` | `chalk-20` | `pen-70` |

Rules the rows rest on:

- Every `fg` word but `hint` is AA for small text. The highlighter (3:1) is never a
  ground on its own, because it has no on-text: it is a border, the focus ring, the
  state layers, and icons.
- Every `bg` row holds text and says whose. The accent fill takes the on-inverse text.
- A surface is an elevation plane and reverses with the mode; a bg is a flat fill and
  does not.
- Disabled is not a color: `opacity/disabled` on the whole component.
- Every word a family has a stop for is emitted. Rows are **offered** (published) or
  **reserved** (in the library for component authors, hidden from publishing). Offering
  a word later is a list edit, never a new name. Today: the neutral offers everything;
  families offer `regular` and `accent` text, `regular`/`accent`/`muted` borders,
  `regular` and `accent` grounds.

## 4. Interactions: three levels under `bg`

A second axis, cordoned by its own group, named for what sits at that height (the
library's own button kinds, and every other system's):

- `ghost`: nothing at rest, the family's highlighter at an opacity when touched (8 /
  12 / 16 percent for hover / pressed / selected). Ghost and outline buttons, icon
  buttons, rows, menu items.
- `soft`: that tint at rest, stronger when touched (12 / 16 / 24 / 32). Chips, a
  selected tab, a soft button.
- `solid`: the engine's stamp, with its edge under `border` and its on-text under
  `fg`. A component color: emitted for parity, always reserved.

Every level exists for every family. Offered: the neutral's `ghost` and `soft`, which
is what the merge rows were used for. The old merge rows map onto these.

## 5. Elevation

Material 3's model, which the team's levels already follow: a plane plus a shadow, the
shadow doing the lifting in light and the plane doing it alone in dark.

- Planes: `surface/dim` (the page), `low` (a well), `mid` (a panel), `high` (card,
  menu, dialog, input), `inverse` (banners, cards, toasts; not interactive), `scrim`.
- Shadows, Material's four working levels (1, 2, 3, 5) under role names, never plane
  names, because a card, a menu and a dialog all rest on `surface/high` and take three
  different shadows: `shadow/raised` (cards, sheets), `floating` (menus, popovers, nav
  bar), `overlay` (dialogs, modal sheets, FAB), `lifted` (an elevated card at its
  strongest). The recipes are today's four, unchanged, so the look does not move.
- Atlassian's two rules carry over: a raised plane always comes with its shadow; a
  shadow never groups what a border or white space would.

## 6. Why two color collections (theme and palette), the rock-solid answer

The semantic rows do not vary by mode. In Figma, an unmoded collection is the only
structure that can state that. In a moded collection, "doesn't vary" is a convention:
N cells per row holding the same alias, which nothing enforces, which every hand edit
must repeat N times, and which the REST export and every token tool read as N
independent values.

Count the duplicates properly:

- two collections: 4 duplicate variables (the planes), hidden, generated, and they are
  the four things that genuinely vary;
- one collection: 216 rows × (modes − 1) duplicate values, forever, by convention.

"If you put it out into the world you have to take care of it" argues for two
collections: one puts four generated duplicates into the world, the other puts 216
hand-maintained ones.

Two consequences:

1. Adding a mode (high contrast, a brand, a density) touches theme only: the engine's
   rows plus four planes. The palette never changes and cannot drift.
2. Figma mirrors the token file one to one: the Design Tokens resolver has exactly a
   *set* (no contexts) and a *modifier* (contexts), and palette and theme are those two.
   Any round trip or third-party export reads the semantic layer as one set.

The reader's side, which decides it: a variable arrives as `valuesByMode`. With one
collection, every semantic row is N cells and a reader (a person, an exporter, an
agent) must compare them to learn that the row does not vary; with two, the row is
one value and "does not vary" is where it lives. On the writing side, a moded
collection asks every editor to know a rule the file does not state, that all modes
stay equal, and a reader cannot tell "equal by rule" from "equal by coincidence", so
the invariant breaks silently. Invariants should be structural, not conventional.

Equal either way, so nobody can say it was hidden: the mode switch (one, on theme;
palette has no modes), hiding primitives, ownership, performance, resolution in
consumer files, extended collections. The rename-in-place migration is a bonus, not the
reason.

## 7. The migration: one set, shown twice

There is one ideal set and one map, not two sets. `docs/color-semantic-set.md` is the
set; `docs/color-role-map.md` gives every old row one home (dominant use) and lists
where an old row's uses split.

Shown two ways from the same plugin bundle:

- **Edited**: a copy of the work file, the engine's rows already in it. Today's rows are
  renamed in place by their old names, so bindings and code syntax survive; rows with
  no successor stay (Merge 4, the inverse merges, the skeleton loader rows, the
  elevation overlays) and nothing is deleted.
- **New**: an empty file; the engine's plugin first, then ours; everything created clean.

First dry run on the work-file copy: 210 new rows, 22 leftovers, all explained (five
backgrounds that needed the plane rows, eight signal rows spelled Error/Success rather
than Negative/Positive, nine with no successor). Both fixed; the expected leftovers are
now the nine with no successor.

## 8. What the generator guarantees

- Declarations are data (`declarations/*.ts`): scales, words, stops, levels, what is
  offered. Names, aliases and descriptions are derived; two builds are byte-identical.
- The audit: every file on disk matches the declarations, every name is in the
  grammar, every token has a description, every alias resolves, every scale ascends.
  An independent parser (Terrazzo) accepts the joined documents.
- Figma: every variable and style is stamped with its path and found by stamp first,
  then by today's name, then by its new name; renamed in place; values written only
  when different; a second run changes nothing. The script never deletes. The engine's
  rows are another writer's: found by name and stamped, never created or written.
  Reserved rows are hidden from publishing. A row the script cannot settle without
  guessing (a duplicated stamp, a taken name, a type mismatch) is reported, not
  touched.
- A development plugin carries the whole set, so the work machine needs no Node.

## 9. Open for the team

- Which reserved words to offer, as component work asks for them.
- `border/<family>/muted` on `chalk-15`, where today's highlight border is `chalk-11`.
- Which components take which shadow level, beyond Material's table.
- Whether the ghost opacities (8 / 12 / 16 on a gray) read as today's 5 / 10 percent
  of near-black once composed; one number each if not.
- The code-side audit that sorts the split uses of the four catch-all rows.

## 10. Exhibits

- The Figma review file "tokens color review": the three collections, the effect
  styles, and the owner's frame of the five combos (node `19-103`).
- The worksheet: `docs/color-role-worksheet.csv` (also the Google Sheet "Color role
  worksheet" in the owner's Drive).
- `docs/color-semantic-set.md`, `docs/color-role-map.md`, `docs/dry-run.md`,
  `docs/grammar-draft.md`, `docs/generator-plan.md`, and the generated pages in
  `docs/groups/`.

## 11. A board, if it is one

Sections in the order above: the problem (the worksheet's complaints as stickies), the
five words (the table), the rules (one sticky each), the levels, elevation (the
plane-and-shadow table), two collections (the duplicate count as the headline), the
migration (edited beside new), what the generator guarantees, open items.
