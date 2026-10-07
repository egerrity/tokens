# The dry run

How the generated set goes into a Figma file without touching the real one first. It
needs Figma Desktop and the repo; it does not need Node.

## 1. A copy of the file

Duplicate the work file in Figma (right-click it in the file browser, Duplicate). The
copy keeps every collection, variable, style and library binding. Everything below
happens in the copy; the real file is never the first target.

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
- `renamed`: today's names that became the new ones, in place, so bindings survive.
- `updated`, `same`: values and descriptions that changed, and rows already right.
- `orphans`: a stamped row found in another collection; a new one was created here
  and the old one's bindings move by hand.
- `problems`: rows left alone because settling them would mean guessing: two variables
  carrying one stamp (a duplicate), a name another variable holds (a hand rename), a
  type that does not match, a mode the payload does not name. Fix each by hand and
  run again.

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

## With a script runner instead

Where a Figma connection with a script runner is available, `node scripts/figma-call.ts
<payload>` prints the same script for one payload, and `<payload> <n> <of>` prints the
nth of `<of>` chunks, because a runner caps the code it takes. The payloads go in the
same order as above.
