# The MUI palette from the semantic set: the rulings, and how to build from them

Instructions for a coding agent working in a terminal in this repository, the token
generator, with read access to the application that will use MUI. You are already mapping
MUI onto the semantic set; this is a supplement to that work. `docs/mui-palette.md` carries
the owner's rulings on the slots that needed one, every slot of a stock MUI 9 theme to one
role, a gap, or a value left to MUI, plus the component overrides, each row with what
decided it. Fold the rulings into your mapping. Where your mapping and the page disagree,
list the row and both answers for the operator; do not resolve it yourself.

The page was written against another copy of this repository, and this copy has moved
since. Before you rely on a row, check that its role path or base-token path resolves in
`dist/tokens/` here; list any that do not, with the nearest existing name, and ask.

Read `CLAUDE.md` at the repository root and `docs/writing.md` first and work by them. The
operator starts you with "Follow this file, stage 1 only", reads what you report, and later
says "stage 2" and "stage 3". Do one stage per request and stop at the end of it.

## The recommended shape

- **Build in the generator, not in the application.** The mapping is a declaration,
  `declarations/mui.ts`, beside `compat.ts` and in its spirit: a name on the consumer's
  side to a role path here, or a ruling that it is not a token. The application receives
  a generated file and never holds a color of its own.
- **One generated theme file per brand**, in the brand's theme folder beside
  `variables.css` and `colors.ts`: an object MUI's `createTheme` accepts, with CSS
  variables on and a light and a dark color scheme. Each slot's value is the role's hex in
  that mode, resolved the way `colors.ts` resolves it, a pair folded to eight digits. Hex,
  not a `var()` reference, because MUI derives channel values from each palette color and
  cannot read a reference. The overrides are `components` entries reading the same
  resolved values. A gap holds the sentinel `#ff00ff`. A slot left to MUI is omitted.
- **The audit before the application.** Totality against a slot list generated once in
  the application and committed as `mapping/mui-slots.txt`, the way
  `mapping/unify-reads.txt` is committed; every path a token in `dist/tokens/`; no literal
  color in the generated file but the sentinel; a reads list from MUI's component source,
  committed as `mapping/mui-reads.txt`, with an override row for every component in it;
  and a pairing check, the WCAG ratio of every text-over-ground pairing the page proposes
  from the resolved hexes in both modes and every brand, 4.5 for text and 3 for a shape or
  an edge, the worst case printed per pairing.
- **The application last, and small.** One theme provider per brand, the generated file
  imported, MUI's color-scheme selector set to the same `data-mode` attribute the
  generated CSS already switches on, nothing themed by hand.
- **The engine's values stand.** One finding is open on the engine's side: the stamp's
  text over the dark hover and pressed fills of a family whose text is the white pole
  reads under the text bar, logged in the engine's ledger as C86. The mapping does not
  work around it, and a later engine patch changes nothing in the declaration.

## Rules for every stage

- Read-only on the application until stage 3. No commits without the operator's word, no
  pushes, no dependency installs in the application; if MUI 9 is not there, ask.
- Do not guess a role path, and do not resolve a disagreement with the page on your own.
- Every number you report comes from a script in the repository, never from reading by
  eye.
- Report in plain language: what you found, where, how many. No narrative of your steps.

## Stage 1: compare and plan. Change nothing.

Write to `plan.md` in a folder `mui-plan/` under the directory the operator started you
in, not in the repository:

1. **The differences.** Each row where the page and your mapping disagree, with both
   answers and the page's "decided by" column. Each path on the page that does not
   resolve here, with the nearest existing name.
2. **The shapes here.** How `declarations/compat.ts` declares a name, how
   `src/theme-folder.ts` writes a brand's files and folds a pair, and where the audit's
   checks live, so the declaration, the emitter and the checks follow them.
3. **The application.** Its MUI version (the page is written against 9; a lower major
   changes the component tokens and the traps), how it mounts its theme today, and which
   attribute switches its mode.
4. **The two lists.** A script in the application that builds a stock theme with CSS
   variables and both color schemes, walks both palettes to their leaves, drops the
   channel entries and prints one line per slot; and a grep over MUI's installed
   component source for reads of a color's `dark`, `light` and `contrastText`, of
   `action.disabled`, `action.disabledBackground`, `action.focus`, `text.disabled` and
   `common.white`, and of an alpha over `main`, one line per component and read.

Print a summary of `plan.md` of 30 lines or fewer and stop.

## Stage 2: the generator side. Only after the operator says so.

The declaration, the emitter, the two lists, the audit checks; `npm run generate`,
`npm run audit` and `npm run typecheck` green.

Working looks like: `dist/brands/<brand>/web/mui.ts` exists for every brand; its light
`palette.primary.main` equals the brand's `colors.ts` value for `color-fg-brand-accent` in
light, and its dark one the dark value; `palette.primary.light` and `.dark` equal `.main`;
every gap slot is `#ff00ff`; no slot left to MUI appears; `npm run audit` prints the slots
answered, the reads covered and the worst case per pairing, and fails on any slot
unanswered, path unresolved, read uncovered, literal, or pairing under its bar; two runs of
`npm run generate` produce identical files.

## Stage 3: the application. Only after the operator says so.

One provider per brand with the generated file, the color-scheme selector on `data-mode`,
and a test page with: Button in contained, outlined and text for every color and for
`inherit`; Fab; ButtonGroup contained; Chip clickable, deletable, a color and default;
Badge; Checkbox, Radio and Switch on and off; LinearProgress and CircularProgress; Alert in
standard, outlined and filled for every severity; Tooltip; Snackbar; Pagination; Tabs;
ToggleButton; Slider; a Link; a disabled control and a focused control; under each brand
and each mode.

Working looks like: no magenta anywhere on the test page in any brand or mode; a disabled
control shows its enabled colors at the disabled opacity; a focused control shows one ring
and no ground; a contained button's hover and pressed are the solid's steps; the dark page
is dark. Any magenta is a missed override: find the read in `mapping/mui-reads.txt`, add
the row to the declaration, regenerate. Never patch the application's CSS to hide it.

Traps in MUI 9 that have cost time before:

- `styleOverrides` mangles CSS custom-property keys in a style object; ship any component
  variables through `GlobalStyles`, scoped by MUI's color classes.
- Under CSS variables, `theme.palette` serves the light scheme; read `theme.vars`.
- MUI's own `applyStyles('dark')` blocks assume MUI's grey scale; with a scale that
  reverses by mode they double-invert, which is why every component token is written out
  and no dark block is added.
- A `'&&'` specificity boost beats `.Mui-disabled`; restate disabled inside every boosted
  block.
- The slot-variant `styleOverrides` keys of older majors, such as `containedPrimary`, are
  gone; use `root` with `ownerState`, or `variants`.
- MUI X ships its own field family, `MuiPickersOutlinedInput` among them; a date picker
  needs its own rows.
- The palette's multipliers, `hoverOpacity` and its siblings, are zero on purpose; a
  component that derives its own ground renders no feedback until its override row
  exists, which is the point.
