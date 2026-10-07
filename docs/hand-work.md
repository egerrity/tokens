# The hand work after a run

Generated with the rest of the set. The apply script never deletes and never guesses, so
what follows is a person's, in this order, in a copy first and in the real file after.
What is specific to one file (which rows have no successor, which modes go, what to
decide first) is in `dry-run.md`.

## 1. Read the report

The run ends in a window with the report; Copy takes it. `problems` first: each line is
a row the script left alone and says why. Then `orphans`, `created` and `renamed`
against what the run was expected to do.

## 2. List the leftovers

Run the plugin's second command, List the leftovers. After a run every row the set
owns and every engine row it found carries a stamp, so an unstamped variable, text
style or effect style is a leftover, whatever its name. The list gives each with where
it lives and every layer, style and variable that refers to it.

- Under "Nothing refers to these": delete them.
- Under "Still referred to": open each use listed, bind it to the row's successor (the
  role map in `color-role-map.md` names it), then delete the row. A row that has to
  stay for now is marked deprecated instead.
- Under "Collections with no stamped row": delete the collection once its rows are gone.

Run the list again: it is empty but for what was kept on purpose.

## 3. Compose the 52 pairs

A translucent row is its alias at an opacity, set in the variables panel: open the row,
keep the alias, set the opacity to the percent. The script writes the alias and leaves
the opacity to the panel, which the API cannot read or write; a composed row reads back
as its alias, so later runs leave it alone. In the order the set lists them:

| Row | Alias | Opacity token | Percent |
| --- | --- | --- | --- |
| `color/surface/scrim` | #000000 | `opacity/scrim` | 64 |
| `color/bg/ghost/hover` | `color/neutral/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/ghost/pressed` | `color/neutral/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/ghost/selected` | `color/neutral/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/soft/enabled` | `color/neutral/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/soft/hover` | `color/neutral/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/soft/pressed` | `color/neutral/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/soft/selected` | `color/neutral/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/bg/brand/ghost/hover` | `color/brand/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/brand/ghost/pressed` | `color/brand/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/brand/ghost/selected` | `color/brand/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/brand/soft/enabled` | `color/brand/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/brand/soft/hover` | `color/brand/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/brand/soft/pressed` | `color/brand/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/brand/soft/selected` | `color/brand/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/bg/brand-alt/ghost/hover` | `color/brand-alt/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/brand-alt/ghost/pressed` | `color/brand-alt/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/brand-alt/ghost/selected` | `color/brand-alt/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/brand-alt/soft/enabled` | `color/brand-alt/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/brand-alt/soft/hover` | `color/brand-alt/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/brand-alt/soft/pressed` | `color/brand-alt/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/brand-alt/soft/selected` | `color/brand-alt/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/bg/critical/ghost/hover` | `color/critical/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/critical/ghost/pressed` | `color/critical/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/critical/ghost/selected` | `color/critical/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/critical/soft/enabled` | `color/critical/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/critical/soft/hover` | `color/critical/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/critical/soft/pressed` | `color/critical/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/critical/soft/selected` | `color/critical/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/bg/warning/ghost/hover` | `color/warning/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/warning/ghost/pressed` | `color/warning/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/warning/ghost/selected` | `color/warning/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/warning/soft/enabled` | `color/warning/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/warning/soft/hover` | `color/warning/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/warning/soft/pressed` | `color/warning/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/warning/soft/selected` | `color/warning/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/bg/positive/ghost/hover` | `color/positive/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/positive/ghost/pressed` | `color/positive/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/positive/ghost/selected` | `color/positive/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/positive/soft/enabled` | `color/positive/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/positive/soft/hover` | `color/positive/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/positive/soft/pressed` | `color/positive/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/positive/soft/selected` | `color/positive/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/bg/info/ghost/hover` | `color/info/highlighter-26` | `opacity/ghost/hover` | 8 |
| `color/bg/info/ghost/pressed` | `color/info/highlighter-26` | `opacity/ghost/pressed` | 12 |
| `color/bg/info/ghost/selected` | `color/info/highlighter-26` | `opacity/ghost/selected` | 16 |
| `color/bg/info/soft/enabled` | `color/info/highlighter-26` | `opacity/soft/enabled` | 12 |
| `color/bg/info/soft/hover` | `color/info/highlighter-26` | `opacity/soft/hover` | 16 |
| `color/bg/info/soft/pressed` | `color/info/highlighter-26` | `opacity/soft/pressed` | 24 |
| `color/bg/info/soft/selected` | `color/info/highlighter-26` | `opacity/soft/selected` | 32 |
| `color/illustration/shadow` | `color/brand/pen-58` | `opacity/010` | 10 |
| `color/illustration/shine` | `color/brand/paper-5` | `opacity/020` | 20 |

## 4. Verify

- Run Apply the set again: the report counts only `same`.
- A component that bound an old row shows the same color under the new name.
- The text styles show their family, bound; the effect styles their layers.
- Reserved rows do not appear in a consuming file's picker.
