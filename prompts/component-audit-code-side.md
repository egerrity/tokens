# Component audit, code side: what the library exports and how the products use it

Instructions for a coding agent working in a terminal with read access to the component
library and the product code. The operator starts you with "Follow this file, stage 1
only", reads what you report, and later says "stage 2". Do one stage per request and stop
at the end of it.

## What this is for

The component library is being curated: every component will be marked stays, goes or
merges. The people deciding need usage facts from the code, one row per component: where
it is used, how, how often, and how often product code works around it.

You produce the facts. You do not recommend which components to keep, and you do not
change any product or library code.

## Rules for both stages

- Read-only on every repository. Write only inside the output folder, which is
  `component-audit/` under the directory the operator started you in, unless they name
  another. Create it if missing.
- No commits, no pushes, no branches, no pull requests, no dependency installs inside a
  product repository, no network calls with any content from the code.
- Do not guess. Where you cannot tell, say so and ask.
- Report in plain language: what you found, where, how many. No narrative of your steps.
- Every number must be reproducible: it comes from a script in the output folder, never
  from reading files by eye.

## Stage 1: look and plan. Change nothing.

Find out, and write to `component-audit/plan.md`:

1. **Scope.** The component library package or packages, and every product application
   that could import from them. List each with its path and what it is. Ask the operator
   to confirm the list and add what you cannot see.
2. **What the library exports.** The public entry points and the list of exported
   components, with the file each comes from. Separate components from hooks, helpers,
   types and icons. Note anything exported under two names.
3. **How products import it.** The import paths in use (package root, deep paths, local
   re-exports, wrappers a product defines around a library component). A wrapper is
   reported as its own thing, with the component it wraps.
4. **Other component sources.** Any second library, older design system or product-local
   component folder that provides the same kind of component, with a count of what it
   holds.
5. **What already exists to measure quality.** Unit tests, component stories, visual or
   end-to-end tests, accessibility lint rules or test runs, and how each is run. Say
   which can be run here without changing anything, and which cannot.
6. **How you would extract usage**, and what each approach cannot see (components chosen
   at run time, props passed through a spread, usage inside generated code). Name the
   blind spots; do not hide them.
7. **The script.** Language and runtime already available on this machine. Reading props
   needs a real parser, not text matching: say which parser is already present in the
   repositories and can be used without installing anything.

Then print a summary of `plan.md` of 30 lines or fewer and stop. Do not write the scan
script yet.

## Stage 2: run and report. Only after the operator says so.

Write the scan script into `component-audit/`, run it, and produce the files below. The
script is deterministic: the same code produces the same files, rows sorted, no
timestamps inside them.

### What to measure, per exported component

- **Imports:** the number of files that import it, and the number of places it is
  rendered, per product application. Tests and stories counted separately.
- **Props passed:** for each prop, how many usages pass it and the distinct literal
  values passed, with counts. Usages that pass props through a spread are counted and
  flagged, since their props cannot be read.
- **Props never passed:** props the component declares that no product usage passes.
- **Overrides beside the component:** usages that also pass a class name, an inline
  style, or a styling escape prop, and usages wrapped in an element that exists only to
  restyle it. This is the bypass count. Record what the override sets (color, spacing,
  size, type, other) where it can be read.
- **Rebuilt by hand:** places where a product renders a raw element for something the
  library has a component for (for example a raw button or input with its own styling).
  Count these per library component they stand in for. State the rule you used to match.
- **Quality signals that already exist:** whether the component has unit tests, stories,
  and accessibility checks, and the result of any that stage 1 found runnable. Do not
  write new tests.

### Files to produce

- `components.csv`: one row per exported component. Columns: name, source file, files
  importing it, places rendered, applications using it, usages with spread props,
  usages with an override, share of usages with an override, raw stand-ins found, has
  unit tests, has stories, has accessibility checks, declared props, props never passed.
  Components with no usage are listed, not dropped.
- `props.csv`: one row per component, prop and distinct value. Columns: component, prop,
  value as written (or "expression" when it is not a literal), usages.
- `overrides.csv`: one row per override found. Columns: component, file, line, kind
  (class name, inline style, escape prop, wrapper), what it sets.
- `other-sources.csv`: one row per component found outside the library (second library,
  product-local), with its usage count and the library component it overlaps, if any.
- `samples.md`: for each of the ten most used components, five usages picked by a fixed
  rule (every nth), each with file path, line number and the lines themselves, so a
  person can check the extraction by hand.
- `summary.md`: one page.
  - Totals: components exported, components used, components unused, total usages,
    share of usages with an override, raw stand-ins found.
  - One table of the twenty most used components with their override share.
  - One list: the components with the highest override share, and what the overrides
    set most often.
  - One list: unused components.
  - One paragraph: what exists outside the library, from `other-sources.csv`.
  - One list: what the scan could not see, from stage 1, point 6, with an estimate of how
    much usage that is.
  - No recommendation and no verdict.

### Before you report

- Run the script twice and confirm the output files are identical.
- Check the totals in `summary.md` against direct counts from `components.csv`.
- Open three usages from `samples.md` yourself and confirm the props and overrides
  recorded match the lines.

Then print `summary.md` and the path of the output folder, and stop. If a check fails,
say which and what the difference is.
