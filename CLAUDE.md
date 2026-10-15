# Working in this repo

- The repo carries no person's name and no home path. The company's name appears as a
  brand key and in the mapping records under `mapping/`, nowhere else. Work values may live
  here; people may not.
- Commit only on the owner's word; push only after an explicit yes.
- The Figma apply script never deletes. The plugin's delete command deletes only what the
  leftovers walk found nothing referring to in the file, listed and ticked in its window,
  on a click; it never touches a tagged row. Never write into the owner's work Figma
  files; copies and scratch files only.
- A translucent color is always a pair, a color alias and an opacity token, never a
  composed value.
- Prose follows `docs/writing.md`; terms are defined in `docs/glossary.md` before use. In
  short: a layer word is never a noun on its own (*a base token*, never *a base*); no
  metaphors (no ladder, no rung); one slot order for every token; describe a thing by
  what it is, not by who makes it. These rules are for prose, not for the generated
  token descriptions, which have their own rules in `src/figma.ts` and `src/dtcg.ts`.
- A comment is a present-tense claim about the code at HEAD, never dated; history goes
  to the commit message, the changelog or a session page.
