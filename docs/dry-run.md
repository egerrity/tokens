# The dry run

How the generated set goes into a Figma file without touching the real one first. It
needs Figma Desktop and the repo; it does not need Node.

## 1. A copy of the file, with the engine in it

Duplicate the work file in Figma (right-click it in the file browser, Duplicate). The
copy keeps every collection, variable, style and library binding. Everything below
happens in the copy; the real file is never the first target.

The copy must already hold the color engine's rows under their current names,
`color/<family>/…` in the `theme` collection, which the engine's own plugin (okchroma
0.8 or later) writes and migrates. The apply never creates or writes an engine row: it
finds each by name and stamps it, so the palette's aliases resolve, and reports any it
cannot find. If the copy still has the engine's rows under `base/…`, run the engine's
plugin on the copy first.

The engine documents in the repo, `dist/tokens/engine.*.tokens.json`, are an emit for
a sample seed; they feed the token file's joined documents and the pages, not the Figma
run. For the real brand they are replaced by the engine's emit for its seed, one
command in the engine's repo, and the generator run again.

## 2. The plugin

`dist/figma/plugin/` is committed with the rest of the build: `manifest.json` and
`code.js`, which is `scripts/figma/apply.js` with every payload inlined, in the order
aliases need (scale, motion, viewport, theme, palette, then the text styles and the
effect styles). Pull the repo and it is there.

In Figma Desktop, with the copy open: Plugins > Development > Import plugin from
manifest… > choose `dist/figma/plugin/manifest.json`. Then Plugins > Development >
Open console, so the report is visible, and run Plugins > Development > tokens apply.

## 3. The report

The console prints one report for the whole run:

- `created`: rows and styles that did not exist.
- `renamed`: today's names that became the new ones, in place, so bindings survive and
  the code syntax on each row stays what the product code reads. The palette rows are
  matched by the names in `declarations/renames.ts`, one old row per new row where the
  migration map gives one; a row the report says was `created` rather than `renamed`
  is one whose old name is spelled differently in the file, and the spelling goes into
  that map.
- `updated`, `same`: values and descriptions that changed, and rows already right.
- `orphans` and `rebound`: a row whose old name sits in a collection the new row cannot
  live in. The new row is created, and every fill, stroke, effect and alias bound to
  the old one is moved to it (`rebound` counts them); the old row is left in place for
  you to delete once nothing refers to it. None is expected: the surfaces are palette
  rows that alias the theme's hidden planes, so today's background rows rename into
  them in place like the rest. A text layer with mixed fills, or a font the plugin
  cannot load, is reported and rebound by hand.
- `problems`: rows left alone because settling them would mean guessing: two variables
  carrying one stamp (a duplicate), a name another variable holds (a hand rename), a
  type that does not match, a mode the payload does not name. Fix each by hand and
  run again. The known mode case: `viewport` takes over today's `Type scale`
  collection, so the text styles' bindings survive; its two modes are renamed
  (`mobile`, `desktop`), `tablet` and `wide` are added, and the iOS text-size modes are
  left in place and listed here. They are deleted by hand: the ruling is that the OS
  scales from the base size.

The script never deletes, never writes a value that is already what the payload asks
for, and leaves a row composed by hand (an alias with an opacity) as it is.

## 4. The checks

- Run the plugin a second time. The report should count only `same`; anything else is
  a row the first run could not settle, and it says which.
- Open a component that bound today's variables: it resolves to the same color under
  the new name.
- The engine's `color/…` rows are untouched; the plugin only matches them by name.
- The pair rows show their solid alias and end their description with "Compose by
  hand with opacity/…": those are composed by hand, once, and the next run leaves
  them alone.
- Reserved rows are hidden from publishing; the picker in a consuming file does not
  show them.

Then the real file, the same way.

## After the run, by hand

The script never deletes and never guesses, so these are the owner's, in the copy first
and in the real file after.

Delete, once nothing refers to them:

- In the palette, the nine rows with no successor: Merge Intensity 4, the five inverse
  merges, the three skeleton loader rows. Bind the skeleton component to the surfaces
  (`low`, `mid`, `dim`) or `bg/hint` before deleting its rows.
- In `viewport`, the iOS text-size modes the report lists under `problems`.
- In `theme`, the leftover `utility` rows from the engine's earlier cut: old surfaces,
  shadows and scrim, absolute black and white, alpha rows. Check the absolute and alpha
  rows for references first.
- Whole old collections, once empty of references: the one holding today's radius and
  width rows (orphans; the rebind pass moves their bindings to `scale`); the one holding
  the old spectrum, merge, scrim and elevation rows, which the palette no longer points
  at, though product components may bind its rows directly; and any small collection
  the set replaces.

Decide, then fix:

- The collection that swaps font families for low-fidelity work holds today's
  `font/family/*` and `font/weight/*` under the exact names the set uses, so the report
  says `name held by another variable` for them and the text styles bind to the old
  rows. Either the swap is kept as a feature, and the font rows are declared into that
  collection, or the six are renamed by hand before the run and the collection deleted
  after.
- A palette row the report says was `created` rather than `renamed` is a spelling the
  rename map does not have; the file's spelling goes into `declarations/renames.ts`.
- A text layer the rebind pass reports as mixed fills, or a font it could not load, is
  rebound by hand.

Compose: the 52 pair rows, each set in the variables panel to its alias at the opacity
its description names (seven per family and for the neutral, the scrim, the two
illustration pairs). A composed row reads back as its alias and later runs leave it
alone.

Verify: a component that bound an old background row shows its surface, the same
variable; the text styles show the right family, bound; the effect styles show their
new names with the same layers; the planes resolve inside the theme's extension.

## The new file

The same bundle fills an empty file, for a proposal shown clean beside the edited
copy. The engine's plugin goes first there too, since ours never writes an engine row;
after it, every collection, row and style comes back as `created`, with nothing to
rename and no orphans. Text styles need the font families licensed on that file's
plan, or the report says which style it skipped.

## With a script runner instead

Where a Figma connection with a script runner is available, `node scripts/figma-call.ts
<payload>` prints the same script for one payload, and `<payload> <n> <of>` prints the
nth of `<of>` chunks, because a runner caps the code it takes. The payloads go in the
same order as above.
