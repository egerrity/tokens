# Color by component

Which row of the semantic color set a component's colors take, read from what the
component is and does. For an agent mapping the old rows to the set, in code or in a
Figma file, and for anyone giving color to a new component. The set is
`color-semantic-set.md`; the migration of each old row is `color-role-map.md`. An old row
that did several jobs has one home in the role map and several here, because the
component tells the jobs apart.

## The forks

Five questions settle most assignments. Each is answered from the element, never from
the color it has today.

1. **Pressable, or not.** A fill that invites a press is the stamp:
   `bg/<family>/solid/enabled`, `hover` and `pressed`, its edge `border/<family>/solid`,
   the label or mark on it `fg/<family>/on-solid`. A colored fill with light text that is
   not pressed is the accent ground, `bg/<family>/accent`, with
   `fg/neutral/on-inverse/strong`. A dark neutral fill with light text that is not pressed
   is `surface/inverse`, with the same text. The components on the stamp are a closed list
   (below); a pressable outside the list takes the stamp and is flagged to adopt the
   library's component.
2. **A plane, or a ground.** The page and what rests on it are surfaces, `surface/dim`,
   `low`, `mid` and `high`, which reverse with the mode, and `surface/inverse` and
   `surface/scrim`. A component's own fill is a `bg` row and does not reverse. The
   background of a page, a card, a menu, a dialog or an input is a surface; the fill of a
   badge, a chip, a bar or a dot is a ground.
3. **A link, or a text button.** Text that navigates takes the link rows,
   `fg/link/enabled`, `hover` and `pressed`, and on an inverted ground
   `fg/link/on-inverse/enabled`, `hover` and `pressed`. Text that acts is
   `fg/<family>/accent`, and its hover and press are the ghost ground behind it,
   `bg/<family>/ghost/hover` and `pressed`. At rest both resolve to the same stop; the
   fork is the progression.
4. **A state, or a shade.** The old names' `-dark`, `-darker`, `-darkest` and `-light` are
   not roles. A use is classed by its job and by the state it appears under: `hover:` is
   the `hover` step, `active:` the `pressed` step; `focus:` never moves a fill, because
   the focus ring is `border/neutral/focus` on every control. Selected and checked are the
   solid at `enabled`; the solid has no `selected`, so an unselected state is another
   family's solid or no fill.
5. **Identity, or status.** The brand's rows carry the brand's identity; a status takes
   its signal family, `critical`, `warning`, `positive` or `info`. A component variant
   named `info` that reads the brand today is the info family: class the use by its job
   first, then write `info` where the family goes.

## The tells

In code, the element and its handler decide pressable: a `<button>`, a `<Pressable>`, a
`<TouchableOpacity>`, `role="button"`, an `onPress` or `onClick` on the element or its
nearest wrapper, a Button component, a button base class. The class decides the property
(`bg-`, `text-`, `border-`), the prefix decides the state (`hover:`, `active:`, `focus:`,
`data-[state=checked]`, `data-[state=active]`), a variant key or prop value decides the
family (`info`, `error`, `success`, `warning`, `brand`), and navigation decides a link
(`<a>`, `href`, a router `Link`, `navigate(`). A use none of these decide is listed, never
guessed.

In a Figma file, the layer's kind decides the property: a fill, a stroke or a text. The
nearest component or frame ancestor's name decides the component, and a name with
`button`, `btn` or `cta` in it makes a fill the stamp and a text its on-text. A bound
variable's old name decides the family by its word (`brand`, `error`, `success`,
`warning`) and the job by its suffix; the mode is read from the file. Picks land per
cluster of like elements, one old row under one kind under one ancestor, never per file.

## The components on the stamp

A closed list, ruled for the code-side test and not yet run through by hand; the set's
Ruled section carries the ruling.

| Component | On the stamp |
| --- | --- |
| Button, solid and destructive | the fill, its edge, its label |
| Interactive chip | the chip, selected and unselected, by family |
| Badge | the fill |
| Progress | the bar |
| Checkbox, Switch | the checked fill, the on track |
| Radio | the checked dot |
| Date picker | the selected day |
| A hand-rolled button | the fill, flagged to adopt the Button |

## By component

"The set" means the word tables and the levels in `color-semantic-set.md`; "ruled for the
test" means the ruling in its Ruled section; "derived" follows from the set and has no
ruling of its own.

