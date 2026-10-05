# tokens

A generator for the design system's non-color token groups (typography, radius, space,
size, motion), built the way okchroma builds color: declare the decisions, derive the
values, emit the file, audit the result. It emits Design Tokens Format Module 2025.10
documents in the same shape as okchroma's color file, so the two merge into one contract
document.

Private. Carries no employer name, no personal name, no home path.

Needs Node 22.18 or later and no installed packages: `npm run generate` writes the token
files and the group pages, `npm run audit` fails on anything the grammar or the format
forbids, `npm run check` runs an independent Design Tokens parser over the output (it
needs the network).

- `handoffs/token-generator-handoff-2026-09-30.md`: the brief, the task to plan and build.
- `handoffs/2026-09-30-dtcg-output-conventions.md`: the shape the output must match.
- `declarations/`: the decisions a designer edits, one file per group.
- `grammar/`: the closed word lists and the path rules the audit enforces.
- `dist/tokens/`: the generated token files. Committed, so nothing has to be run to use
  them.
- `docs/groups/`: one generated page per group, what is decided and what is derived.
- `docs/generator-plan.md`: the plan the generator is built to, and its build order.
- `docs/grammar-draft.md`: the naming grammar every token path follows.
- `docs/figma-foundations-audit.md`: what the library file defines today.
- `docs/starting-set.md`: today's values and the proposed sets, named under the grammar.
- `prompts/`: two-stage instructions for a coding agent to audit token values and
  component usage in the product code.
- okchroma (`github.com/egerrity/okchroma`): the color engine; its `docs/agents.md` and
  README are the consumer contract for the color tokens. Read them there, never copy them.
