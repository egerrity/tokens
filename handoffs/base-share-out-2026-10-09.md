# Base tokens: the share-out, draft

The second share-out, after the naming convention. Same shape: a short live walk, the
reading underneath. The audience has the grammar now, so this one is about *what is in
the set and why*, category by category. Everything here is the set as generated
(`docs/groups/*.md`, `docs/slots.md`); nothing is retyped from memory.

## 0. How to read this session

- Jot questions down and hold them for the end.
- Two things are open, so think about them as we go: the motion names (milliseconds or
  words), and the disabled opacity (38 is the reference and is not a step).
- This meeting is for understanding, visibility, red flags or gaps, and alignment. The
  nitty-gritty goes to comments on the board, or a follow-up.
- A decision here is one line in a declaration. A value or a step changes later by the
  same line, and the script renames in place. Nothing decided today is expensive to
  revisit.
- Not today: the color roles and the interaction levels (the semantic session); how the
  collections work inside; the Figma rollout; the generator.

## 1. What a base is

A base is a value on a scale, named for its position: `space/400` is the sixteen-pixel
step, `opacity/016` is sixteen percent, `motion/duration/080` is eighty milliseconds.
A base never says what it is for; the semantic layer does that by pointing at it.
Intent is allowed in how a scale is *built* — the color base tokens are solved with
intent on purpose, so one seed white-labels — but never in the name.

The step rule, in one line: a dimension step is the number of 4 px units times 100, at
least three digits (2 px is `050`, 4 px is `100`, 16 px is `400`); a step on any other
scale is the value itself (`opacity/016`, `motion/duration/080`). Named positions are
the exception for scales that have names already: `radius/full`, the easings, the font
families and weights, and the breakpoints, which keep the framework's keys.

Ninety base tokens of our own, in eight categories, plus the color base tokens. Forty-nine are
today's variables renamed in place; three are added to scales that exist; thirty-eight
are scales that exist in the docs or in code but not yet as variables.

## 2. What is in the set, by category

| Category | Today | Proposed | Rule | What changes |
| --- | --- | --- | --- | --- |
| space | `Primitives/space-000` … `space-3200`, 21 steps, 0 to 128 px; `negative-space-100` … `600` | `space/000` … `space/3200`; `space/negative/100` … `600` | 4 px × units × 100 | nothing but the name: every step and value kept |
| size | `Primitives/size-300` … `size-1400`, 8 steps, 12 to 56 px | `size/300` … `size/1600` | the same rule | one step added, `size/1600` (64 px), for the largest icons and spots |
| radius | `radius-000`, `050`, `150`, `200`, `300`, `full` | `radius/000` … `radius/300`, `radius/full` | the same rule; `full` is the pill | two steps added, `radius/075` (3 px) and `radius/100` (4 px), because the selection controls use those values raw today |
| border-width | `width-025`, `width-050` | `border-width/025`, `050` | the same rule | nothing but the name |
| opacity | none; the merge rows carried an alpha inside a color | `opacity/004`, `008`, `010`, `012`, `016`, `020`, `024`, `032`, `048`, `064` | the step is the percent | a new scale of ten; the alpha leaves the colors and becomes a token the roles point at |
| motion | in code only: `motion-easing-default`, `enter`, `exit`, `linear`; `motion-duration-short-1`, `short-2`, `medium-1`, `medium-2`, `long-1`, `long-2` | `motion/easing/default`, `enter`, `exit`, `linear`; `motion/duration/050`, `080`, `200`, `300`, `400`, `600` | the step is the milliseconds; an easing is a named curve | first time as Figma variables (Figma has timing and easing types now); the duration names become their values |
| breakpoint | none as variables; the apps' code holds 440, 768, 1024 and 1280; the type collection's modes stood in | `breakpoint/sm` 440, `md` 768, `lg` 1024, `xl` 1280 | a named position: the framework's keys, the apps' widths | first time as variables; the widths the apps are built to, unchanged |
| font | `font/family/sans`, `number`, `mono`; `font/weight/regular`, `medium`, `semibold`; one size variable per text style | the same families and weights; `font/size/300` … `font/size/1800`, eleven steps, 12 to 72 px; `font/line-height/125`, `150` | sizes on the 4 px rule; line heights as multiples | families and weights keep their names; the per-style sizes become one shared scale the text styles reference; two line heights, 1.25 and 1.5 |
| color | the color base tokens, already in the file under `color/<family>/…` | unchanged | a family and one position word | the color session |

