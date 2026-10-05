# Foundations starting set: what the docs say today, named under the new grammar

A proposal to cut, not a decision. Each row says where it comes from: "exists" means a
variable or style is in the library file today, "documented" means the design docs state
it but nothing in Figma holds it, "gap" means it is added here. Paths follow
`grammar-draft.md` beside this page.

Sources read 2026-10-02: the design docs file (Layout, Motion and Typography foundations
pages, and the component property variables), the library file (Surface and States pages,
the variables and styles), and the audit page beside this one
(`figma-foundations-audit.md`).

## Space

**Primitives.** The 21 steps and six negative steps exist and are kept exactly: the same
step numbers, the same values, the same rule (the base unit is 4 px and the step is the
number of base units times 100, so 2 px is `050`, 4 px is `100`, 10 px is `250`, 16 px is
`400`). The only change is where the word sits. `Primitives/space-400` becomes the Figma
variable `space/400`; in CSS it is `--ds-space-400`. The negative steps become
`space/negative/100` to `space/negative/600`.

**Semantic set.** Today the docs give designers a table per pair of elements (between
cards, between icon and text, title to content) at near, standard and far. Compared with
other systems that is unusual, and it does not scale: every new pair needs a new row, and
anything not listed has no answer.

What other systems do:

- Many ship no semantic space at all, only the number scale (Carbon, Atlassian,
  Material).
- T-shirt sizes are the same scale under different names. They add a second set of names
  for the same values and say nothing about when to use which. They also collide with
  the size words components already use (`sm`, `md`, `lg`).
- GitHub's Primer names space by purpose and density: a gap or a padding, at condensed,
  normal or spacious.

Recommended, as the most readable to an agent: purpose, then where it applies, then a
density word. The density words are Primer's, copied as they are (`condensed`, `normal`,
`spacious`): they read for a padding as well as for a gap, which distance words do not,
and they are a published convention an agent may already know. The name narrows the
choice to three; the description lists the documented cases, so the knowledge in today's
tables is kept as text an agent reads.

The middle word says where the space is used, because one run of three values cannot
serve both the gap between an icon and its label and the gap between two cards:
`control` is inside a single control, `content` is between pieces of content that belong
together (text blocks, buttons, inputs), `layout` is between the big blocks of a page
(cards, sections).

| Path | Aliases | px | Covers, from the docs |
| --- | --- | --- | --- |
| `space/gap/control/condensed` | `space/100` | 4 | icon to text, near |
| `space/gap/control/normal` | `space/200` | 8 | icon to text |
| `space/gap/control/spacious` | `space/300` | 12 | icon to text, far |
| `space/gap/content/condensed` | `space/200` | 8 | body text near; title to content near; between titles far |
| `space/gap/content/normal` | `space/300` | 12 | between buttons |
| `space/gap/content/spacious` | `space/400` | 16 | between inputs; body text far; title to content far |
| `space/gap/layout/condensed` | `space/400` | 16 | between cards |
| `space/gap/layout/normal` | `space/600` | 24 | between cards far; between sections near; content to buttons |
| `space/gap/layout/spacious` | `space/800` | 32 | between sections |
| `space/padding/card/condensed` | `space/300` | 12 | card padding, near |
| `space/padding/card/normal` | `space/400` | 16 | card padding |
| `space/padding/container/condensed` | `space/500` | 20 | container padding, near |
| `space/padding/container/normal` | `space/600` | 24 | container padding |

Thirteen tokens. Each level is a short run on the scale: 4, 8, 12 inside a control; 8, 12,
16 between pieces of content; 16, 24, 32 between blocks of layout.

To decide:

- Whether `control`, `content` and `layout` are the right three words for where.
- Two documented values land one level over from where the docs put them: between titles
  near (4 px, now `control/condensed`) and between cards near (12 px, now
  `content/normal`). The docs' "between inputs" is 16 px, which is `content/spacious`
  here, not the middle value.
- Whether padding wants a `spacious` step. The docs give only two.

## Size

Primitives: the eight steps exist and are kept, `size/300` to `size/1400`, on the same
rule as space.

