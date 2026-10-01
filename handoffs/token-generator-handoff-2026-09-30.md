# Hand-off: a generator for the non-color token groups

Start by reading `~/.claude/CLAUDE.md` and working by it: caveman reasoning, rtk on
command output, plain words in anything an outsider reads, say what/where/how and wait for
"yes" before building, show drafts before committing. This brief is one-way: plan, present,
and stop for her yes. No report back to the session that wrote it.

Work in `<REPO_OR_FOLDER>`, a new place. Not inside the okchroma repo: okchroma is the
public color engine and stays color-only. This generator is its sibling, private until she
says otherwise, and must never carry an employer name.

## Goal

A small, deterministic generator that produces the design system's non-color token groups
the way okchroma produces color: declare the decisions, derive the values, emit the file,
audit the result. No theming; these groups do not change per brand. What it must do is
everything the token contract promises: DTCG output, a description on every token, a
deprecation field where a name replaces an old one, use and do-not-use text in the standard
form. The alternative, plodding through the scales in Figma by hand, is what this replaces.

## The groups, as listed in the plan

- Typography: sizes, line heights, weights, families, letter spacing, and the composite
  text styles built from them. Breakpoints, because the type scale is defined per
  breakpoint.
- Radius.
- Space and size: the spacing scale and the sizing scale, named separately.
- Motion: durations and easings. The existing motion values are sound; this group is
  documentation and emit, not redesign.

Out of scope, because okchroma emits it: color. okchroma emits color primitives only (its
seven color families, the neutral's poles, two link trios, the two brand seeds); it no
longer emits opacity, elevation or shadow, so those three need an owner, this generator or
a hand-authored file (an open question below). The generator must not collide with the
color file's names. Its output and okchroma's color file are separate files merged at
build time into the one contract document, so regenerating either never overwrites the
other.

## What already exists, to read before planning

- okchroma, `~/okchroma`: the pattern to copy in simpler form. `src/engine/requirements/spec.ts`
  is a declaration as pure data; `src/engine/dtcgRender.ts` is the shipped DTCG emit;
  `src/engine/tokenDescriptions.ts` is the description text and its rules, in two
  renderings (the terse Figma one and the agent-readable one the file carries);
  `scripts/dtcg-audit.ts` is the gate that fails on the worst case; `docs/schema.md` is the
  file's reference. The layout and audit habits transfer. The color math does not.
- The conventions page beside this brief, `2026-09-30-dtcg-output-conventions.md`: the
  shape the color file has (document, names, values, the description's line grammar, the
  resolver join, the audit checks). Both emitters must produce that shape, or the merged
  document has two dialects. The retired opacity, elevation and shadow values, with the
  reasoning, are recorded in `~/okchroma/research/semantic-layer/README.md`.
- The plan `design-foundations-plan-2026-09-29.md` in this folder: the naming grammar is
  Jordan's meta-grammar finished by Emily with color; the description template and voice
  are Janey's; the audit decides per group whether the current values are fixed or redone.
  The generator consumes those three inputs; it does not invent them.
- The DTCG Format Module 2025.10 (the Design Tokens Community Group's spec; the platform
  calls it "the W3C format"): the types for dimension, fontFamily, fontWeight, number,
  duration, cubicBezier, typography and the `$description` / `$deprecated` / `$extensions`
  fields. Primer's pattern of usage and rules under `$extensions` is the reference for use
  and do-not-use text.

## Phase 1: research and plan (no build)

1. Extract okchroma's shape into one page: declaration, derivation, emit, audit, docs. Note
   what is color-specific and drops out.
2. For each group, write the declaration a designer edits: what is decided (a base, a
   ratio, the step count, the names, the breakpoints) and what is derived. Keep the decided
   part small; if a value cannot be derived from a decision, it is a decision.
3. Define the description template per group: what the token is for, when not to use it,
   what replaces it if deprecated, in the terse form Janey's template mandates. Every
   token, no exceptions, and the audit enforces it.
4. Define the audits: every token has a description; names follow the grammar; scales are
   monotonic with no duplicates; type sizes and line heights form the declared ratio;
   breakpoints ascend; durations sit inside declared bounds; nothing collides with an
   okchroma name.
5. Define the emits: one DTCG file per group; a Figma-variables import file as a second
   target, because the team has no Figma MCP and an importable file needs none. Decide
   the file layout and the merge step with the color file.
6. Define the old-to-new map for names that replace existing tokens, with `$deprecated`
   on the old name, so migration can follow it.
7. Present the plan as what/where/how, with the open questions below answered or listed,
   and stop.

## Constraints

- Deterministic: the same declaration always produces the same file, byte for byte.
- TypeScript, no runtime dependencies if it can be helped, one command per group and one
  for all.
- Plain vocabulary in every doc and description. WCAG, if it comes up for type sizes,
  in plain English, never a criterion number alone.
- No employer name, no personal name, no home path in any file that could leave the
  machine.
- Nothing an agent reads is written by hand: the designer decides, the generator writes.

## Done means

- For each group: a declaration file a designer can edit, a generated DTCG file with a
  description on every token, a Figma-importable variables file, and a one-page doc
  saying what the designer decides and what is derived.
- One merge command produces the contract document from these files plus okchroma's
  color file, and an audit fails on a missing description, a name outside the grammar, a
  value outside the declared scale, or a collision with a color name.
- The output reads the same as the color file: same fields, same description form.

## Open questions for her

- Who owns opacity, elevation and shadow now that okchroma emits color only: this
  generator, or a hand-authored file; and whether the retired values become the starting
  declaration.
- Which groups the audit marked fix rather than redo, and what of the current values is
  kept as the starting declaration.
- The grammar's final form for these groups, from Jordan and Emily.
- Whether breakpoints are tokens in the file or configuration beside it.
- Whether composite text styles are wanted in the file, or only the parts.
- Where the merged contract document lives and who consumes it first.
