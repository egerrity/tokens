# The design system in one repository

The plan for the repository that holds the whole design system: the color engine, the
token generator, the React package products install, the harness that tests them and the
docs, with the native package and the system's own components as later stages. Written
for the agent doing it and for the owner's approval; nothing below moves until that
approval. `color-engine-merge.md` is stage 1 of this plan and is not repeated here. The
words adapter, component declaration, harness, backstop, sentinel, substrate, graduation
and theme extension are defined in `glossary.md`.

## The end state

```
engine/          the color engine, a workspace package cut at its tag
tokens/          the generator: declarations, grammar, build, audits, the Figma plugin, committed outputs
react/           the React package: MUI re-exported unchanged, the provider, the generated adapter, the lint
native/          the native package: the Tamagui adapter and package, on its trigger
apps/reference/  the harness: every declared brand and mode rendered, the rendered-color test
docs/            the system's record: the grammar, the sets, the rules by component, the plans, the decisions
```

- One root holds the workspace list, the shared gates and the ownership map. Every part
  is a package with its own gates and version. `tokens` and `react` publish, in lockstep,
  so a product pins one version and gets one consistent set. The engine ships inside the
  React package when its runtime path ships, bundled into its build or published beside
  it; which is engineering's call.
- The generated outputs stay committed. The build equal to the committed files is the
  drift gate a reviewer reads without running anything.
- A product installs the React package and nothing of MUI's. The package owns one MUI
  major as its dependency, and upgrading it is the system's own release.
- Every visual rule comes from a declaration through generated output: the token set,
  the adapter, the lint's forbidden list, the Figma binding spec, the pages.
- The components pass through two states. First, the React package re-exports MUI's
  components unchanged and styles them through the generated adapter. Last, the system's
  own components on a substrate, styled from the declarations, exposing only the
  overrides the system chooses. A fork of MUI is not a state. The move is per component,
  behind the same import path, and the declarations, the audits, the Figma library and
  the docs do not change when a component moves.

## The rulings

1. **The component contract is a declaration**, color first: one record per component,
   its parts by variant and state, each part reading a semantic token. The adapters are
   generated from it.
2. **Products import a thin package** that re-exports MUI's components unchanged plus
   the provider. No product imports MUI.
3. **The props speak MUI's words**, variant and color alike. The token paths take MUI's
   family words and keep the set's level and state words. The component declaration
   maps each MUI variant to a level.
4. **The family words change** in the engine and the generator, as a stage of their own
   with a rename map: `brand` to `primary`, `brand-alt` to `secondary`, `critical` to
   `error`, `positive` to `success`. `warning`, `info` and `neutral` stay. The public
   engine keeps its words.
5. **The end state is the system's own components on a substrate**; the thin package is
   the first state. The graduation trigger and the substrate are rulings for when the
   trigger fires.
6. **Native is designed for from the first stage and built second.** The component declaration is
   adapter-neutral from its first stage, the Tamagui map from the proof of concept is
   re-keyed onto it as the neutrality check, and the native package is a stage of its own
   with a trigger of its own.
7. **The generator is a package like the others**, under a root that holds only the
   workspace list, the shared gates and ownership. Outputs committed, versions in
   lockstep, the harness in the repository.
8. **Runtime theming is first-class**: one browser-safe entry in the tokens package,
   called by the build and by the provider, with a check that the build's output equals
   the runtime's for every declared brand.
9. **The generator writes variables, styles and a binding spec per component** into
   Figma. Components are hand-built to the spec and audited by the plugin. Drawing is
   generated later, as the declarations gain the non-color scales.
10. **Brands are never modes, and the library carries no brand.** The system has one set
    brand, the company's own. A client color is a declaration entry at build time, which
    yields that client's theme folder, or a seed at run time in the selling tool. Figma
    is a source of truth for design, and its contract with code is the names of the
    tokens and variables, every layer and every collection, never values. Theme
    extensions, a representative set of seeds, live in the Figma payload alone and never
    reach a token file, a theme folder or a package.
11. **The React package owns one MUI major** as a regular dependency. Products install
    none of MUI. A MUI major upgrade is the system's release. The major is the current
    one when stage 5 begins, recorded in the package, never on this page.
12. **Design owns the rules and engineering owns what ships.** Design: the declarations,
    the grammar, the engine, the emitters, the docs and the Figma payload. Engineering:
    the package code, the build tooling, CI, publishing, the harness's test
    infrastructure and the lint. Ownership is by folder. A declaration change merges on
    design's review when the gates pass; engineering reviews code that changes how a
    gate or a package works.

## What exists

