# Mapping records

The working files of the mapping from the library's old names to the set, for the agent
doing the code-side work. Each sheet answers the agent's own questions in its numbering,
with the rule that decides each answer and the tell it can read in code. The rules behind
the color answers are `docs/color-by-component.md` and `docs/color-semantic-set.md`.

| File | What it is |
| --- | --- |
| `color-fork-answers.md` | The answers to the color decision sheet: the brand and signal classes, D0 to D14, and the rules under them. |
| `color-fork-check.md`, `color-fork-check.py`, `color-fork-inventory-checked.csv` | A check of the fork inventory against the component page's rules: the report, the script that writes it, and the inventory with a predicted role per row. The script takes the inventory CSV as its one argument. |
| `compat-map-answers.md` | The answers to the compatibility-map questions: the app's CSS names, shades, the shadcn names, the non-color names, and the step-two spec with the changes it needs. |
| `compat-aliases-reviewed.csv` | The alias sheet with its names restored, one row per name: the agent's target, the reviewed target and the reason. |
| `unify-reads.txt` | The CSS variable names the library's styling reads. The audit checks every one is defined or exempted. |
