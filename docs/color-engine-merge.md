# One token engine: the color engine joins the generator

The plan for merging the color engine, today the pinned package `okchroma`, into this
generator, so that the generator and its Figma plugin are the whole token engine: one
`npm run generate`, one plugin, no package pinned. Written for the agent doing it and for
the owner's approval; nothing below moves until that approval. "The engine" is the color
engine; "the generator" is this repository; "the copy" is the engine's source as it comes
to live here.

## The end state

- The generator solves every brand's colors itself, from `declarations/brands.ts`, with
  the engine as a workspace package of its own inside this repository, which the
  generator depends on by the workspace link. `okchroma` is not a dependency, and the
  link is always the current source, so the generator and the engine cannot drift apart
  by a version.
- The boundary holds: the engine's gates, its ownership and its version sit on the
  package. It is publishable as it stands, so a product that must theme itself at run
  time can depend on the same code the generator does.
- The gates that guard the engine's values run as this repository's scripts, with their
  snapshots blessed at the copy as the baseline.
- The Figma plugin writes every row, the engine's included. No second plugin runs.
- Each engine document says which engine the values came from: the tag the copy was taken
  at, in place of an installed package's version.
- The engine stays its own public project. The two diverge from the copy, and a fix made
  in one reaches the other only by a deliberate port.

## The seam, as it is

- `src/engine.ts` imports `resolveTheme`, `themeTokens` and `tokensToDtcg` from
  `okchroma`, and `declarations/brands.ts` imports the types `NeutralLevel` and
  `SecondaryStyle`. Nothing else in the generator reads the package. The adapter solves a
  brand from its declaration and renders one document per theme context under the `color`
  group, stamped with the version read from `node_modules/okchroma/package.json`.
- `declarations/collections.ts` declares the theme collection with `external: 'engine'`:
  the engine's rows belong to another writer.
- `scripts/figma/apply.js` finds an external row by name, tags it so aliases resolve, and
  never creates or writes it. Today the engine's own plugin writes those rows first.
- The Figma payload is built for the default brand; a second brand is a second build and
  a second file.

## What moves

From the engine's repository at the tag `v0.9.1`, into a workspace package at the root of
this repository, `engine/`, with its own `package.json` under a name the team chooses,
listed in the root `package.json` under `workspaces`.

The solver and its vocabulary, `src/engine/` there:

| Part | Files |
| --- | --- |
| the public functions the adapter calls | `resolve.ts`, `tokensRender.ts`, `dtcgRender.ts` |
| the solver | `colorEngine.ts`, `colorMath.ts`, `archetypes.ts`, `constraints.ts`, `neutralCurve.ts`, `darkChromaCurve.ts`, `perceptualL.ts`, `p2.ts`, `signals.ts`, `signalShift.ts`, `collision.ts`, `alphaPapers.ts` |
| the requirements | `requirements/spec.ts`, `requirements/profiles.ts`, `requirements/producers.ts`, `requirements/resolve.ts` |
| the vocabulary | `tokenNames.ts`, `tokenDescriptions.ts`, `stopTable.ts` |

The gates that read the solver's values, `scripts/` there, each with its snapshot where
it has one: `reqtoken-audit.ts`, `guarantee-audit.ts`, `band-audit.ts`,
`divergence-audit.ts`, `smoothness-audit.ts`, `dark-audit.ts`, `alpha-audit.ts`,
`secondary-audit.ts`, and `fixture.ts`, which they share. Four more gates there,
`desc-audit.ts`, `name-lint.ts`, `tokens-audit.ts` and `register-audit.ts`, are
classified in stage 1 by what they import: one that reads only the solver moves, one that
reads an emitter that stays does not.

## What stays with the engine

Its own CSS and Figma renderers, `cssRender.ts` and `figmaRender.ts`, because the
generator has its own; `src/build.ts`, `src/index.ts` and the npm packaging; the demo
and the docs site; the community plugin, the extended plugin and the Mapper; the gates
that read those, `cta-apca-audit.ts`, `ext-override-audit.ts`, `figma-verify.ts`,
`lib-audit.ts`, `docs-lint.ts`, `dtcg-emit.ts`; the research folder.

## The APCA ruling

The engine has two contrast profiles. The WCAG profile is the one every brand here is
solved under (`PROFILE` in `declarations/brands.ts`), and inside it the stamp text is held
to the ratio and to an APCA legibility clearance on top. The APCA profile is a second
lane where APCA is the law. The owner rules: the APCA profile goes from the copy and the
legibility read stays. In the code: `ContrastProfile` narrows to the one value,
`withProfile` and the profile's branches in the solver go, `cta-apca-audit.ts` stays
behind; the clearance on the on-fill requirement (`coEnforceLc` in
`requirements/profiles.ts`) and the APCA math it reads remain. Proof: the WCAG documents
for every brand byte-identical before and after the removal.

