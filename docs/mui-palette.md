# MUI's palette from the semantic set

Ruled by the owner on every open row, as a supplement to the mapping the application's
agent is building. Nothing below is built here; the "What to build" section at the end
lists the pieces, and `prompts/mui-palette-build.md` carries the recommendation and the
stages for the agent folding these rulings into its mapping. The page is written against MUI 9, the current
major; the application has no MUI today, so there is no older version to meet. It was
written against another copy of this repository, so every role path and base-token path
below is checked against this copy's `dist/tokens/` before anything is built.

MUI's theme has a palette: a fixed set of slots its components read. This page maps every
slot of a stock MUI 9 theme with CSS variables on, both schemes, onto one role of the
semantic set, or records why a slot has no honest role. The theme file a brand's theme
folder would carry is a transcription of this page: one hex per slot per mode, resolved the
way `mobile/colors.ts` resolves a role, never a reference to a CSS variable, because MUI
derives alpha channels from each palette value and cannot decompose a reference.

Three rules shape every row:

- **A slot holds one role, the same in both modes.** The reversal between light and dark
  lives in the roles, so a slot never names a mode.
- **No slot holds the stamp.** MUI's `main` reaches text, icons, borders and fills alike,
  and the stamp is a fill with its own text. The components on the stamp read the solid
  rows through overrides, never through the palette.
- **A slot the set cannot name honestly is a gap, not a guess.** The theme file writes a
  visible sentinel there, and the audit lists the reads an override must cover.
- **A slot whose MUI value is right and has no word in the set is left to MUI, by name.**
  The declaration says so, the theme file writes nothing for it, and totality still holds;
  it is not a gap, so no sentinel.

"The set" means the word tables and the levels in `color-semantic-set.md`; "by component"
means the table in `color-by-component.md`; "derived" follows from those and has no ruling
of its own; "open" needs one.

## The families

| MUI color | Family |
| --- | --- |
| `primary` | `brand` |
| `secondary` | `brand-alt` |
| `error` | `critical` |
| `warning` | `warning` |
| `info` | `info` |
| `success` | `positive` |
| `neutral` | `neutral`, a key this theme adds; MUI's `inherit` is not a palette key |

## The four slots of every family

Each family column has the same four slots. `<F>` is the family from the table above.

| Slot | Role | Decided by |
| --- | --- | --- |
| `main` | `fg/<F>/accent` | the set: `accent` names the same stop in `fg`, `bg` and `border`, so one role serves MUI's text reads and its fill reads alike |
| `contrastText` | `fg/neutral/on-inverse/strong` | the set: the accent fill takes the on-inverse text; by component: toast and avatar |
| `light` | `fg/<F>/accent`, an alias of `main` | inert; see "The slots that cannot be left out" |
| `dark` | `fg/<F>/accent`, an alias of `main` | inert; see "The slots that cannot be left out" |

### The slots that cannot be left out

MUI fills a missing `light` or `dark` from `main`, lightened and darkened by a fixed
amount, so leaving them out means MUI invents two colors per family. In the MUI 9
component source, `dark` is read only as the hover or focus fill of a filled thing in that
color (the contained Button, the Fab, the selected pagination item, the clickable or
deletable Chip, the Chip avatar, the divider inside a contained ButtonGroup), and `light`
only by the Alert (the standard variant's derived text and ground, the outlined variant's
border). Every one of those components is on the stamp or has its own rows below, and
reads the set through an override. With the overrides in place nothing reads `light` or
`dark`; they alias `main` so the theme is total, and a missed override shows as a missing
hover rather than an invented color.

## Text, background, divider, common

| Slot | Role | Decided by |
| --- | --- | --- |
| `text.primary` | `fg/neutral/regular` | the set |
| `text.secondary` | `fg/neutral/muted` | the set: today's Content Secondary lands here |
| `text.disabled` | gap: `opacity/disabled` on the whole component | the set: disabled is not a color |
| `text.icon` | `fg/neutral/hint` | the set: a standalone icon is a shape; open there |
| `background.default` | `surface/dim` | by component: the page |
| `background.paper` | `surface/high` | by component: card, menu, dialog |
| `divider` | `border/neutral/hint` | by component: the divider |
| `common.white` | left to MUI: its constant white | ruled: the set has no mode-stable light text word; the reads are the image bar's caption over its own black overlay and the body when printing, both right in white; the tooltip and the slider bubble read the on-inverse words through overrides |
| `common.black` | left to MUI: its constant black | ruled, as above; no component reads it |
| `common.background` | `color/neutral/paper-0` | derived: MUI's own definition is the mode's pole |
| `common.onBackground` | `color/neutral/pen-100` | derived, as above |

