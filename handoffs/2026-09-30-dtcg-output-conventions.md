# Hand-off: how the color token file is organized, for the sibling generator

One-way. Read it, build to it, no report back. It describes the DTCG output okchroma 0.7.0
ships, so a second generator (typography, radius, space, size, motion) emits the same
shape and the merged contract document has one dialect. Where this page and the okchroma
code disagree, the code wins: `src/engine/dtcgRender.ts` (the emitter),
`src/engine/tokenDescriptions.ts` (the description text), `scripts/dtcg-audit.ts` (the
gate), `docs/schema.md` (the reference). All in `~/okchroma`.

## Two corrections to the generator brief

- okchroma emits color primitives only, as of 0.7.0 (its CATALOG C68): the seven color
  families, the neutral's two poles, two link trios, the two brand seeds. It no longer
  emits opacity, elevation, shadow, planes, or any state layer. The brief lists opacity,
  elevation and shadow as out of scope "because okchroma already emits them"; that premise
  is gone. Those groups need an owner, and it is either this generator or a hand-authored
  semantic file. The values that shipped until 0.6.1, with the reasoning, are recorded in
  `~/okchroma/research/semantic-layer/README.md`; the demo's own stylesheet
  `~/okchroma/demo/semantic.css` is a worked example of the layer built on the primitives.
- The brief points at `src/engine/requirements/dtcg.ts` as the DTCG emit. That was an
  experiment whose values were not the shipped values; it now lives in
  `~/okchroma/research/reqtoken/` and is not the pattern. The shipped emitter is
  `src/engine/dtcgRender.ts`, about 120 lines. The earlier hand-off
  `2026-09-30-dtcg-contract-emit.md` is superseded by this page.

## The file

- Format: the Design Tokens Format Module 2025.10 with its Color Module, from the Design
  Tokens Community Group. A Community Group report, not a W3C Standard; say "DTCG" or "the
  Design Tokens format". File extension `.tokens.json`, media type
  `application/design-tokens+json`.
- One document per mode for color, `<slug>.light.tokens.json` and `<slug>.dark.tokens.json`,
  on identical paths. A group that does not theme emits one document, `<group>.tokens.json`.
- The document root holds groups only. No `$schema`, `$description` or `$extensions` at
  the root: the Format Module shows none there.
- Every token has exactly `$type`, `$value`, `$description`. Nothing carries `$extensions`.
  Nothing carries `$deprecated` today because no emitted name replaces an old one; when one
  does, the old name stays as a token with `$deprecated: "replaced by {group.new-name}"`
  (the field takes `true` or a string) and its `$value` an alias to the new one.
- Pretty-printed JSON, two-space indent, one trailing newline, keys in emission order.
  Deterministic: the same input produces the same bytes.

## Names and paths

- One grammar, every output. A token has one path: `brand/stamp/fill`,
  `neutral/paper-0`, `link/default/enabled`, `absolute/brand`. Joined with hyphens it is
  the CSS custom property (`--brand-stamp-fill`); joined with slashes it is the Figma
  variable; in a DTCG alias it is dot-joined (`{brand.stamp.fill}`). The sibling's groups
  must satisfy the same rule: the path decides every spelling, nothing spells a name by hand.
- A name is lower-case words and digits joined by hyphens. The spec forbids a leading `$`
  and any `.`, `{` or `}`. Names are case sensitive; never make two that differ only by case.
- The color file's top-level groups, which the sibling must not reuse: `neutral`,
  `brand`, `brand-alt`, `critical`, `warning`, `positive`, `info`, `link`, `absolute`.
- Group depth: family, then leaf, with one nested state group (`stamp/`). Keep the
  sibling as shallow: group, then token, a state or variant sub-group only where the
  grammar has one.

## Values

- Color: `{ "colorSpace": "srgb", "components": [r, g, b], "alpha": 1, "hex": "#5886dd" }`.
  Components are the 8-bit channels over 255 to four decimals, so they name the same color
  as the hex; hex is six digits, lower case; a transparent value is alpha 0 with hex
  `#000000`. No display-p3 in the file this round.
- Alias: the curly-brace form, `"$value": "{brand.pencil-47}"`, only where the source
  itself is a reference (the color file writes one where its CSS writes `var()`). An alias
  resolves inside the same document; never across files.