- **The generator.** The declarations; `npm run generate`; `npm run audit`, which checks
  every name against the grammar, every token described, every alias resolving, every
  scale ascending, two builds identical and equal to the committed files; the theme
  folder per brand; the Figma payload and plugin; the pages. The rules by component for
  the library's components in `color-by-component.md` and for MUI's in
  `color-by-component-mui.md`: the shape of the component declaration, as prose.
- **The engine at its tag.** The solver, the requirements, the vocabulary, the documents
  renderer and the value gates. The cut imports nothing from Node. The generator's two
  file reads are build-time only: the plugin scripts inlined in `src/build.ts` and the
  version in `src/engine.ts`. The theme writer is pure.
- **The Tamagui proof of concept.** A theme map from Tamagui's theme keys onto the
  engine's names, with its decisions recorded: the second adapter, in proof form.
- **The family words.** One constant in the engine, `FAMILY` in `tokenNames.ts`, and one
  line in the generator, `FAMILY` in `grammar/words.ts`. Every emitted row is spelled
  from them.

What the work copy holds is found at stage 0, never assumed here.

## The stages

Each stage ends with what working looks like. A stage that cannot reach it stops and
says why; nothing is patched around.

**Stage 0, the comparison.** At work, before anything moves: compare "What exists"
against the work copy and list every difference; record the installed MUI major; list
what of each later stage already exists there, an adapter, a theme builder, a
rendered-color test, a live theming tool, and in what shape. The engine seam's
comparison is stage 1 of the merge page and runs with this one. Write the findings to a
`plan.md` outside the repository, print a summary of thirty lines or fewer, and stop.

**Stage 1, the engine merge.** `color-engine-merge.md`, by its own prompt, its stages as
written. Two of its open rulings are closed by this page: brands in Figma by ruling 10,
and the porting rule by stage 3's map. Working looks like: that page's conditions hold,
the engine is a workspace package the generator imports by its name, and `okchroma` is
gone from the lock file.

**Stage 2, the repository becomes packages.** The generator moves into `tokens/` beside
`engine/`; the root `package.json` holds the workspaces and the shared scripts and
nothing else; `docs/` moves to the root; an ownership file maps folders to owners by
ruling 12. Working looks like: `npm run generate` and `npm run audit` from the root
produce files byte-identical to the committed ones before the move; `npm run typecheck`
is clean; every path the docs and the README name resolves; the engine's gates run from
the root.

**Stage 3, the family words.** Ruling 4, after stage 1's proofs and never folded into
them. A map of the four words lives in the engine package as `engine/PORTING.md`,
together with the porting rule: a fix from the public engine is carried by hand, crosses
the map, and cites the public commit it came from. Working looks like: with the map
applied to the documents committed before the change, every engine document is
byte-identical; every semantic path is identical under the map; the audit is green; each
snapshot is re-blessed from a diff shown to be a pure rename; no old family word remains
in any output of the two packages; the rules by component and the compat map read the
new words.