## Action

MUI's action slots are the neutral's interaction grounds and the multipliers its
components apply to `main` for their own state grounds. The grounds take the ghost level;
the multipliers are set to zero, so a component that still derives its own ground renders
no feedback rather than an invented tint, and the override gives it the set's pair.

| Slot | Role | Decided by |
| --- | --- | --- |
| `action.active` | `fg/neutral/hint` | the set: icons at rest are the highlighter |
| `action.hover` | `bg/neutral/ghost/hover`, folded with `opacity/ghost/hover` | the set |
| `action.selected` | `bg/neutral/ghost/selected`, folded with `opacity/ghost/selected` | the set |
| `action.focus` | gap: focus is the ring, `border/neutral/focus`, never a ground | the set |
| `action.disabled` | gap: `opacity/disabled` | the set |
| `action.disabledBackground` | gap: `opacity/disabled` | the set |
| `action.hoverOpacity` | 0 | derived: the multiplier rule above |
| `action.selectedOpacity` | 0 | derived |
| `action.focusOpacity` | 0 | derived |
| `action.activatedOpacity` | 0 | derived |
| `action.disabledOpacity` | `opacity/disabled` | the set |

## Grey

MUI's own components read the grey slots only through the component tokens below, which
this page fills explicitly, so the grey slots exist for totality and for third-party code
that reads them. They take the neutral's base tokens by nearest lightness and are never
authored against. Because a base token reverses with the mode, a grey slot reverses too,
which is why every component token MUI would otherwise derive from grey is written out.

| Slot | Base token |
| --- | --- |
| `grey.50` | `color/neutral/paper-1` |
| `grey.100` | `color/neutral/paper-3` |
| `grey.200` | `color/neutral/paper-5` |
| `grey.300` | `color/neutral/chalk-8` |
| `grey.400` | `color/neutral/chalk-20` |
| `grey.500` | `color/neutral/highlighter-26` |
| `grey.600` | `color/neutral/pencil-47` |
| `grey.700` | `color/neutral/pen-58` |
| `grey.800` | `color/neutral/pen-70` |
| `grey.900` | `color/neutral/pen-100` |
| `grey.A100` | `color/neutral/chalk-11` |
| `grey.A200` | `color/neutral/chalk-20` |
| `grey.A400` | `color/neutral/pencil-47` |
| `grey.A700` | `color/neutral/pen-70` |

## The component tokens

With CSS variables on, MUI's components read these slots instead of deriving colors at
render time. `<c>` runs over `error`, `info`, `success`, `warning` and `<F>` is its family.

| Slot | Role | Decided by |
| --- | --- | --- |
| `Alert.<c>Color` | `fg/<F>/regular` | by component: the alert's text |
| `Alert.<c>StandardBg` | `bg/<F>/regular` | by component: the alert's ground |
| `Alert.<c>IconColor` | `fg/<F>/accent` | by component: the alert's icon |
| `Alert.<c>FilledBg` | `bg/<F>/accent` | by component: a solid toast is not pressable, so it is the accent ground, not the stamp |
| `Alert.<c>FilledColor` | `fg/neutral/on-inverse/strong` | by component: the solid toast's text |
| `AppBar.defaultBg` | `surface/high` | ruled: the bar lifts off the page the way a card does; its shadow is `shadow/raised` |
| `AppBar.darkBg` | `surface/high` | ruled: the same plane in both of MUI's slots; the role reverses |
| `AppBar.darkColor` | `fg/neutral/regular` | derived |
| `Avatar.defaultBg` | `bg/brand/accent` | by component: the avatar's disc |
| `Button.inheritContainedBg` | `bg/neutral/solid/enabled` | the set: `inherit` is the neutral's solid |
| `Button.inheritContainedHoverBg` | `bg/neutral/solid/hover` | the set |
| `Chip.defaultBorder` | `border/neutral/regular` | the set: a control's edge |
| `Chip.defaultAvatarColor` | `fg/neutral/on-inverse/strong` | by component: the initials over the disc |
| `Chip.defaultIconColor` | `fg/neutral/regular` | by component: an icon beside text takes the text's row |
| `FilledInput.bg` | `surface/high` | ruled: the set has one input, so the filled variant renders as the outlined one |
| `FilledInput.hoverBg` | `surface/high` | ruled: the input's state is on its edge |
| `FilledInput.disabledBg` | gap: `opacity/disabled` | the set |
| `LinearProgress.<color>Bg` | `bg/neutral/muted`, every color | by component: the progress track |
| `Skeleton.bg` | `surface/low` | by component: the skeleton's fill |
| `Slider.<color>Track` | `bg/neutral/muted`, every color | ruled: the inverted track takes the progress track; the thumb and filled track are in the overrides |
| `SnackbarContent.bg` | `surface/inverse` | by component: the inverted toast |
| `SnackbarContent.color` | `fg/neutral/on-inverse/regular` | by component |
| `SpeedDialAction.fabHoverBg` | `bg/neutral/solid/hover` | ruled: a floating button is a Button; the neutral's solid, as the inherit contained Button |
| `StepConnector.border` | `border/neutral/muted` | by component: a strong divider |
| `StepContent.border` | `border/neutral/muted` | derived, as above |
| `Switch.defaultColor` | `bg/neutral/accent` | ruled: the knob carries the control's visibility once the off track is a hollow pill |
| `Switch.defaultDisabledColor` and the six `<color>DisabledColor` | gap: `opacity/disabled` | the set |
| `TableCell.border` | `border/neutral/hint` | by component: the divider |
| `Tooltip.bg` | `surface/inverse` | by component: the inverted toast; the text is an override below |

