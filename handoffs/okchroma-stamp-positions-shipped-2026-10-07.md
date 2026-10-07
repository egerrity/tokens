# Hand-back from the color engine: the positions shipped as okchroma 0.9.0

For the token generator's session, from the engine's session (okchroma). Answers the
handoff `okchroma-stamp-positions-2026-10-07.md`. The engine's code is its source of
truth; the record of the round is `docs/engine-spec/CATALOG.md` C84 and `CHANGELOG.md`
0.9.0 in the engine's repo.

## What shipped

okchroma 0.9.0 is on npm (published 2026-10-07 UTC) and the site and the extended plugin
zip are deployed from `main` at d3a7a52. Every emitted row is a group and one word, the
word a position. No value moved: against the 0.8.2 baseline, 183 cases through the real
pipeline show zero value differences in the CSS, the Figma tree, the DTCG documents and
the extended plugin's payload once the old names are mapped.

| Figma and token file | CSS |
| --- | --- |
| `color/<family>/stamp-0` | `--<family>-stamp-0` |
| `color/<family>/stamp-1` | `--<family>-stamp-1` |
| `color/<family>/stamp-2` | `--<family>-stamp-2` |
| `color/<family>/stamp-edge` | `--<family>-stamp-edge` (unchanged) |
| `color/<family>/stamp-on` | `--<family>-stamp-on` (unchanged) |
| `color/link/default-0`, `default-1`, `default-2` | `--link-default-0`, `-1`, `-2` |
| `color/link/inverse-0`, `inverse-1`, `inverse-2` | `--link-inverse-0`, `-1`, `-2` |

The `stamp/`, `link/default/` and `link/inverse/` groups are gone. The seven families
are `neutral`, `brand`, `brand-alt`, `critical`, `warning`, `positive`, `info`; the
`color` group is the extended plugin's and the token file's when emitted with
`rootGroup: 'color'`; the CSS never carries it. A DTCG alias to a stamp row reads
`{color.brand.stamp-0}`. The absolutes are unchanged.

## What the generator does now (its own list from the handoff, with the specifics)

1. `src/derive-color.ts`: the stamp leaves (`stamp/fill`, `stamp/fill-hover`,
   `stamp/fill-pressed`, `stamp/edge`, `stamp/on`) become `stamp-0`, `stamp-1`,
   `stamp-2`, `stamp-edge`, `stamp-on`, one segment each; the `LINK` path builder
   becomes `['color', 'link', `${posture}-${step}`]` with steps 0, 1, 2. The semantic
   mapping the handoff stated stands: `bg/<family>/solid/enabled` aliases `stamp-0`,
   `hover` aliases `stamp-1`, `pressed` aliases `stamp-2`; `border/<family>/solid`
   aliases `stamp-edge`; `fg/<family>/on-solid` aliases `stamp-on`; `fg/link/<state>`
   aliases `link/default-<n>`; `fg/on-inverse/link/<state>` aliases `link/inverse-<n>`.
2. Re-emit `dist/tokens/engine.*.tokens.json` for the sample seed (`npm run generate`).
   If the generator emits through the package rather than its own literals, take 0.9.0:
   `STAMP_FILL`, `STAMP_FILL_HOVER`, `STAMP_FILL_PRESSED` keep their names and now hold
   `stamp-0`, `stamp-1`, `stamp-2`; `linkPath(posture, state)` returns
   `['link', 'default-1']`; `LINK_STEP` (enabled 0, hover 1, pressed 2) and
   `linkLeaf(posture, state)` are new; `familyPath` returns `[family, leaf]`.
   `STAMP_STATE_LEAVES` and `STAMP_LEAF` are removed with no replacement, because no
   output nests the stamp any more.
3. The order on a Figma file: the engine's extended plugin first, then the generator's
   apply. The engine's plugin renames the eleven rows per family in place on its next
   apply (same variable ids, bindings and brand overrides kept; a row renamed by hand
   keeps its name while its identity moves), and the identity it stamps on each row,
   both the private key and the shared `okchroma` / `okchroma-ext-path` key, carries the
   new path after that apply. A generator that finds engine rows by name sees the new
   names only after the engine's plugin has run; before it, the old names. The owner
   checked the migration on a copy of a work file.
4. Descriptions: the engine's rows say the position ("CTAs, the fill one step from
   rest"; "links, one step from rest") and never a state; the state words belong to the
   consumer's rows, as the handoff said. No digit appears in a body line (Figma's picker
   search rule), so a consumer body that must say a step says it in words.

## Not changed, on purpose

- The community plugin's hidden link primitives keep `link`, `link-hover`,
  `link-pressed`; they are unbound and never an emitted name.
- `research/` keeps the old spellings as history.

## The prompt

> Read `~/tokens/handoffs/okchroma-stamp-positions-shipped-2026-10-07.md`: okchroma 0.9.0
> emits the stamp and link rows as positions (`color/<family>/stamp-0|1|2|stamp-edge|stamp-on`,
> `color/link/default-0|1|2`, `color/link/inverse-0|1|2`), with the extended plugin
> migrating a file in place on its next apply. Update `src/derive-color.ts` to the new
> words, re-emit the engine token files for the sample seed, and keep the apply order:
> the engine's plugin first, then ours.
