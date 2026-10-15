# Color fork check

The inventory classed by the component page's rules, against the agent's proposed role.
No variant column in the inventory, so the kind of a Button, a badge or an info variant comes
from the agent's own job column where a component name does not decide it.

| Status | Rows | Uses |
| --- | --- | --- |
| agree | 406 | 600 |
| differ | 52 | 62 |
| undecided | 9 | 11 |

Agreement by what classed the row:

| Classed by | Agree | Differ | Undecided |
| --- | --- | --- | --- |
| component name | 107 | 40 | 2 |
| agent job | 299 | 12 | 7 |

A row classed by the agent job agrees with the agent by construction where the job already names the role; those rows test the spelling, not the assignment.

## Where the rules and the agent differ

| Pattern | Property | State | Agent proposed | The page says | Rows | Uses |
| --- | --- | --- | --- | --- | --- | --- |
| input | border | rest | border/brand/accent | border/neutral/focus or border/neutral/regular | 8 | 11 |
| input | border | focus | border/brand/accent | border/neutral/focus | 5 | 5 |
| chip | text | rest | fg/brand/regular | fg/brand/on-solid | 2 | 4 |
| row | fill | rest | bg/brand/soft/selected | bg/brand/ghost/selected | 3 | 4 |
| tag | text | rest | fg/brand/accent | fg/brand/regular | 2 | 3 |
| tag | text | rest | fg/critical/accent | fg/critical/regular | 2 | 3 |
| tag | text | rest | fg/positive/accent | fg/positive/regular | 2 | 3 |
| tag | text | rest | fg/warning/accent | fg/warning/regular | 2 | 3 |
| badge | fill | rest | bg/brand/accent | bg/brand/solid/enabled | 2 | 2 |
| chip | fill | rest | bg/brand/soft/selected | bg/brand/solid/enabled | 2 | 2 |
| chip | fill | hover | bg/brand/soft/selected-hover | bg/brand/solid/hover | 2 | 2 |
| chip | fill | active | bg/brand/soft/selected-pressed | bg/brand/solid/pressed | 2 | 2 |
| progress | fill | rest | bg/brand/accent | bg/brand/solid/enabled | 2 | 2 |
| progress | fill | rest | bg/critical/accent | bg/critical/solid/enabled | 2 | 2 |
| progress | fill | rest | bg/positive/accent | bg/positive/solid/enabled | 2 | 2 |
| progress | fill | rest | bg/warning/accent | bg/warning/solid/enabled | 2 | 2 |
| input | border | active | border/brand/accent | border/neutral/focus | 2 | 2 |
| button-solid | fill | rest | bg/brand/solid/hover | bg/brand/solid/enabled | 2 | 2 |
| control | text | rest | fg/brand/accent | fg/brand/on-solid or fg/neutral/regular | 1 | 1 |
| radio | border | rest | border/brand/solid | border/brand/accent | 1 | 1 |
| radio | border | data-[state=checked] | border/brand/solid | border/brand/accent | 1 | 1 |
| input | border | focus | border/neutral/focus | border/critical/accent | 1 | 1 |
| alert | border | rest | border/positive/accent | border/positive/muted | 1 | 1 |
| row | fill | hover | bg/critical/soft/selected-hover | bg/critical/ghost/hover | 1 | 1 |

## Undecided by these columns

| Pattern | Property | State | Agent proposed | Rows | Uses |
| --- | --- | --- | --- | --- | --- |
| (none) | fill | rest | ? | 7 | 9 |
| button | fill | focus | bg/brand/solid/pressed | 1 | 1 |
| button | fill | focus | bg/critical/solid/pressed | 1 | 1 |