Three palette entries are not colors. `mode` is the scheme's own. `tonalOffset` and
`contrastThreshold` are the inputs MUI uses to derive the slots this page fills, so with
every slot given they do nothing; they keep MUI's defaults and are not tokens.

## The overrides

MUI's components read `main`, `dark`, `contrastText` and the action multipliers for
their fills and states. Where the set names those otherwise, the component reads the set
through an override, which the theme file carries beside the palette. The rows below are
the reads found in the MUI 9 source; the roles come from the by-component table, re-keyed
to MUI's names.

| MUI component | Part | Role | Decided by |
| --- | --- | --- | --- |
| Button, contained | fill at rest, hover, pressed | `bg/<F>/solid/enabled`, `bg/<F>/solid/hover`, `bg/<F>/solid/pressed` | by component |
| | label, icon | `fg/<F>/on-solid` | by component |
| | edge | `border/<F>/solid` | by component |
| Button, contained, `inherit` | pressed; label; edge | the same rows under `neutral` | the set |
| Button, text and outlined; IconButton | label, icon | `fg/<F>/accent`, which `main` already holds; no override | by component |
| | hover, pressed ground | `bg/<F>/ghost/hover`, `bg/<F>/ghost/pressed` | by component |
| Button, outlined | edge | `border/<F>/accent` | by component; open there |
| Fab, a color | as the contained Button | the family's solid rows | ruled: a floating button is a Button |
| Fab, default; SpeedDial action | rest, hover, pressed; icon; edge | `bg/neutral/solid/enabled`, `bg/neutral/solid/hover`, `bg/neutral/solid/pressed`; `fg/neutral/on-solid`; `border/neutral/solid` | ruled: as the inherit contained Button; MUI draws the action as a paper disc and the default Fab in the inherit button's grey |
| ButtonGroup, contained | the line between buttons | `bg/<F>/solid/hover` | derived: one step from the fill, the same quiet line in every family; the edge row resolves to transparent and would merge the group; the library has no button group today |
| Chip, clickable, a color | selected | `bg/<F>/solid/enabled`, `bg/<F>/solid/hover`, `bg/<F>/solid/pressed`; `fg/<F>/on-solid`; `border/<F>/solid` | by component: the interactive chip |
| | unselected | the same rows under `neutral` | by component |
| Chip, deletable | focus ground | `bg/<F>/solid/hover` | derived |
| Chip, a color, not clickable | fill; text | `bg/<F>/soft/enabled`; `fg/<F>/regular` | by component: the indicator chip |
| Chip, default | fill; text | `bg/neutral/soft/enabled`; `fg/neutral/regular` | derived from the indicator chip |
| Chip avatar, `primary` and `secondary` | disc; initials | `bg/<F>/accent`; `fg/neutral/on-inverse/strong` | by component: the avatar |
| PaginationItem, selected | fill at rest, hover, pressed; label | the solid rows; `fg/<F>/on-solid` | derived: selected is the solid |
| Badge | fill; text | `bg/<F>/solid/enabled`; `fg/<F>/on-solid` | by component |
| Checkbox, Radio, Switch, checked or on | fill, track; mark, thumb | `bg/brand/solid/enabled` and its steps; `fg/brand/on-solid` | by component |
| | unchecked, off | no fill; edge `border/neutral/regular` | by component |
| Radio | ring | `border/brand/accent` | by component; open there |
| LinearProgress, CircularProgress | bar | `bg/<F>/solid/enabled` | by component |
| Tabs | indicator; selected label | `bg/brand/accent`; `fg/brand/accent`, which `main` holds; no override | by component |
| ToggleButton, selected | ground at rest, hover, pressed; label | `bg/<F>/soft/selected`, `bg/<F>/soft/selected-hover`, `bg/<F>/soft/selected-pressed`; `fg/<F>/regular` | by component: the filled tab |
| ListItemButton, MenuItem, selected | ground | `bg/brand/ghost/selected` | by component: the tinted row |
| Alert, outlined | border | `border/<F>/muted` | by component; this is the one read of `light` |
| Avatar | initials | `fg/neutral/on-inverse/strong` | by component |
| Tooltip | text | `fg/neutral/on-inverse/regular` | by component; MUI reads `common.white` |
| Link | text at rest, hover, pressed | `fg/link/enabled`, `fg/link/hover`, `fg/link/pressed` | by component |
| FilledInput | underline at rest, focused, in error | `border/neutral/regular`; `border/neutral/focus`; `border/critical/accent` | by component: the input's edge; MUI draws the underline from the page's text at a fixed opacity and in `main` when focused |
| Slider | thumb, filled track, marks | `bg/brand/accent`, which `main` holds; no override | ruled: the accent fill, not the stamp; the stamp list stays closed |
| | rail | `bg/neutral/muted` | by component: the progress track; MUI draws the rail as the track color at a fixed opacity |
| | hover and focus halo | none; focus is the ring, `border/neutral/focus` | the set: a glow in the brand color is a halo |
| | value bubble | `surface/inverse`; `fg/neutral/on-inverse/regular` | by component: the inverted toast; MUI reads a grey and the constant white |
| Any control | disabled | `opacity/disabled` on the whole component | the set; replaces every disabled color read |
| Any control | focus | the ring, `border/neutral/focus` | the set; replaces every focus ground read |