| Path | Aliases | px | Status |
| --- | --- | --- | --- |
| `size/icon/xs`, `sm`, `md`, `lg` | `size/300`, `400`, `500`, `600` | 12, 16, 20, 24 | exists |
| `size/control/sm`, `md`, `lg` | `size/1000`, `1200`, `1400` | 40, 48, 56 | documented as fixed heights; the 40 px row has no size word in the docs |
| `size/content/max` | raw | 1280 | documented: desktop content max width |
| `size/content/paragraph` | raw | 720 | documented: paragraph max width |
| `size/content/min` | raw | 320 | documented: mobile content min width |

To decide: the three content widths are far above the size scale, which ends at 56 px.
They are either semantic tokens holding a raw value, or the size scale grows.

## Breakpoints and grid

Nothing here exists as a variable. The docs define mobile below 640, tablet from 640,
desktop from 1024, and an optional wider desktop from 1280.

Those three numbers are already three of the five default breakpoints of Tailwind, the
utility framework the product code is understood to use: 640, 768, 1024, 1280, 1536. The
other common sets do not fit as well: Bootstrap uses 576, 768, 992, 1200, 1400, and
Material uses 600, 840, 1200, 1600. So the standard that fits is the one already half
adopted.

Recommended: the five framework defaults, under the framework's own keys, each a minimum
width.

| Path | Value | In the docs today |
| --- | --- | --- |
| `breakpoint/sm` | 640 | tablet starts |
| `breakpoint/md` | 768 | not used |
| `breakpoint/lg` | 1024 | desktop starts |
| `breakpoint/xl` | 1280 | wide desktop starts; also the content max width |
| `breakpoint/2xl` | 1536 | not used |

Device words (mobile, tablet, desktop) stay as the design vocabulary for layouts, defined
by the breakpoints: mobile is below `sm`, tablet is `sm` up to `lg`, desktop is `lg` and
up, wide desktop is `xl` and up.

The grid is three tokens whose values change by those layout ranges. Margin and gutter
alias space steps.

| Path | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| `grid/columns` | 4 | 6 | 12 |
| `grid/margin` | `space/400` (16) | `space/800` (32) | `space/800` (32) |
| `grid/gutter` | `space/200` (8) | `space/200` (8) | `space/400` (16) |

To confirm with the code audit: that the product code is on the framework's default
breakpoints and has not customized them.

## Radius and border width

Exist and are kept: `radius/000`, `050`, `150`, `200`, `300`, `full`; `border-width/025`,
`050`. Added, because components already use the values raw: `radius/075` (3 px) and
`radius/100` (4 px).

The Surface page gives the use text the descriptions need:

- `radius/050`: component focus states only.
- `radius/150`: small elements, such as chips.
- `radius/200`: most elements and components.
- `radius/300`: large containers, such as cards and modals.
- `radius/full`: contained buttons.

The two added steps are what the selection controls use today (3, 4 and 6 px by size).
`radius/000` has no documented use.

## Motion

The docs name the values and say the tokens exist in the code repository, as primitive
and semantic motion files, so the code-side audit should find them. Figma now has timing
and easing variable types, so the durations and easings can be Figma variables; the docs
page that says Figma has no motion variables is out of date. All rows documented, none
in Figma yet.

| Today | Path | Value |
| --- | --- | --- |
| `motion-easing-default` | `motion/easing/default` | 0.2, 0, 0.3, 0.95 |
| `motion-easing-enter` | `motion/easing/enter` | 0.4, 1, 0.89, 1 in the table; 0.4, 0, 0.89, 1 in the text below it |
| `motion-easing-exit` | `motion/easing/exit` | 0.11, 0, 0.6, 0 |
| `motion-easing-linear` | `motion/easing/linear` | 0, 0, 1, 1 |
| `motion-duration-short-1`, `short-2` | `motion/duration/050`, `080` | 50 ms, 80 ms |
| `motion-duration-medium-1`, `medium-2` | `motion/duration/200`, `300` | 200 ms, 300 ms |
| `motion-duration-long-1`, `long-2` | `motion/duration/400`, `600` | 400 ms, 600 ms |

