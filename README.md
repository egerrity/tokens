# tokens

This repo generates the design system's tokens. The inputs are the files in
`declarations/`. Each one holds a decision: a scale, a list of words, a color word table,
a brand's color choices. One command reads them and writes the outputs: the token files,
the Figma payload and the plugin that applies it, a theme folder for each brand, and the
documentation.

Color values come from okchroma (`npmjs.com/package/okchroma`), a color engine installed
as a pinned dependency. A brand's color choices are one declaration
(`declarations/brands.ts`). The build passes them to the engine and writes the colors it
returns.

## Run it

Node 22.6 or later.

```
npm ci
npm run generate    # writes the outputs from the declarations
npm run audit       # checks the outputs against the grammar and the format, and that two builds are identical
npm run check       # runs a third-party Design Tokens parser over each brand's documents (needs the network)
npm run typecheck
```

The outputs are committed, so you can read them without running anything.

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

## Contents

### Read first

1. The token files, `dist/tokens/`. This is what a token pipeline consumes; try them in
   yours first.
   - `*.tokens.json`: the tokens, by collection and mode.
   - `resolver.<brand>.json`: which files make up each mode for that brand.
   - `resolver.json`: the same for the default brand. Start with this one.
2. The theme folder, `dist/brands/<brand>/`. This is what an app would consume instead
   of the token files; compare it with the theme files the apps use today.
   - `web/variables.css`: the tokens as CSS custom properties.
   - `mobile/colors.ts`: the color roles as hex per mode.
   - `brand.json`: the brand's color choices.
3. The naming convention, `docs/grammar.md`, with its terms in `docs/glossary.md`. Read
   it to judge whether the names work as CSS and native identifiers.
4. The declarations, `declarations/`. The source of truth: one file per decision, and
   everything in `dist/` is derived from them.
   - `grammar/words.ts`: the word lists and shapes the names are checked against.
5. The generated docs, `docs/groups/`: one page per category, what was decided and what
   was derived. Read these instead of the code.

### The rest of the repo

- `grammar/` has the word lists, the shapes, and the path rules.
- `src/` is the program. It derives the tokens, writes the token file, the Figma payload,
  the theme folders and the pages, and runs the audit.
- `scripts/` has the commands. `figma/apply.js` and `figma/audit.js` are the plugin's
  code; the build inlines them into the development plugin at `dist/figma/plugin/`.
- `dist/figma/` has the tokens in the form the plugin writes into Figma (variables and
  styles), and the plugin itself. The plugin renames today's rows in place, so existing
  bindings survive.
- `docs/` has the grammar, the glossary, the writing rules, the starting set, the color
  set and its migration map, the Figma dry-run guide, and the hand work left after a run.
- `prompts/` has instructions for a coding agent that audits token values and component
  usage in the product code.
- okchroma (`npmjs.com/package/okchroma`) is the color engine. Its README and
  `docs/agents.md` describe the color base tokens it produces.