- The sibling's types come from the Format Module's own tables, checked at build time, not
  from memory: `dimension` (an object with a value and a unit), `duration` (the same
  shape), `fontFamily`, `fontWeight`, `number`, `cubicBezier`, and the `typography`
  composite built from the parts. The rule that carries over is the pairing: a token's
  `$value` is exactly what the CSS would carry, and the audit compares the two.

## The description

A plain JSON string; `\n` between lines, one line per part, in this order. The Figma
variable carries the same lines except the ground and the usage line.

```
Req for: <what the token is required for; documented roles only, never what it could be for>
<the conformance level in plain English, with its ground; only where a floor exists>
Ground: <on a ground token: which tokens clear it and at which level>
Use: <for what; optional for what; not for what; always with what>
Theming: <how the theme moves the value; dropped when it never moves>
```

- The conformance line is unlabeled and uses two phrases verbatim: "AA large text and UI
  elements" and "AA standard body text", never a ratio and never a criterion number.
- Never the words light, dark or mode. The theming line says how, not when.
- The usage line is the owner's guidance, in her form. The stamp fill: "primary button
  fills; optional for avatars, badges and other elements that carry text. Not a standalone
  color: it has no contrast guarantee of its own, only its on-text has one. Use it alone or
  with its hover and pressed states. Always bordered with its edge". Its states: "the
  pointer-over state of the fill, with the fill; for nothing else. Always bordered with the
  edge". A reference value: "a reference value (logos, swatches of the input); never a UI
  color, it carries no contrast guarantee".
- Two rules exist only because Figma's picker searches variable descriptions: no digit in
  a body line, and no other token's label word in a body. They do not bind the DTCG file.
  They do bind any text that reaches a Figma variable, including a Figma import file that
  carries `$description`, so decide which rendering that file gets.
- Every token has a description and the audit fails on a missing one. A claim in a
  description is rendered from the same table the audit measures, so the text can never
  say more than the gate holds.

A color token as emitted:

```json
"highlighter-26": {
  "$type": "color",
  "$value": { "colorSpace": "srgb", "components": [0.3451, 0.5255, 0.8667], "alpha": 1, "hex": "#5886dd" },
  "$description": "Req for: focus rings, icons, large text, translucent state layers over any ground\nAA large text and UI elements on every paper of this family and of the neutral\nTheming: tints carry brand hue; re-solved to clear its floor"
}
```

## Modes and the merge

The Resolver Module 2025.10 is the join. One resolver document lists the sibling's files
as sets and the color files as a `theme` modifier with `light` and `dark` contexts;
`resolutionOrder` names the sets, then the modifier. Regenerating a file rewrites only
that file. The shape:

```json
{
  "version": "2025.10",
  "sets": { "foundation": { "sources": [{ "$ref": "typography.tokens.json" }, { "$ref": "space.tokens.json" }] } },
  "modifiers": { "theme": { "contexts": { "light": [{ "$ref": "acme.light.tokens.json" }], "dark": [{ "$ref": "acme.dark.tokens.json" }] }, "default": "light" } },
  "resolutionOrder": [{ "$ref": "#/sets/foundation" }, { "$ref": "#/modifiers/theme" }]
}
```

## The audit to copy

`scripts/dtcg-audit.ts` runs the emitter over every posture and an agnostic sweep and
fails on any of these; the sibling's gate should fail on the same, minus the modes:

- every declared token appears exactly once, and nothing outside the roster appears;
- a path joined with hyphens is a CSS name the CSS emit declares with the same value, and
  a path joined with slashes is a Figma leaf with the same value;
- every alias resolves inside the document, no cycles;
- every token has a description; every name is legal;
- light and dark hold the same paths;
- the document survives a JSON round trip, byte for byte.

Then an independent parser, not a dependency: `npx -y -p @terrazzo/cli@latest tz check
<file>`. Terrazzo 2.7.1 accepted the color files and rejected a deliberately broken one.

## Consumers, two facts

- Style Dictionary's documentation says the 2025.10 format does not have full support yet.
  Every color token carries `hex` so a pipeline on it can read `$value.hex` and `alpha`
  through a short preprocessor; a plain hex string as `$value` is not valid 2025.10.
- Figma's native variables import takes one file per mode on identical token names, the
  shape the color files already have. A color value is the same object; a number, a
  string and a dimension import; check the import's type list for the rest before
  promising a Figma file per group.
