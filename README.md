# tokens

This repo generates the design system's tokens. The inputs are the files in
`declarations/`, one decision per file. `npm run generate` reads them and writes the
token files, the Figma plugin and its payload, the web and mobile theme files
(`variables.css`, `colors.ts`) for each brand in `declarations/brands.ts`, and the docs.

Color values come from okchroma (`npmjs.com/package/okchroma`), a color engine pinned as
a dependency. The build passes each brand's color choices (`declarations/brands.ts`) to
the engine and writes the colors it returns.

For review, the generated files in `dist/` are committed, so you can read the outputs on
GitHub without installing or running anything.

## Contents

### Read first

1. The token files, `dist/tokens/`. This is what a token pipeline consumes.
   - `*.tokens.json`: the tokens, by collection and mode.
   - `resolver.<brand>.json`: which files make up each mode for that brand.
   - `resolver.json`: the same for the default brand.
2. The theme folder, `dist/brands/<brand>/`, generated from the brand's record in
   `declarations/brands.ts`. This is what an app would consume instead of the token
   files; it corresponds to the theme files the apps use today.
   - `web/variables.css`: the tokens as CSS custom properties.
   - `mobile/colors.ts`: the color roles as hex per mode.
   - `brand.json`: the brand's color choices.
3. The naming convention, `docs/grammar.md`, with its terms in `docs/glossary.md`.
4. The declarations, `declarations/`: the source of truth, one decision per file.
   - `grammar/`: the word lists, shapes and path rules the names are checked against.
5. The generated docs, `docs/groups/`: one page per category, what was decided and what
   was derived.

### The rest of the repo

- `src/` is the generator's code.
- `scripts/` has the commands. `figma/apply.js` and `figma/audit.js` are the plugin's
  code; the build inlines them into the development plugin at `dist/figma/plugin/`.
- `dist/figma/` has the Figma payload (variables and styles) and the plugin that applies
  it by renaming today's rows in place.
- `docs/` also has the writing rules, the starting set, the color set, its migration map
  and the color roles by component, the Figma dry-run guide, and the hand work left after
  a run.
- `prompts/` has instructions for a coding agent that audits token values and component
  usage in the product code.
## Run it

Node 22.6 or later. `npm ci` installs okchroma 0.9.0, the one runtime dependency, and
TypeScript for `npm run typecheck`.

```
npm ci
npm run generate    # writes the outputs from the declarations
npm run audit       # checks the outputs against the grammar and the format, and that two builds are identical
npm run check       # runs a third-party Design Tokens parser over each brand's documents (needs the network)
npm run typecheck
```

## What the build guarantees

- Names follow the grammar. The audit also checks that:
  - each token has a description
  - each alias points at a token that exists
  - each scale ascends
  - CSS names are unique
- The declarations always produce the same files. The audit builds twice and compares
  the two, then compares the result with the committed files.
- An external Design Tokens parser (Terrazzo) accepts the files. `npm run check` first
  merges the files that make up one mode into one document, because a file aliases
  tokens in other files.
- Each color document from the engine records the engine version and the brand that
  produced it.
