# The generator: plan

A plan to approve, not a build. It answers the brief in `handoffs/` with what the
generator is, where its files go, how it works, and in what order it gets built. Nothing
is built until the owner says yes.

## What it is

A small TypeScript program in this repo. A designer edits a declaration, which holds only
decisions. The program derives every token from the declarations, writes the token files,
and checks them. The same declarations always produce the same files, byte for byte.

It covers every group that is not a generated color: space, size, radius, border width,
opacity, motion, breakpoints, the grid, typography, shadow, and the color roles built on
the color engine's output. The color engine stays separate and writes its own files; the
two sets join through one resolver document.

## What carries over from the color engine

The color engine's shape is declare, derive, emit, audit, document. Four things transfer:

- **A roster.** One function lists every token path the program emits. The emitters and
  the audit both read it, so a token cannot appear in one output and not another.
- **One grammar.** A token has one path; every spelling is derived from it.
- **Descriptions from one table.** The text on a token is rendered from data, in two
  forms: the full one in the token file and a terse one for Figma.
- **An audit that fails the build**, listing the worst case first, plus an independent
  parser as a second opinion.

The color math, the contrast solving and the per-brand postures do not transfer.

## Where the files go

```
declarations/     one file per group: the decisions a designer edits
grammar/          the closed word lists and the path rules
src/              the program: types, derive, describe, emit, audit
scripts/          the commands
dist/tokens/      the generated token files and the resolver document
dist/figma/       the generated Figma import files
docs/groups/      one generated page per group: what is decided, what is derived
```

## The declarations: what is decided, what is derived

| Group | A designer decides | The program derives |
| --- | --- | --- |
| space | the base unit; the list of steps in base units; which steps get a negative; the semantic rows (gap or padding, where, density, which step) | step names and pixel values; the negative steps; aliases; descriptions |
| size | the list of steps; the semantic rows (icon, control, content) | names, values, aliases, descriptions |
| radius, border width | the list of steps; the use text per step | names, values, descriptions |
| opacity | the list of steps; the disabled value | names, values |
| motion | the four curves; the durations; each transition as one curve with one duration | names; the transition tokens |
| breakpoint, grid | the five widths; the grid's columns, margin and gutter per layout range | names; one grid file per layout range |
| typography | families with fallbacks; weights; the size steps; line heights; each text style as a role and a size with its weight, line height and letter spacing in percent; each style's size per viewport | the font scale; the text style tokens; one file per viewport; letter spacing as a length per style and viewport. A user's text-size setting is left to the operating system, which scales from the base size |
| shadow | each level's layers (offset, blur, spread); the opacity step per mode | the shadow tokens, one file per mode |
| color roles | which roles exist per family; the opacity step per role and state; the scrim; the elevation surfaces | each role as an alias to the engine's color, and each translucent role as a pair: the solid alias plus a semantic opacity token. The generator never composes the two; Figma and the code pipeline do |

A value that cannot be derived from a decision is a decision and sits in the declaration.

## Descriptions

Every token gets one, and the audit fails without it. Until the content template exists,
the form is the two lines of the color file's grammar that apply to a non-color token:

```
Req for: <what the token is for; documented uses only>
Use: <for what; not for what; always with what>
```

A scale step with no documented use gets its text from the group's rule. A semantic token
lists the cases it covers. The Figma form drops digits and other tokens' names, because
Figma's variable picker searches descriptions.

## What it writes

- **Token files** in the Design Tokens format, one per Figma collection and context, named
  `<collection>.<context>.tokens.json`. A collection with one context writes one file.
- **A resolver document** that joins these files with the color engine's files.
- **A Figma payload**, the same tokens with the terse descriptions, each carrying its
  path and today's name. A script applies it: it finds each variable by its ID stamp, or
  by today's name where no stamp exists yet, renames it in place and stamps it. Bindings
  survive because the variable is never recreated.
- **One page per group** saying what is decided and what is derived.

Token types: a length for space, size, radius, border width, breakpoints, font size and
letter spacing; a number for opacity, line height and grid columns; the format's own
types for font family, font weight, duration and curve; the composite types for a text
style, a transition and a shadow.

The generated files are committed. A change to a declaration shows up as a readable
change to the output, and the work machine uses the files without running anything.

## The audit

It fails on any of these:

- a declared token missing, or appearing twice, or a token nobody declared;
- a name with a word outside the grammar's lists, or two paths that join to the same CSS
  name, or a path that is both a token and a group;
- a path that collides with the color engine's roster;
- a token without a description;
- a scale that does not ascend, or holds the same value twice, or a step whose name does
  not match its value;
- a negative step that does not mirror its positive step;
- an alias that does not resolve in the joined set, or a cycle;
- two contexts of one collection holding different paths;
- a value outside its type's rules (a curve outside its bounds, a weight out of range, an
  opacity outside 0 to 1, a duration outside the declared bounds, breakpoints not
  ascending);
- a file that changes when generated twice.

Then Terrazzo's checker, run from here, as the independent parser.

## Commands

`npm run generate` writes everything, `npm run audit` checks it, `npm run check` runs the
independent parser, `npm run merge` writes the resolver document. A file holds a whole
collection, so there is no command per group: one run takes a moment and rewrites only
what changed.

## Build order

1. **The unmoded groups.** The grammar's word lists, the roster, the description
   rendering, the token file emit and the audit, proven on space, size, radius, border
   width, opacity, motion and breakpoints. Done means: those files exist with a
   description on every token, the audit passes, the independent parser accepts them, and
   a second run changes nothing.
2. **The groups with contexts.** Typography and the grid across the four viewports,
   then the Figma payload and the script that applies it by stamp, including the text
   styles bound to the typography variables. Built and dry-run in a Figma file: every
   variable and style created, bound and stamped, and a second run changes nothing.
3. **The groups that read color.** Shadow, the scrim, the elevation surfaces and the
   color roles, with the merge, and the shadow effect styles in Figma. A translucent
   role is emitted as its pair, a color alias and an opacity token, because neither the
   token format nor the plugin API can write a composed color; the script writes the
   pair and names what to compose in the row's description, and leaves a row alone once
   it has been composed by hand. The color half is built: the surfaces, the scrim and
   the semantic set in `docs/color-semantic-set.md`, as aliases onto the engine's rows
   (`color/…`, 0.8.0), printed with the engine's two modes into a review file. Shadow
   and the effect styles remain.

Each step ends with a stop for the owner's review.

## Not in this build, and one rule

- A CSS file. How the token file reaches web and native is engineering's decision.
- The old-to-new map for names in the product code. It needs the code-side audit.
- Nothing in Figma is made by hand. Text styles and effect styles are not variables, but
  they are built from them, so the script that applies the Figma payload also creates
  each text style and each shadow's effect style, binds each property to its variable,
  and updates an existing style in place so layers keep it.

## To decide before building

1. **Declarations as TypeScript data files.** Recommended over JSON: the word lists are
   checked as the designer types, and a decision can carry a comment saying why.
2. **Lengths in px in the token file.** Recommended: the scale is defined in pixels and
   Figma takes pixels. Conversion to rem belongs to the pipeline that writes CSS.
3. **Collection names.** The program reads them from one config file. `theme` and
   `palette` are the owner's; `viewport`, `scale` and `motion` are placeholders pending
   the team's review.
4. **The description form.** The two lines above until the content template exists.
5. **The Node version on the work machine.** It matters only if the generator is run
   there. With the generated files committed, it does not have to be.