| Component | Part | Role | Decided by |
| --- | --- | --- | --- |
| Button, solid and destructive | fill at rest, hover, pressed | `bg/<family>/solid/enabled`, `bg/<family>/solid/hover`, `bg/<family>/solid/pressed` | the set |
| | edge | `border/<family>/solid` | the set |
| | label, icon | `fg/<family>/on-solid` | the set |
| Button, text and ghost; icon button | label, icon | `fg/<family>/accent` | ruled for the test |
| | hover, pressed | `bg/<family>/ghost/hover`, `bg/<family>/ghost/pressed` behind the label | ruled for the test |
| Button, outline | edge | `border/<family>/accent` | derived from the role map; open |
| | fill, label | as the ghost button | derived |
| Any control | focus | `border/neutral/focus` | the set |
| | disabled | `opacity/disabled` on the whole component, never a color | the set |
| Link | text at rest, hover, pressed | `fg/link/enabled`, `fg/link/hover`, `fg/link/pressed` | the set |
| | on an inverted ground | `fg/link/on-inverse/enabled`, `fg/link/on-inverse/hover`, `fg/link/on-inverse/pressed` | the set |
| | visited | no row; stays `fg/link/enabled` | ruled for the test, provisional |
| Checkbox, Switch | checked fill, on track; hover, pressed | `bg/brand/solid/enabled`, `bg/brand/solid/hover`, `bg/brand/solid/pressed` | ruled for the test |
| | check mark, thumb | `fg/brand/on-solid` | ruled for the test |
| | unchecked, off | no fill; edge `border/neutral/regular` | the set |
| Radio | checked dot | `bg/brand/solid/enabled` | ruled for the test |
| | ring | `border/brand/accent` | open |
| Interactive chip | selected, brand variant | `bg/brand/solid/enabled`, `bg/brand/solid/hover`, `bg/brand/solid/pressed`; `fg/brand/on-solid`; `border/brand/solid` | ruled for the test |
| | selected, darker neutral variant | the same rows under `brand-alt` | ruled for the test |
| | unselected | the same rows under `neutral` | ruled for the test |
| Indicator chip, a tag | fill | `bg/<family>/soft/enabled` | ruled for the test |
| | text | `fg/<family>/regular` | derived |
| Badge | fill | `bg/<family>/solid/enabled` | ruled for the test |
| | text | `fg/<family>/on-solid` | ruled for the test |
| Progress | bar | `bg/<family>/solid/enabled`; the info variant under `info` | ruled for the test |
| | track | `bg/neutral/muted` | derived |
| Carousel, pager | active dot | `bg/brand/accent` | derived |
| | inactive dot | `bg/neutral/muted` | derived |
| Tabs, underlined; segmented control | selected label | `fg/brand/accent` | ruled for the test |
| | indicator | `bg/brand/accent` as a bar; `border/brand/accent` as a border-bottom | ruled for the test |
| Tabs, filled | selected tab | `bg/<family>/soft/selected`, `bg/<family>/soft/selected-hover`, `bg/<family>/soft/selected-pressed`; label `fg/<family>/regular` | the set |
| Date picker | selected day | `bg/brand/solid/enabled`; label `fg/brand/on-solid` | ruled for the test |
| | today | `border/brand/accent`; label `fg/brand/accent` | derived |
| | a day under the pointer | `bg/neutral/ghost/hover` | derived |
| List row, menu item | hover, pressed | `bg/neutral/ghost/hover`, `bg/neutral/ghost/pressed` | the set |
| | selected, tinted | `bg/brand/ghost/selected` | ruled for the test |
| | text | `fg/neutral/regular`, unchanged by the ground | the set |
| Input | fill | `surface/high` | the set |
| | edge at rest; focused; in error | `border/neutral/regular`; `border/neutral/focus`; `border/critical/accent` | the set; ruled for the test |
| Alert, callout, banner | ground | `bg/<family>/regular` | the set |
| | border | `border/<family>/muted` | the set |
| | text; icon | `fg/<family>/regular`; `fg/<family>/accent` | the set |
| Toast, solid | ground | `bg/<family>/accent` | ruled for the test |
| | text | `fg/neutral/on-inverse/strong` | ruled for the test |
| Inverted banner, card, toast | ground | `surface/inverse`; not interactive | the set |
| | text; border; links | `fg/neutral/on-inverse/regular`, `fg/neutral/on-inverse/strong`; `border/neutral/inverse`; `fg/link/on-inverse/enabled` and its steps | the set |
| Avatar with initials | disc | `bg/brand/accent` | ruled for the test |
| | initials | `fg/neutral/on-inverse/strong` | ruled for the test |
| Page; well; panel | plane | `surface/dim`; `surface/low`; `surface/mid` | the set |
| Card; menu; dialog | plane and shadow | `surface/high` with `shadow/raised`; `shadow/floating`; `shadow/overlay` | the set |
| | card edge | `border/neutral/hint` | the set |
| Divider | line; a strong one | `border/neutral/hint`; `border/neutral/muted` | the set |
| Scrim | fill | `surface/scrim` | the set |
| Skeleton | fill; start; end | `surface/low`; `surface/mid`; `surface/dim` | the role map |
| Icon | beside text | the text's row | derived |
| | a status icon | `fg/<family>/accent` | the role map |
| | standalone, a shape | `fg/<family>/hint` | the set; open |
| Decoration | gradient, illustration | `illustration/pencil`, `illustration/highlighter`, `illustration/chalk-light` and the rest of the illustration palette, or a color base token directly | ruled for the test |

## Open

- The stamp list, run through by hand.
- The radio ring: the stamp has no border row that always shows, so the ring is the
  accent border and the dot the stamp, and their values may differ.
- The outline button's edge: the accent border, or the regular one.
- The progress track and the inactive dot on `bg/neutral/muted`: derived, not ruled.
- A standalone icon: the hint stop, or the accent.
- Visited links: an engine posture first, a state word after.
- Reserved rows bound from product code, beyond the test.
- Text buttons: a hover ground is the stated direction; no component tokens until it is
  decided.