## The plugin

The generator's plugin becomes the one writer. `declarations/collections.ts` stops
declaring an external writer for the theme collection; `src/figma.ts` emits the engine's
rows with their values per mode, which the engine documents already hold, the way it
emits the planes; `scripts/figma/apply.js` creates and writes them under the generator's
own identity tag, descriptions and code syntax, and the branch that found another
writer's rows by name goes; `scripts/figma/audit.js` stops expecting another writer. The
extended plugin is not run against a file this plugin writes, and the Mapper has no job
in a new library.

## The owner's rulings

- The cut is the two lists above: the solver, its vocabulary, the documents renderer and
  the value gates move; the renderers, the plugins, the demo and the packaging stay.
- The APCA profile goes; the legibility read on the stamps stays.
- The hand-off travels in a public throwaway repository holding the copy, this page and
  its prompt; the work session pulls it, and the owner deletes it after.
- Nothing moves until approval.
- A new Figma library is likely. When it starts, the migration machinery retires: the
  rename map in `declarations/renames.ts`, the in-place rename in the plugin, the Mapper.
  `declarations/compat.ts` stays as long as the code reads those names.

Open, for the owner when the work starts:

- Brands in Figma: one file per brand, as the payload is built today, or brands as modes
  of the theme collection, which the engine documents already allow.
- The porting rule between the two engines: a fix carried across by hand with a commit
  reference, or none.

## The sequence

Each stage ends with what working looks like. A stage that cannot reach it stops and
says why; nothing is patched around.

**Stage 0, before the hand-off.** The throwaway repository holds the files listed under
"What moves" exactly as `git ls-tree v0.9.1` has them, with a `VERSION` file naming the
tag and its commit, this page and `prompts/color-engine-merge.md`. A grep over it for the
company's name and its prefixes finds nothing.

**Stage 1, at work, change nothing.** Compare: this page's seam against the generator
here (`src/engine.ts`, `declarations/collections.ts`, `scripts/figma/apply.js`), listing
any difference; the installed package's version against the tag; the four unclassified
gates by their imports. Write the findings to a `plan.md` outside the repository, print a
summary of thirty lines or fewer, and stop.

**Stage 2, the copy behind the seam.** The files land in the workspace package; the root
`package.json` lists it under `workspaces`; `src/engine.ts` and `declarations/brands.ts`
import it by its package name; the package's `package.json` carries the tag as its
version and its `VERSION` file names the commit; `engineVersion()` reads the package's
version. Working looks like: `npm run generate` writes
`dist/tokens/engine.<brand>.<mode>.tokens.json` for every brand byte-identical to the
files committed before the change, with the version line the only difference; two runs
produce identical files; `npm run typecheck` is clean; `npm ls` shows the package linked
from the workspace and `okchroma` gone from `package.json` and `package-lock.json`.

**Stage 3, the gates inside.** The value gates run as the package's own scripts under
this repository's runtime, invoked from the root, with their snapshots blessed at the
copy and the diff of each bless shown before it is taken. Working looks like: every gate green; a file the runtime refuses is
named, not rewritten.

**Stage 4, the APCA profile out.** As the ruling says. Working looks like: the WCAG
documents byte-identical to stage 2's, the gates green, no `apca` left in the copy but
the clearance on the stamp text.

**Stage 5, one plugin.** As "The plugin" says, proven on a copy of a Figma file, never
the library: the theme collection holds every engine row in both modes under the
generator's tag, every palette alias resolves, no second plugin was run,
`scripts/figma/audit.js` is green.

**Stage 6, when the new library starts.** The retirements under the rulings, each a
deletion with the audit green after it.

## Traps

- The engine's plugin tags a row with its own identity key. In a file it has written, the
  generator's plugin would find those rows by name and the two tags would coexist; a new
  library has none of them, which is one reason the retirements wait for it.
- `engineVersion()` reads the installed package's `package.json` under `node_modules`;
  after stage 2 it reads the workspace package's instead, and the path it used is gone.
- Removing the APCA profile must leave the clearance on the stamp text and the math it
  reads; the byte-identity proof is what shows nothing else moved.
- The engine runs its gate scripts through a bundler; this repository runs TypeScript
  directly with types stripped, which refuses a few constructs. Stage 3 names a refused
  file rather than rewriting it.
- The snapshots are tied to the seeds in `fixture.ts`; carry it with them, and bless at
  the copy, never at a later change.
- The payload is built for the default brand. Adding a brand to Figma is a payload and
  plugin choice, not an engine one, and waits on the open ruling.