The full lists, with every value and what each step is required for, are the generated
pages: `docs/groups/space.md`, `size.md`, `radius.md`, `border-width.md`, `opacity.md`,
`motion.md`, `breakpoint.md`, `font.md`.

## 3. Decisions and why

| Decision | Why |
| --- | --- |
| The step numbers do not change | They already follow the rule (4 px × 100); nobody relearns a number. |
| One rule for every dimension scale: units × 100, at least three digits | The last two digits are the fraction of a unit: `025` is a quarter unit, `100` one, `3200` thirty-two. Cover the last two digits and what is left is whole units. The padding keeps that place, so `025` cannot be read as twenty-five units; it is one notation in space, size, radius, border width and font size, and today's `width-025` already uses it. |
| Size gains `1600` (64 px) | The largest icon and spot-illustration sizes need it; nothing else on the scale reaches 64. |
| Radius gains `075` and `100` | The selection controls use 3 and 4 px today as raw values; a value components use is a token. |
| Opacity is one scale of ten, in percent, with no color and no mode | The merge rows baked an alpha into a color, so every translucent ground was its own color; now a role is an alias plus an opacity token, and the opacity is reused everywhere. |
| Durations are named by their milliseconds | `short-1` says nothing a designer can place; `080` does. The scale rule, applied. |
| Easings keep their names | They are curves, not positions on a line; `enter` and `exit` are the words the docs use. |
| Breakpoints keep the widths the apps are built to, under the framework's keys | Nothing in Figma or the docs is built to a breakpoint and the apps are, so code is the source for these four values; the keys are the framework's, the one scale where it sets the vocabulary. The docs' 640 was never in code. |
| The type scale is eleven sizes on the same rule | Today each text style owns its size variables; a shared scale means a size is declared once and every style references it. |
| Line heights are two multiples, 1.25 and 1.5 | Two values cover every style; multiples survive a size change, pixels do not (Figma binds pixels, so the Figma parts carry them per viewport). |
| The iOS text-size modes are dropped | The operating system scales from the base size; a hand-kept table can only drift from what the device does, and today's does. |
| The color base tokens are not decided here | Solved per seed with intent, by the engine; they are the color session's. |

## 4. Questions you might have

| Question | Answer |
| --- | --- |
| Why numbers and not `sm`, `md`, `lg`? | Twenty-two space steps do not survive size words, and the numbers are the ones already in use. Size words are for semantic tokens, where there are three or four of something. |
| Why is opacity in percent and not 0 to 1? | The step is the value, and the value designers say is a percent. The file stores 0 to 1; the name says 16. |
| Why these breakpoints? | They are the ones the apps are built to today, under the keys the framework already uses, so design and code agree at every width. Where a layout actually changes is a product decision, not a token one; the token records it. |
| Where did the merge intensities go? | Their alpha is now the opacity scale; the rows themselves become the ghost and soft levels, which is the semantic session. |
| Why does `font/weight/medium` say medium when `breakpoint/md` says md? | Two lists with two meanings: `md` is a size word, a position on a run of sizes; `medium` is the typeface's own weight name, what Figma loads. A reader tells a size from a weight by the word alone. |
| Why does `radius/full` say full and not a number? | It is not a position on the scale; it is the pill, the one radius that means "as round as it can be." |
| Why are durations three digits when 50 ms is two? | Every step on every scale is at least three digits, so a step always looks like a step and the scales read alike; on a scale that stays under a thousand, the padding also keeps `050` before `200` in any list. |
| What happens to the existing variables? | Renamed in place; every binding survives; the code names stay until engineering says. The rest is the Figma session. |

## 5. Open, and what we need from you

Open:

- The enter easing is written two ways in the docs (`0.4, 1, 0.89, 1` in the table,
  `0.4, 0, 0.89, 1` below it). The code is the tie-breaker; the set carries the table's
  until it says otherwise.
- Motion names: the milliseconds (`080`) by the scale rule, or the words the motion
  owner may prefer (`short-2`).
- The disabled opacity: 38 percent is the reference and is not a step of the scale; the
  components may use another today.
- Breakpoints: confirm with the code audit that the product is on the framework's
  defaults and has not customized them.
- The 462 ms spring in a motion example is not a token; say if it should be.

What we need from you:

1. Agree the list per category, cutting what is not needed: every row is a line in a
   declaration, so a cut costs nothing.
2. Name any value you use today that is not on a scale here.
3. Comments on the board, on the category the question belongs to.

Next: the color roles and the interaction levels; the collections and the Figma
rollout; the generator and the handoff to engineering.
