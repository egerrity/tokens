# tokens

The design system's tokens, generated: a designer edits a declaration that holds only a
decision, and one command derives every name, value, alias and description from it and
writes the token files, the Figma payload and plugin, a theme folder per brand, and the
documentation. The same declarations always produce the same files, byte for byte.
Color comes from okchroma, the color engine, which is a pinned dependency: each brand's
elections are a declaration, and the build solves its colors.

Private. Carries no employer name, no personal name, no home path.

## Run it

Node 22.6 or later.

```
npm ci
npm run generate    # writes every output from the declarations
npm run audit       # fails on anything the grammar or the format forbids; two builds must be identical
npm run check       # an independent Design Tokens parser over every brand's joined documents (needs the network)
npm run typecheck
```

Every output is committed, so nothing has to be run to read it.

## Read it in this order

1. `dist/tokens/` — the token files, one per collection and mode, in the Design Tokens
   Format Module 2025.10, and the resolver that joins them: `resolver.<brand>.json` per
   brand, `resolver.json` the default brand's. Run them through your pipeline first;
   that is the question this repo exists to answer.
2. `dist/brands/<brand>/` — the theme folder an app reads: `web/variables.css` (every
   token as a custom property; dark under `html[data-mode='dark']`; each viewport under
   its min-width query) and `mobile/colors.ts` (the color roles as hex per mode). Each
   ends in a compatibility block: today's names, each an alias of the token that replaces
   it, so an app can take the folder unchanged, and the block is the list of names to
   retire.
3. The names. A token has one path (`color/bg/brand/solid/hover`); the Figma variable
   joins it with slashes, the CSS name with hyphens behind the prefix
   (`--ds-color-bg-brand-solid-hover`), the token file with dots. The prefix is
   `declarations/prefix.ts`; `ds` stands in until engineering decides, and today's code
   uses none. The rule is `docs/grammar.md`; every word it uses is defined in
   `docs/glossary.md`.
4. `declarations/` — the inputs, seventeen short files, each a decision: the scales, the
   words, the color word tables, the brands' elections, the prefix, today's names. Nothing
   else is an input. `grammar/words.ts` holds the closed word lists and the shapes a path
   may take; the audit reads nothing else.
5. `docs/groups/` — one generated page per category, what is decided and what is derived.

## What the build guarantees

- Every name is in the grammar, every token is described, every alias resolves, every
  scale ascends, and no two paths join to the same CSS name.
- Two builds from the same declarations are identical, and the files on disk are the
  files the declarations produce; the audit fails otherwise.
- The joined documents are accepted by a parser this repo did not write.
- Each engine document says which engine version and which brand solved it.

## The questions for engineering

1. Do these names work as CSS and native identifiers, and is the file's shape what your
   pipeline reads?
2. The prefix: which one, or none.
3. A client's brand is fixed at build time and, on mobile, lives in the client's
   configuration folder beside the app's other assets; parts of the theme are fetched
   at build time through the design-system package. The open parts: how that fetch
   works, whether a generated theme folder (or `brand.json`, the short record of its elections) can
   be what it serves, where a new client's record is entered at onboarding, and what
   the web apps do.
4. The org's dormant design-tokens repo: what it is, who owns it, and which build tool it
   was set up for.

## The rest of the repo

- `grammar/` — the word lists, the shapes, and the path rules.
- `src/` — the program: derive, the token file, the Figma payload, the theme folder, the
  pages, the audit.
- `scripts/` — the commands, and `figma/apply.js` and `figma/audit.js`, which the build
  inlines into the development plugin at `dist/figma/plugin/`.
- `dist/figma/` — the same tokens as the Figma variables and styles they become, and the
  plugin that writes them into a file, renaming today's rows in place.
- `docs/` — the grammar, the glossary, the writing rules, the starting set, the color set
  and its migration map, the Figma dry-run guide and the hand work after a run.
- `prompts/` — instructions for a coding agent to audit token values and component usage
  in the product code.
- okchroma (`npmjs.com/package/okchroma`): the color engine. Its README and
  `docs/agents.md` are the contract for the color base tokens; read them there.
