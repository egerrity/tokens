# Writing the prose

The rules for every sentence written about the set: the grammar, the glossary, the
share-outs, the guides, the handoffs, and what an agent writes in a session. They are
the owner's rulings, each with its reason, so a future writer can tell a rule from a
habit. They do not apply to token descriptions, which are generated text with rules of
their own (the last section says where those live).

## Words

- **A layer word is never a noun on its own.** Write *a base token*, *the base layer*,
  *those base tokens*; *a semantic token*, *the semantic layer*; *a component token*,
  *the component layer*. Never *a base*, *the base*, *those bases*, *a semantic*, *the
  semantics*. "The component" is fine only when it means the UI component. Reason: the
  bare word collides with the everyday word, and a rename by find-and-replace cannot tell
  the layer sense from the ordinary one; coupling the word to its noun keeps every future
  rename a clean replace.
- **The 4 px unit is "the unit."** Never "the base unit" (a layer word) and never
  "standard" (reserved for a possible density mode).
- **No metaphors.** Say the exact slot words — property, family, variant, specifier — or
  the structural words: group and token; parent, child and sibling. Never ladder, rung,
  or any other picture. The mapping from a color property's five emphasis words to their
  stops is its *word table*. Reason: a metaphor reads as jargon the reader is missing.
- **No jargon without a definition.** Every term used in a share-out or a doc is defined
  in `glossary.md` first, in plain words or in words defined above it. The code's own
  names (roster, emit, rung, stamp) stay in the code.
- **Define, don't inventory.** A rule says *when* something appears and *what* it holds,
  never which categories happen to use it today. The inventory is generated
  (`slots.md`), so it can never pose as a rule or drift from the code.
- **One order.** Every token uses the same slot order; a token uses the slots it needs.
  Never "family-first", "property-first" or "the two orders": a color base token has no
  property, so its family follows the category, in the same order as everything else.
- **Describe a thing by what it is, not by who makes it.** The color base tokens are "a
  family and one position word"; they are not "the engine's colors." The engine is named
  only where the rollout mechanics need it (its plugin writes those rows). Reason: color
  is handled like every other category whether or not an engine produces the values.
- **Two things share the word "stamp."** In color, the stamp is the engine's button-fill
  rows (`stamp-0`, `stamp-edge` …). The hidden mark a plugin writes on a Figma variable
  to find it by identity is the *identity tag* in prose; the scripts call writing it
  "stamping" and keep `stamp` in code.

## Sentences

- **Prose is written for its reader.** A share-out card is written for a designer; a
  guide for the person running it; a handoff for the session that will act on it. Length,
  terms and detail follow the reader, not the writer.
- **A table's columns are the shape's slots, left to right**, wherever a table is about
  the shape: category, property, family, variant, specifier. Rows are the layers or the
  examples. Never the other way round.
- **A claim about the code is present tense, true at HEAD, undated.** History goes to
  the changelog, the decisions record or a session page, never into a comment or a doc
  that is read as the present.
- **No names, no employer, no home path in the repo.** Work values may live here; the
  people and the company may not.

## Descriptions are not prose

A token's description is generated from the declaration's "required for" and "use"
text and follows rules of its own, set by where it is read: the Figma rendering drops
any line that carries a digit, because the variable picker searches descriptions
(`src/figma.ts`, `describeFigma`); the token-file rendering adds the composed-with and
reserved lines (`src/dtcg.ts`, `describeDocument`). The rules above are for what people
write about the set, not for what the set says about itself.