Transitions, each one easing with one duration:

| Today | Path | Easing | Duration |
| --- | --- | --- | --- |
| `motion-transition-default` | `motion/transition/default` | default | 80 ms |
| `motion-transition-default-opacity` | `motion/transition/default-opacity` | linear | 80 ms |
| `motion-transition-default-fast` | `motion/transition/default-fast` | linear | 50 ms |
| `motion-transition-open` | `motion/transition/open` | enter | 200 ms |
| `motion-transition-dismiss` | `motion/transition/dismiss` | linear | 80 ms |
| `motion-transition-slide-in` | `motion/transition/slide-in` | enter | 300 ms |
| `motion-transition-slide-out` | `motion/transition/slide-out` | default | 200 ms |

To check with the motion owner and the code:

- The enter easing is written two ways in the docs. The code is the tie-breaker.
- The docs say "six pairs" and list seven; `slide-out` has no description.
- The duration names (`short-1`) become the millisecond value (`050`) under the grammar's
  scale rule. The owner of motion may prefer the words.
- A 462 ms spring appears in an example and is not a token.
- Whether a transition, which is a pair, has a Figma form. A timing variable and an
  easing variable each do; the pair may have to stay in the token file only.

## Opacity, shadow and elevation

**What exists today.**

- No opacity variables. The docs say a disabled component is the whole component at
  reduced opacity; no value is written down.
- Merge intensity, five steps, used for hover and pressed grounds: 5, 10, 15, 20 and 25
  percent of near-black in light and of white in dark, plus an inverse set.
- Scrim: black at 60 percent, in both modes.
- Four shadow levels as effect styles, each two drop shadows of black with raw values:
  level 1 (0 4 8 at 8%, 0 0 1 at 4%), level 2 (0 4 6 -1 at 10%, 0 2 4 -2 at 10%), level
  3 (0 4 6 at 5%, 0 10 15 at 10%), level 4 (0 10 10 at 4%, 0 20 25 at 10%).
- Four elevation surfaces as paint styles: the primary background plus a white overlay
  that is 0 percent in light and 0, 2, 3, 4 percent in dark.
- In the work file the color engine's plugin writes to, 23 rows the engine stopped
  writing in 0.7.0 are still there under a `utility` group, in the collection with light
  and dark modes: four surfaces (each an alias to a neutral paper, a different one per
  mode), three shadows and a scrim (black at an alpha), absolute black and white, five
  alpha rows, and the eight opacity numbers. The plugin neither moves nor deletes them.
  The surfaces, shadows and scrim are the rows this section names; the opacity numbers
  are the `opacity` scale, which now lives in the unmoded collection, and a variable
  cannot change collection in Figma without being recreated, so moving them is a
  rebinding step to plan; the absolute and alpha rows were alias targets for engine rows
  that no longer point at them, so their use is checked before they are kept.

**What the color engine work already settled, as a reference.** An eight-step opacity
scale (4, 8, 12, 16, 24, 32, 48, 64 percent); shadows as black at 4, 8, 12 percent in
light and 32, 48, 64 in dark; the scrim as black at 64; disabled at 38 percent; state
grounds as a family's color at 12, 16, 24, 32 percent (or 0, 8, 12, 16 for the quietest
tier); elevation as planes on the neutral scale, with no overlay. One standing ruling: a
shadow is dark, never a colored glow.

**Proposed.**

Primitives: one standard opacity scale, the eight steps the color engine work settled
on, as plain numbers with no color and no mode.

| Path | Value |
| --- | --- |
| `opacity/004`, `008`, `012`, `016`, `024`, `032`, `048`, `064` | the percent |

Semantic: today's merge intensity and the engine's retired utility values, combined.
Each row is a color at a step of the scale.

