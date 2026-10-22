# Build the design system by its plan

Read `docs/design-system-plan.md` and work by it, one stage per request: the operator
starts you with "Follow this file, stage 0 only" and names each later stage. A stage
ends when its "working looks like" holds; where it cannot, stop and say why, and patch
nothing around it. Stage 1 is `docs/color-engine-merge.md` and runs by its own prompt.
Do not resolve an open ruling yourself: list what it blocks and stop. No commits without
the operator's word, no pushes, and the Figma stage runs on a copy of a file, never the
library. Before saying a stage holds, grep: no theme extension's name under `dist/` or in
a package, no old family word in an output after stage 3.
