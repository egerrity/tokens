# Handoff to the color engine: every engine row is a position

For the session working in the engine's repo (okchroma), from the token generator's
session. The decision is the owner's, 2026-10-07. The engine's code is its source of
truth; what is written here about its files is what this side saw, to be verified there.

## The decision

The engine emits no state words. Every row it writes has one shape, `color/<family>/<word>`,
and the word is a position: a band at a lightness (`pen-70`, `paper-1`), the stamp at a
step, a link at a step. The states are the consumer's to name, in its semantic layer.

Two groups change, eleven rows per family that has them:

| Today (Figma and token file) | New |
| --- | --- |
| `<family>/stamp/fill` | `<family>/stamp-0` |
| `<family>/stamp/fill-hover` | `<family>/stamp-1` |
| `<family>/stamp/fill-pressed` | `<family>/stamp-2` |
| `<family>/stamp/edge` | `<family>/stamp-edge` |
| `<family>/stamp/on` | `<family>/stamp-on` |
| `link/default/enabled` | `link/default-0` |
| `link/default/hover` | `link/default-1` |
| `link/default/pressed` | `link/default-2` |
| `link/inverse/enabled` | `link/inverse-0` |
| `link/inverse/hover` | `link/inverse-1` |
| `link/inverse/pressed` | `link/inverse-2` |

The `stamp/`, `link/default/` and `link/inverse/` groups go; the rows sit flat in their
family beside the bands. The CSS body joins the same way it does today
(`--<prefix>-color-brand-stamp-1`, `--<prefix>-color-link-inverse-2`).

Unchanged, by the owner's call: the seed absolutes, `absolute/brand` and
`absolute/brand-alt`. They are the record of the hex that was given, reference values
and never UI colors, and they already fit the shape.

## Why

- The consumer grammar's rule for a primitive: its last segment is a position. A state
  as a segment of its own belongs to the semantic layer, where the consumer names it and
  publishes it: `bg/<family>/solid/enabled` aliases `stamp-0`, `hover` aliases `stamp-1`,
  `pressed` aliases `stamp-2`; `border/<family>/solid` aliases `stamp-edge`;
  `fg/<family>/on-solid` aliases `stamp-on`; `fg/link/<state>` aliases `link/default-<n>`;
  `fg/on-inverse/link/<state>` aliases `link/inverse-<n>`. Numbers in the hidden primitive,
  words in the picked row.
- It is honest to the engine's math, for both groups. The stamp's fill states ride one
  rule with one apparent step per state; the link trios ride `hoverL` and `pressedL`,
  where pressed is hover's direction doubled, continuing past hover and never crossing
  back (`src/engine/archetypes.ts`). Rest, hover and pressed are steps 0, 1 and 2 of one
  progression in each case.
- With these two groups flat, the engine has one rule to state and one shape for a
  consumer to parse: family, then one word.

## Not these

- Not `color/bg/<family>/stamp/…`: that writes into the consumer's property-first groups
  (`color/bg`, `color/border`, `color/fg`), which the consumer owns. The boundary stays
  one clause: the engine owns `color/<family>/*` and nothing else starts with a family
  word.
- Not `stamp/0` or `default/0`: a row named `0` reads only inside its folder, a numeric
  key in the token file is reordered by JavaScript objects, and a one-digit number
  collides with the consumer's step rule (three digits). A band is one word, `paper-1`;
  the stamp is one word, `stamp-1`; a link posture is one word, `default-1`.
- Not `paper/1`: the bands stay as they are, for the same reasons.

## What it touches, as seen from here

- `src/engine/tokenNames.ts`: `STAMP_FILL`, `STAMP_FILL_HOVER`, `STAMP_FILL_PRESSED`,
  `STAMP_EDGE`, `STAMP_ON`, and the `STAMP_STATE_LEAVES` table that today nests the flat
  identity under `stamp/` for Figma and the token file; the new spelling is flat on both
  sides, so the table becomes an identity map or goes. `STAMP_LEAF`. For the links,
  `LINK_POSTURES`, `LINK_STATES` and `linkPath`, which today builds `[link, posture,
  state]` and becomes `[link, posture-step]`. Then whatever imports these: figmaRender,
  both plugins, figma-verify, tokenDescriptions.
- The descriptions: say what each position is, not a state ("the stamp at rest", "one
  step from rest", "two steps from rest"; the same for a link posture). The consumer's
  descriptions carry the state words.
- The Figma plugin's in-place migration: the precedent is the `base/` to `color/` move,
  found by the identity the plugin stamps on each row and renamed in place, so bindings
  survive. The same for these eleven rows per family.
- The CSS emit and the changelog: the renames listed, per family; the precedent is the
  eight renames of the primitives-only cut. A rename is a breaking change for CSS
  consumers; the version follows the repo's policy.
- The decisions record, the docs and the demo site where they show the stamp and link
  names.

## Downstream, in the token generator (not this session's work)

After the engine ships and its plugin has migrated the owner's file:

1. `src/derive-color.ts`: the stamp leaves at lines 97 to 100 (`stamp/fill`,
   `stamp/fill-hover`, `stamp/fill-pressed`, `stamp/edge`, `stamp/on`) and the `LINK`
   path builder at line 14 (`['color', 'link', posture, state]`) change to the new words.
2. `dist/tokens/engine.*.tokens.json` is re-emitted for the sample seed; `npm run generate`.
3. The generator's apply finds engine rows by name and never writes them, so the engine's
   plugin runs on the file first, then the generator's.

## Rules that hold in the engine's repo

The code is the source of truth; a comment is a present-tense claim, never dated (history
goes to the changelog and the decisions record); commit only on the owner's word; the
publish is hers.

## The prompt

> Read `~/tokens/handoffs/okchroma-stamp-positions-2026-10-07.md` and carry it out: the
> engine emits no state words. The five stamp rows per family become `stamp-0`, `stamp-1`,
> `stamp-2`, `stamp-edge`, `stamp-on`, and the six link rows become `default-0|1|2` and
> `inverse-0|1|2`, all flat under their family; the absolutes stay. The plugin migrates
> files in place, the CSS renames go in the changelog, and the decision gets an entry.
> Verify every file the handoff names against the code before changing it. Show me the
> diff before committing.
