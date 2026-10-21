# Color by component, for MUI

The owner's rulings on the parts MUI's components have that the library's do not, and the
mechanics of how a MUI component takes a role from the set. It is a supplement to the
mapping an agent builds from the set onto MUI: a ruled row wins over that mapping; a
derived row is open, and a different answer is listed with its reason. The forks, the
tells and the library's own rows are in `color-by-component.md`, and a MUI component that
is not on this page takes its colors from those, as a derived row.

## How a MUI component takes a role

A role reaches a MUI component through the theme's style override for that component, by
variant and color prop, with the value written as the custom property the generator
already emits in `dist/brands/<brand>/web/variables.css`. Nothing is transcribed and no
color is typed into the application:

```ts
MuiButton: {
  styleOverrides: {
    root: {
      variants: [{
        props: { variant: 'contained', color: 'primary' },
        style: {
          backgroundColor: 'var(--ds-color-bg-brand-solid-enabled)',
          color: 'var(--ds-color-fg-brand-on-solid)',
          border: '1px solid var(--ds-color-border-brand-solid)',
          '&:hover': { backgroundColor: 'var(--ds-color-bg-brand-solid-hover)' },
          '&:active': { backgroundColor: 'var(--ds-color-bg-brand-solid-pressed)' },
        },
      }],
    },
  },
},
```

- **Mode and brand come from the attributes** the generated CSS switches on,
  `html[data-mode='dark']` and `html[data-brand='<brand>']`, so an override written once
  follows every mode and brand. If the application turns MUI's own CSS variables on, set
  MUI's color-scheme selector to the same `data-mode` attribute so MUI's internals agree.
- **The prefix** `ds` is this copy's, set in `declarations/prefix.ts`; the names below
  carry it, and a copy with another prefix reads them with its own.
- **The family** follows the color prop: `primary` is `brand`, `secondary` is `brand-alt`,
  `error` is `critical`, `warning` is `warning`, `info` is `info`, `success` is
  `positive`, `inherit` and no color are `neutral`. A row written with `<F>` holds for
  each.
- **A translucent role is a pair**, a color and an opacity token, and the CSS file emits
  the color half only, so the override composes it at use:
  `color-mix(in srgb, var(--ds-color-bg-brand-ghost-hover) calc(var(--ds-opacity-ghost-hover) * 100%), transparent)`,
  or a state layer with the color as its background and the opacity token as its
  opacity. The ghost and soft grounds and the scrim are pairs.
- **Reading a variable is safe; defining one is not.** MUI's `styleOverrides` mangles a
  custom-property key written into a style object, so a `var()` value is fine and a
  `--name: value` line is not; define any variable of the application's own in
  `GlobalStyles`.
- **MUI's palette is a backstop, not a source.** MUI's internals read the palette where an
  override cannot reach, so it is filled from the set's resolved values, hex per mode
  taken from the brand's `mobile/colors.ts`, with the sentinel `#ff00ff` in every slot the
  set has no color for. A component is never styled from the palette; a magenta anywhere
  is a read an override missed. The backstop is the appendix.