**Stage 4, the component declaration.** Rulings 1, 3 and 6. A declaration
`tokens/declarations/components.ts`: for each component, its parts by variant and state,
each part the path of a semantic token or an explicit none, with what decided it carried as data;
MUI's variant words as the variant names, each mapped to a level. Its source is the two
rules-by-component pages, transcribed. A declaration per library holds the key column
only: `declarations/mui.ts` maps each declared part to the MUI component, slot and state
that reads it; `declarations/tamagui.ts` maps each declared part to the theme key the
proof of concept used, with nothing built behind it. The pages by component are then
generated from the declaration, one per component, and the prose pages keep the forks
and the tells. Working looks like: every component on the two prose pages has a record;
every path a record names exists in the roster; the audit holds totality, every part
mapped in every library declaration or marked none with a reason; the generated page per
component matches the prose pages row for row, shown once as a diff; for every declared
brand and mode, every part's text over its fill meets WCAG's minimum contrast for text
([Contrast (Minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum)).

**Stage 5, the React package, the adapter and the runtime entry.** Rulings 2, 3, 8 and
11. In `tokens/`, a browser-safe entry: a brand's elections or a seed in; the engine
documents, the resolved set, the CSS text and the theme options out; the build calls it
to write files. In `react/`: every MUI component re-exported unchanged; the provider,
which takes a brand key or a seed, applies the generated theme, sets the mode and brand
attributes and injects the variables when no stylesheet is loaded; the generated
adapter, theme options with a color scheme per mode and a style override per component,
variant and state written as a custom property reference from the declaration; the
backstop palette filled from the resolved values per mode, with the sentinel in every
other slot, over a slot list walked from the installed major and committed; the lint,
no MUI import in a product, no color literal, no color key in `sx`; the MUI major
recorded in the package. Working looks like: `npm run generate` writes the adapter;
every slot on the committed list is filled or sentinel; the runtime's CSS string equals
the built `variables.css` for every declared brand, byte for byte; the lint fails a
fixture carrying each forbidden thing and passes the harness; two builds identical;
`npm run typecheck` clean. The render-level proof lands at stage 6.

**Stage 6, the harness.** In `apps/reference/`: views that use every component in the
declaration in context, for every declared brand and both modes, switched by attribute;
the rendered-color test, which asserts that every rendered color is a token or a token
at a token opacity, that every text meets WCAG's minimum contrast for text, and that no
sentinel renders anywhere; the page the owner judges by eye, dark output on a dark
ground. Working looks like: the test passes for every declared brand, mode and view; a
component used without a declaration record fails the test; the lint passes the
harness.

**Stage 7, Figma.** Rulings 9 and 10. The payload gains the binding spec per component,
generated from the declaration: for each component, variant and state, the part and the
variable name it binds. The payload gains the theme extensions, a declared list of
representative seeds, each solved by the engine on the same run and emitted for the
library alone. The plugin gains the binding audit: it reads each component set's
bindings by variant and reports them against the spec, by name. The merge page's plugin
stage runs here, on a copy of a file, never the library, and its retirements run when
the new library starts. Working looks like: on a copy, every variable and style is
applied under the generator's identity tag; the spec is present per component; the
audit reports every hand-built component against the spec with no unexplained
difference; the audit's report is committed with the publish; no extension's name
appears under `dist/tokens`, under `dist/brands` or in any package, shown by a grep.

**Stage 8, publishing and the first adoption.** Rulings 7, 11 and 12. The registry and
the publishing mechanics are engineering's; versions in lockstep; a changelog per
release; the ownership file in force. The first product installs the React package,
removes its own MUI or moves it to the package's major first so the installer resolves
one copy, turns on the lint, and runs the rendered-color test in its own CI. Working
looks like: a tagged release publishes `tokens` and `react` at one version; the
product's installed tree holds one copy of MUI; the lint and the test run in the
product's CI; a declaration change merges on design's review with the gates green and
reaches the product as a version bump.

## Later stages, each on its trigger

- **Native.** Trigger: the platform team's readiness on Expo. `native/` holds the
  Tamagui adapter, generated from the component declaration through the key column of
  `declarations/tamagui.ts`, and the package; the roster starts at the proof's three
  components. Working looks like: a native app beside the harness renders the roster in
  both modes with every color a token, from the same declaration, with no second one.
- **Graduation.** Trigger: resources, or the first component where MUI's anatomy fights
  the system's language, a part the declaration needs that the MUI component has no
  slot for, or an opinion of MUI's the adapter cannot remove. First the substrate ruling:
  Base UI on the web with Tamagui on native, or Tamagui on both. Then, per component,
  the system's own component replaces the re-export behind the same import path and its
  adapter rows retire; the declaration, the audits, the Figma spec and the docs do not
  change. Working looks like, per component: the harness green with the re-export gone,
  the lint unchanged.
- **The non-color scales into the component declaration.** Spacing, shape, type and
  motion per component, as each scale's audit lands; then the plugin draws component
  skeletons from the declaration and the binding audit covers them. Working looks like:
  a skeleton drawn from the declaration binds every part to its declared variable.

## Open rulings

- The graduation trigger's wording and the substrate.
- The native trigger's wording, with the platform team.
- The registry and the publishing mechanics.
- The theme extensions' shape in the payload, a collection of their own or a group, and
  the first representative set.
- Which rows of the rules by component become generated pages at stage 4, and which
  stay as the forks and the tells.
- Rows still open in the rules by component: the avatar's family; selected text in
  navigation; a hierarchy for status chips; a categorical set for charts with several
  series; Button colors that differ from the Figma component; the typeface license.

## Traps

- Folding the family rename into the merge hides anything else that moved. Stage 3 is
  after stage 1's proofs for that reason.
- A declaration written from MUI's parts becomes Material's anatomy. The Tamagui key
  column at stage 4 is the check, so it is not optional.
- MUI's style overrides mangle a custom-property key written into a style object. The
  adapter reads a custom property and defines none; an application's own go in global
  styles.
- Two copies of MUI in one application mean two style caches and two theme contexts.
  Stage 8's alignment rule exists for that.
- MUI's palette derives its hover, light and dark by lightening and darkening with no
  contrast solved, and picks text by a threshold against `main`. Nothing visible is read
  from the palette; the sentinel is what shows a missed override.
- The slot list is per MUI major. A major without a re-walk leaves slots the sentinel
  never reached.
- The runtime path must read no file and no environment variable. The equality check at
  stage 5 is the only thing that keeps that true.
- The Figma binding audit cannot run in CI. Its committed report is the gate, and a
  publish without one is a finding.
- `theme-folder.ts` and the token files must never read the theme extensions. The grep
  at stage 7 is the proof.
- The merge page's own traps hold.
