# Color fork: answers for the mapping agent

Decided by the owner on 2026-10-14 for this test. The stamp list has not yet been run
through by hand. Roles are spelled as `docs/color-semantic-set.md` spells them; use no
other. `F` is the family: `brand`, `critical` (from error), `positive` (from success),
`warning`. `info` has no old row; the info variants of components read it (rule 9).

## The rules under every class

1. **Components on the stamp**, a closed list for this test: Button (solid and
   destructive), InteractiveChip, Badge, Progress, Checkbox (checked), Switch (on), Radio
   (checked), DatePicker (the selected day), and hand-rolled buttons until they adopt the
   Button. Fill `bg/F/solid/enabled`, hover `bg/F/solid/hover`, pressed
   `bg/F/solid/pressed`; edge `border/F/solid`; the label, check mark or thumb on it
   `fg/F/on-solid`.
2. **Pressable is the stamp.** A `<button>`, `<Pressable>`, `<TouchableOpacity>`,
   `role="button"`, an `onPress` or `onClick` on the element or its nearest wrapper, a
   Button component, or a button base class: the stamp, as rule 1.
3. **Not pressable, a colored fill with light text:** `bg/F/accent` with
   `fg/neutral/on-inverse/strong`. A dark neutral fill with light text that is not
   interactive: `surface/inverse` with `fg/neutral/on-inverse/strong`.
4. **Selected and checked are the solid at `enabled`**, with `hover` and `pressed`. The
   solid has no `selected`. Unselected is another family's solid (the chip) or no fill (a
   control).
5. **Shades are not roles.** `-dark`, `-darker`, `-darkest` and `-light` drop. `hover:`
   is the `/hover` step, `active:` the `/pressed` step, whichever shade the code used.
   `focus:` never moves a fill; the ring is `border/neutral/focus`. Where a native
   component uses `focus:` as its press feedback and has no `active:`, it is `/pressed`.
6. **Link or text button.** Navigation (`<a>`, `href`, a router `Link`, `navigate(`,
   `router.push(`, `navigation.navigate(`): `fg/link/enabled|hover|pressed`, on an
   inverted ground `fg/link/on-inverse/*`. A text button: the label stays `fg/F/accent`
   and hover and press add `bg/F/ghost/hover|pressed` behind it. Undecidable: list it.
7. **Reserved rows.** Product code may bind `bg/F/solid/*`, `border/F/solid`,
   `fg/F/on-solid` and the ghost rows for this test. Flag every product site that binds a
   solid row for adoption of the Button.
8. **A hover shade on something that is not a stamp** means it is interactive after all:
   re-read it as a button, chip or row and class it there. The accent fill has no states.
9. **Info variants are the info family.** A component variant, status or class-map key
   named `info`, `information` or `informational` that reads the brand today takes the
   `info` family's row of the same job: class the row by its job first (rules 1 to 3),
   then write `info` where the family goes. The brand stays the brand only where the use
   is identity, not status.

## By class

**D0.** Text and borders on `fg/F/accent` and `border/F/accent`: yes. Focus rings:
`border/neutral/focus`. Resting labels of text buttons: `fg/F/accent`. One correction: a
focused input's edge is `border/neutral/focus`, not `border/brand/accent`; an input in
error is `border/critical/accent`; a resting input edge is `border/neutral/regular`.

**D1.** Yes, all on the stamp. Button solid: rule 1. Checkbox checked and indeterminate,
Switch on: `bg/brand/solid/enabled`, the check mark or thumb `fg/brand/on-solid`, hover
and pressed the solid's steps, focus `border/neutral/focus`; unchecked has no fill and
`border/neutral/regular`. Radio checked: the dot `bg/brand/solid/enabled`; the ring
`border/brand/accent`, because the solid's edge is gated and a ring must always show
(see Open).

**D2.** Not always. Pressable: the stamp (rule 2). Otherwise rule 3. All three samples are
buttons.

**D3.** Yes, normalize, by rule 5.

**D4.** Yes, delete the redundant class; mark the class for an engineer's check. The
conditional filter chip is a chip: selected `bg/brand/solid/enabled`, unselected
`bg/neutral/solid/enabled` (D11).

**D5.** Yes, pressable is the stamp (rule 2), and flag for the Button (rule 7). A
button-shaped fill with no press in reach stays in D14.

**D6.** Yes: `bg/critical/solid/enabled|hover|pressed`, `border/critical/solid`,
`fg/critical/on-solid`.

**D7.** By rule 6. `brand-primary-light` text is a shade with no role: link or text by the
same tell.

**D8.** The ghost ground: the label stays `fg/F/accent`; hover `bg/F/ghost/hover`, press
`bg/F/ghost/pressed`. A visible change: the label no longer darkens; a tint appears.

**D9.** Badge and Progress: the stamp, `bg/F/solid/enabled` with `fg/F/on-solid`. The
Progress info variant: `bg/info/solid/enabled`, by rule 9. Other marks, carousel and pager dots and a
wizard bar outside Progress: `bg/F/accent`; the inactive dot and the track
`bg/neutral/muted`. A solid toast: `bg/F/accent` with `fg/neutral/on-inverse/strong`.

**D10.** Ghost: `bg/brand/ghost/selected`; the text stays `fg/neutral/regular`; the `/10`
drops.

**D11.** The interactive chip is the stamp. Brand variant selected:
`bg/brand/solid/enabled|hover|pressed`, `fg/brand/on-solid`, `border/brand/solid`.
Darker neutral variant selected: the same rows under `brand-alt`. Unselected: the same
rows under `neutral`. The indicator chip, a tag with no interaction, is
`bg/F/soft/enabled` with `fg/F/regular`.

**D12.** (a) Tab indicator: `bg/brand/accent` as a drawn bar, `border/brand/accent` as a
border-bottom, the same stop; labels `fg/brand/accent`. (b) Selected day:
`bg/brand/solid/enabled` with `fg/brand/on-solid`; today's ring `border/brand/accent`.

**D13.** Gradient bars: `illustration/pencil`, `illustration/highlighter`,
`illustration/chalk-light`, or the base tokens `color/brand/pencil-47`, `highlighter-26`,
`chalk-11` directly. Avatar with initials: rule 3, `bg/brand/accent` with
`fg/neutral/on-inverse/strong`.

**D14.** No rule from the string. Rule 2 first; a `.form-control .bg-…` selector is a
selected control until the screen says otherwise; the rest stays listed.

**Visited.** Dropped for this test; a visited link stays `fg/link/enabled`. Provisional.

## Open

- The stamp list, run through by hand.
- The radio ring: the stamp has no always-visible border row, so the ring is the accent
  border and the dot the stamp; their values may differ slightly.
- A visited posture: an engine question first, a state word after.
- D4: the engineer's check on deleting redundant Button overrides.