- **The engine is pinned and its values stand.** A white-text solid's hover and pressed
  fills in dark read under the text bar until the engine patch that fixes it is published
  and the pin is bumped (C86 in okchroma's ledger). It is not fixed locally.

## Buttons

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| Button | contained, at rest, hover, pressed | fill | `--ds-color-bg-<F>-solid-enabled`, `-hover`, `-pressed` | the set |
| | contained | label, icon | `--ds-color-fg-<F>-on-solid` | the set |
| | contained | edge | `--ds-color-border-<F>-solid` | the set |
| | contained, `inherit` | all parts | the same rows under `neutral` | the set |
| | text; IconButton | label, icon | `--ds-color-fg-<F>-accent` | ruled |
| | text; IconButton, hover, pressed | ground | `--ds-color-bg-<F>-ghost-hover`, `-pressed`, with `--ds-opacity-ghost-hover`, `-pressed` | ruled |
| | outlined | edge | `--ds-color-border-<F>-accent` | derived; open in the library's page |
| | outlined | fill, label, ground | as the text button | derived |
| Fab | a color | all parts | as the contained Button | ruled |
| | no color | all parts | the contained Button's rows under `neutral` | ruled |
| SpeedDialAction | | fab | the contained Button's rows under `neutral` | ruled |
| ButtonGroup | contained | the line between buttons | `--ds-color-bg-<F>-solid-hover` | ruled |
| | outlined, text | the line between buttons | `--ds-color-border-<F>-accent` | derived |
| ToggleButton | selected, at rest, hover, pressed | ground | `--ds-color-bg-<F>-soft-selected`, `-selected-hover`, `-selected-pressed`, with the matching `--ds-opacity-soft-*` | the set |
| | selected | label | `--ds-color-fg-<F>-regular` | the set |
| | unselected | label; edge | `--ds-color-fg-neutral-regular`; `--ds-color-border-neutral-regular` | derived |

## Chips, badges, avatars

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| Chip | clickable, a color, selected | fill at rest, hover, pressed; label; edge | `--ds-color-bg-<F>-solid-enabled`, `-hover`, `-pressed`; `--ds-color-fg-<F>-on-solid`; `--ds-color-border-<F>-solid` | ruled |
| | clickable, unselected | all parts | the same rows under `neutral` | ruled |
| | a color, not clickable | fill; label | `--ds-color-bg-<F>-soft-enabled` with `--ds-opacity-soft-enabled`; `--ds-color-fg-<F>-regular` | ruled |
| | default, not clickable | fill; label | the same rows under `neutral` | derived |
| | outlined | edge; label | `--ds-color-border-neutral-regular`; `--ds-color-fg-neutral-regular` | the set |
| | deletable, focused | ground | `--ds-color-bg-<F>-solid-hover` | derived |
| | with an icon | icon | the label's row | derived |
| | with an avatar | disc; initials | `--ds-color-bg-<F>-accent`; `--ds-color-fg-neutral-on-inverse-strong` | ruled |
| Badge | | fill; text | `--ds-color-bg-<F>-solid-enabled`; `--ds-color-fg-<F>-on-solid` | ruled |
| Avatar | | disc; initials | `--ds-color-bg-brand-accent`; `--ds-color-fg-neutral-on-inverse-strong` | ruled |

## Controls

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| Checkbox, Radio, Switch | checked, on; hover, pressed | fill, track | `--ds-color-bg-brand-solid-enabled`, `-hover`, `-pressed` | ruled |
| | checked, on | mark, dot, thumb | `--ds-color-fg-brand-on-solid` | ruled |
| | unchecked, off | fill; edge | none; `--ds-color-border-neutral-regular` | the set |
| | hover, pressed, around the control | ground | `--ds-color-bg-neutral-ghost-hover`, `-pressed`, with their opacity tokens | derived |
| Radio | | ring | `--ds-color-border-brand-accent` | open in the library's page |
| Switch | off | thumb | `--ds-color-bg-neutral-accent` | ruled |
| Slider | | thumb, filled track, marks | `--ds-color-bg-brand-accent` | ruled |
| | | rail | `--ds-color-bg-neutral-muted` | the set |
| | hover, focus | halo | none; focus is the ring | ruled |
| | | value bubble; its text | `--ds-color-surface-inverse`; `--ds-color-fg-neutral-on-inverse-regular` | ruled |
| Any control | disabled | the whole component | `--ds-opacity-disabled`; colors unchanged | the set |
| Any control | focused | ring | `--ds-color-border-neutral-focus`; no ground | the set |

MUI draws a checked Checkbox as one glyph in the control's color with the mark cut out,
so the mark takes its own row only with a two-layer icon.

## Progress

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| LinearProgress, CircularProgress | | bar | `--ds-color-bg-<F>-solid-enabled` | ruled |
| | | track | `--ds-color-bg-neutral-muted` | the set |
| Skeleton | | fill | `--ds-color-surface-low` | the set |

## Navigation

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| Tabs | | indicator | `--ds-color-bg-brand-accent` | ruled |
| Tab | selected; unselected | label | `--ds-color-fg-brand-accent`; `--ds-color-fg-neutral-muted` | ruled; derived |
| Pagination | selected, at rest, hover, pressed | fill; label | the contained Button's rows | derived |
| | unselected, hover, pressed | ground | `--ds-color-bg-neutral-ghost-hover`, `-pressed`, with their opacity tokens | the set |
| ListItemButton, MenuItem | hover, pressed | ground | `--ds-color-bg-neutral-ghost-hover`, `-pressed`, with their opacity tokens | the set |
| | selected | ground | `--ds-color-bg-brand-ghost-selected` with `--ds-opacity-ghost-selected` | ruled |
| | | text | `--ds-color-fg-neutral-regular`, unchanged by the ground | the set |
| Link | at rest, hover, pressed | text | `--ds-color-fg-link-enabled`, `-hover`, `-pressed` | the set |
| | on an inverted ground | text | `--ds-color-fg-link-on-inverse-enabled`, `-hover`, `-pressed` | the set |
| AppBar | default | plane; shadow | `--ds-color-surface-high`; `--ds-shadow-raised` | ruled |
| | a color | fill; text | `--ds-color-bg-<F>-accent`; `--ds-color-fg-neutral-on-inverse-strong` | derived |
| Drawer, Menu, Popover | | plane; shadow | `--ds-color-surface-high`; `--ds-shadow-floating` | the set |
| Stepper | | connector | `--ds-color-border-neutral-muted` | derived |
| StepIcon | active, completed; its number | disc; text | `--ds-color-bg-brand-accent`; `--ds-color-fg-neutral-on-inverse-strong` | derived |
| | inactive | disc | `--ds-color-fg-neutral-hint` | derived |

## Feedback

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| Alert | standard | ground; text; icon | `--ds-color-bg-<F>-regular`; `--ds-color-fg-<F>-regular`; `--ds-color-fg-<F>-accent` | the set |
| | outlined | edge | `--ds-color-border-<F>-muted` | the set |
| | filled | ground; text | `--ds-color-bg-<F>-accent`; `--ds-color-fg-neutral-on-inverse-strong` | ruled |
| Snackbar | | ground; text; action | `--ds-color-surface-inverse`; `--ds-color-fg-neutral-on-inverse-regular`; `--ds-color-fg-link-on-inverse-enabled` and its steps | the set |
| Tooltip | | ground; text | `--ds-color-surface-inverse`; `--ds-color-fg-neutral-on-inverse-regular` | the set |
| Dialog | | plane; shadow | `--ds-color-surface-high`; `--ds-shadow-overlay` | the set |
| Backdrop | | scrim | `--ds-color-surface-scrim` with `--ds-opacity-scrim` | the set |

## Inputs

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| OutlinedInput, FilledInput, Input | | fill | `--ds-color-surface-high` | ruled |
| | at rest; focused; in error | edge, underline | `--ds-color-border-neutral-regular`; `--ds-color-border-neutral-focus`; `--ds-color-border-critical-accent` | the set |
| | hover | fill | unchanged; the state is on the edge | ruled |
| InputLabel, FormHelperText | | text | `--ds-color-fg-neutral-muted` | derived |
| | in error | text | `--ds-color-fg-critical-regular` | derived |
| InputBase | | typed text; placeholder | `--ds-color-fg-neutral-regular`; `--ds-color-fg-neutral-hint` | derived |
| InputAdornment | | icon | `--ds-color-fg-neutral-hint` | the set, open there |
| Select, Autocomplete | | list | as Menu and MenuItem | the set |

## Surfaces and data display

| Component | Variant, state | Part | Role | Decided |
| --- | --- | --- | --- | --- |
| CssBaseline | | page | `--ds-color-surface-dim` | the set |
| Paper, Card | | plane; shadow; edge | `--ds-color-surface-high`; `--ds-shadow-raised`; `--ds-color-border-neutral-hint` | the set |
| Divider | ; strong | line | `--ds-color-border-neutral-hint`; `--ds-color-border-neutral-muted` | the set |
| TableCell | | border | `--ds-color-border-neutral-hint` | the set |
| TableHead | | text | `--ds-color-fg-neutral-muted` | derived |
| Typography | body; secondary | text | `--ds-color-fg-neutral-regular`; `--ds-color-fg-neutral-muted` | the set |
| | a color | text | `--ds-color-fg-<F>-accent` | derived |
| SvgIcon, Icon | beside text; standalone | icon | the text's row; `--ds-color-fg-neutral-hint` | the set, open there |
| ImageListItemBar | | text over the image | MUI's own white | ruled: the set has no text-over-media word |

## What right looks like

A test page with every component above, under each brand and each mode: no magenta
anywhere; a disabled control is its enabled colors at the disabled opacity; a focused
control shows one ring and no ground; a contained button's hover and pressed are the
solid's steps; the dark page is dark. Text over a ground holds 4.5 and an edge or a shape
holds 3, measured from the resolved values in the brand's `colors.ts` for both modes.

Traps in MUI 9 that have cost time before:

- Under MUI's CSS variables, `theme.palette` serves the light scheme; read `theme.vars`
  where a value must be read in code at all.
- MUI's own `applyStyles('dark')` blocks assume MUI's grey scale; with a scale that
  reverses by mode they double-invert, so no dark block is added, ever.
- A `'&&'` specificity boost beats `.Mui-disabled`; restate disabled inside every boosted
  block.
- The slot-variant `styleOverrides` keys of older majors, `containedPrimary` and its
  kin, are gone; use `root` with `variants`.
- MUI X ships its own field family, `MuiPickersOutlinedInput` among them; a date picker
  needs its own rows, from the library's page.
- The palette's multipliers, `hoverOpacity` and its siblings, are set to zero in the
  backstop; a component that still derives its own ground renders no feedback until its
  override exists, which is how a missed one is found.

## Appendix: the palette backstop

Hex per mode from the brand's `colors.ts`, generated into the theme by a small script in
the application so a regenerate carries through. Nothing is styled from it.

| Palette slot | Role, both modes |
| --- | --- |
| `<color>.main`, `.light`, `.dark` | `color-fg-<F>-accent` |
| `<color>.contrastText` | `color-fg-neutral-on-inverse-strong` |
| `text.primary`; `text.secondary` | `color-fg-neutral-regular`; `color-fg-neutral-muted` |
| `text.disabled`; `action.disabled`; `action.disabledBackground`; `action.focus` | the sentinel `#ff00ff` |
| `action.disabledOpacity` | the value of `opacity-disabled` |
| `action.hover`; `action.selected` | `color-bg-neutral-ghost-hover`; `color-bg-neutral-ghost-selected`, folded with their opacities as `colors.ts` folds them |
| `action.hoverOpacity`, `selectedOpacity`, `focusOpacity`, `activatedOpacity` | 0 |
| `action.active` | `color-fg-neutral-hint` |
| `background.default`; `background.paper` | `color-surface-dim`; `color-surface-high` |
| `divider` | `color-border-neutral-hint` |
| `common.white`, `common.black` | MUI's own |
| `grey` | the neutral's base tokens by nearest lightness, never styled from |