| Path | Value | Replaces |
| --- | --- | --- |
| `color/neutral-strong/hint-bg-hover`, `-pressed`, `-selected` | an alias to the dark pole (black in light, white in dark), paired with `opacity/hint/hover` 8, `/pressed` 12, `/selected` 16 | merge intensity 1, 2, 3 (5, 10, 15 percent) |
| `color/neutral-strong/subtle-bg-enabled`, `-hover`, `-pressed`, `-selected` | an alias to the dark pole, paired with `opacity/subtle/enabled` 12, `/hover` 16, `/pressed` 24, `/selected` 32 | merge intensity 2 to 5 (10 to 25 percent) |
| `color/neutral-inverse/…` the same rows | an alias to the light pole, the same opacity pairs | the merge intensity inverse set |
| `color/<family>/subtle-bg-…` and `hint-bg-…` | an alias to that family's color, the same opacity pairs | nothing today; hover and pressed on a colored ground |
| `opacity/subtle/…`, `opacity/hint/…` | the semantic opacity steps the pairs above name, each an alias to the opacity scale | the alpha written into merge intensity |
| `color/scrim` | black at 64 | the scrim at 60 percent |
| `shadow/100`, `200`, `300`, `400` | the four levels' offsets and blurs; black at 4, 8, 12 in light and 32, 48, 64 in dark | the four effect styles |
| `opacity/disabled` | 38 percent | the undocumented disabled value |
| elevation surfaces, as color roles on the neutral scale | one neutral step per level, per mode | the four paint styles and the dark overlays |

To decide:

- Which merge step maps to which row. The five merge steps are 5 apart; the scale's
  steps are not, so the match is close, not exact.
- The disabled value. 38 percent is the reference and is not a step of the scale;
  today's components may use another.
- Four shadow levels against three alpha steps per mode: either two levels share a step,
  or the shadows use four.
- Whether the four shadow levels keep their current offsets and blurs.
- Shadow and scrim need a light and a dark value, so they sit with color's contexts.
- A translucent role is always emitted as its pair, the color alias and the opacity
  token, never as a computed color (ruled 2026-10-05). Figma composes the pair by hand
  until the plugin API can, and the code pipeline composes it in CSS.

## Typography

What the docs add to the audit page:

- Display and heading are "dynamic" on web: they change size between mobile and desktop.
  Title, body, link, tabular number, button and code are fixed.
- Styles are either hierarchical (display, heading, title, body) or functional (button,
  link, tabular number, code).
- Fallbacks: the generic sans for the main face, the generic monospace for code.

For the declaration:

- A shared size scale for web needs eleven steps: 12, 14, 15, 18, 20, 26, 32, 40, 48, 60,
  72. On the same rule as space those are `font/size/300` to `font/size/1800`.
- The eight iOS larger-text modes are dropped. A user's text-size setting is applied by
  the operating system from a style's base size (iOS scales a style against the system
  text style it is declared relative to; React Native multiplies by the system factor),
  so a hand-kept table of sizes per setting can only drift from what the device does,
  and today's table does drift: it reaches 30 px for body text at the largest setting
  where the system would reach about 53. Designers judge text by viewport, so the type
  modes become the four viewports. Tablet and wide take the desktop sizes until a
  designer rules otherwise. What each style scales relative to on native is declared
  when the mobile approach is decided.
- Line heights are two: 1.25 and 1.5.
- Letter spacing is written in percent of the font size (0, -0.1, -1, -1.5, -2). The
  token format's length type takes px or rem only, so each style's letter spacing has to
  be stored as a computed length or as a plain number.

## The component property glossary

The docs file holds the property names as variables, with a design name and an
engineering name for each. Where it meets the grammar:

- State layer values: Enabled, Hover, Pressed. Conditions: Disabled, Loading,
  Destructive, Locked, Error, Selected, Entered.
- Boolean conditions with engineering names: `isDisabled`, `isDismissible`, `isElevated`,
  `isExpanded`, `hasLink`, `isLoading`, `isLocked`, `isProcessing`, `isRequired`,
  `isSelected`, `isTruncated`, `isIndeterminate`.
- Size values: 2xs, xs, sm, md, lg, xl, 2xl.
- Color values: Neutral, Neutral secondary, Brand, Brand accent, Negative, Warning,
  Positive, Inverse. These are the words to map onto the color engine's families
  (neutral, brand, brand-alt, critical, warning, positive, info).
- Kind values: Fill, Outline, Ghost. The engineering name for kind is `variant`.