MUI draws a checked Checkbox as one glyph in `main` with the mark cut out, so the mark
takes `on-solid` only with a two-layer icon; the override says so for the agent wiring it.

## Found while drafting

The pairing check behind this page measures every role pairing a row proposes, from both
brands' resolved colors in both modes. Every pairing passes its bar but one, which is the
engine's claim, not this page's: the stamp's text is described as the text over the fill
at every step, and in dark mode the one- and two-step fills move toward the paper pole
while the text stays the white pole, so for the critical family at both steps and for the
brand-alt family at the pressed step the pairing reads under the text bar. The engine judges the
pole at rest and reads it on the pressed fill as a report, not a gate; the claim at every
step is the description's newer wording. The set aliases those steps as the solid's hover
and pressed grounds on that wording, so a contained button's hover and pressed carry it
too. The engine's ledger, entry C86 in okchroma's `docs/engine-spec/CATALOG.md`, holds the
measurements and the two ways to settle it;
until it is settled there nothing in this page changes, and the solid rows keep the
engine's values.

## Open

Nothing on this page. The by-component table's own open rows, the outlined Button's edge
and the Radio ring, stay open there and this page follows them when they are ruled.

## What to build

- `declarations/mui.ts`: this page as data, two tables, a slot to a role path, a gap, or
  left to MUI, and a component part to a role path.
- A third file in each brand's theme folder beside `variables.css` and `colors.ts`: the
  theme options, with `colorSchemes.light` and `colorSchemes.dark` resolved to hex, the
  overrides, and the sentinel in every gap.
- In the audit: every slot of a stock MUI theme is answered (the slot list committed under
  `mapping/`, generated once from MUI in a consuming app), every role path is a token, no
  literal color in the theme file, and every read in the committed reads list has an
  override row.
- `prompts/mui-palette-build.md`, in the staged shape of the other prompts, for the agent
  building the pieces above and wiring the theme file into the application.
