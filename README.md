# tokens

A generator for the design system's non-color token groups (typography, radius, space,
size, motion), built the way okchroma builds color: declare the decisions, derive the
values, emit the file, audit the result. It emits Design Tokens Format Module 2025.10
documents in the same shape as okchroma's color file, so the two merge into one contract
document.

Private. Carries no employer name, no personal name, no home path.

- `handoffs/token-generator-handoff-2026-09-30.md`: the brief, the task to plan and build.
- `handoffs/2026-09-30-dtcg-output-conventions.md`: the shape the output must match.
- `docs/grammar-draft.md`: the naming grammar every token path follows.
- `docs/figma-foundations-audit.md`: what the library file defines today.
- `docs/starting-set.md`: today's values and the proposed sets, named under the grammar.
- `prompts/`: two-stage instructions for a coding agent to audit token values and
  component usage in the product code.
- okchroma (`github.com/egerrity/okchroma`): the color engine; its `docs/agents.md` and
  README are the consumer contract for the color tokens. Read them there, never copy them.
