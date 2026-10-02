# Foundations audit, Figma side: what exists in the library file

Read 2026-10-02 from the library file (the copy of Core Foundations and Components),
through a read-only script over its local variables and styles. It covers what is
defined. It does not cover how the product files use it: no walk of text layers, fills,
padding or gaps on a style or variable versus raw, and no walk of the component pages.

## Totals

317 variables in 8 collections. None has a description. 31 text styles (24 live, 7
archived), 4 effect styles, 4 paint styles, no grid styles.

| Collection | Variables | Type | Modes |
| --- | --- | --- | --- |
| Color modes | 143 | color | Light, Dark |
| Color palettes | 42 | color | one |
| Color themes | 3 | color | eight brand modes |
| Layout | 39 | number | one |
| Border | 8 | number | one |
| Type scale | 72 | 48 number, 24 string | ten |
| Content fidelity | 6 | 3 number, 3 string | Default, Abstract, Comical |
| Selection control | 4 | number, hidden from publishing | Medium, Small, Large |

## Space and size

Space, 21 steps, in px: 0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80,
96, 112, 128. Named `Primitives/space-000` to `space-3200`; the base unit is 4 px and the
step is the number of base units times 100. Six negative steps, `negative-space-100` to `-600`: -4, -8, -12, -16, -20, -24.

Size, 8 steps, in px: 12, 16, 20, 24, 32, 40, 48, 56. Named `Primitives/size-300` to
`size-1400`, same step rule.

Four icon sizes alias the size scale: `icon-xs` 12, `icon-sm` 16, `icon-md` 20,
`icon-lg` 24. These are the only semantic non-color variables in the file.

What the numbers show: every value from 4 px up sits on a 4 px grid except 6 and 10; the
steps 1, 2 and 3 px sit below it. The scale is regular with no duplicates.

## Radius and border width

Radius, in px: 0, 2, 6, 8, 12, and `radius-full` at 10000. Named `radius-000`,
`radius-050`, `radius-150`, `radius-200`, `radius-300`. There is no 4 px step.

Border width: `width-025` 1 px, `width-050` 2 px.

The hidden Selection control collection holds a checkbox radius of 4, 3 and 6 px by size.
Those values are raw numbers and are not on the radius scale.

## Typography

**The variables.** Each of the 24 live text styles owns three variables: font size, font
family and font weight (72 in all). Family and weight alias a small shared set: three
families (`font/family/sans`, `number`, `mono`) and three weights (`regular` 400,
`medium` 500, `semibold` 600). Font size is a raw number per style and per mode; there is
no shared size scale. Line height and letter spacing are not variables; they exist only
in the text styles, as percentages.

**The styles, at the base mode.**

| Style | Weight | Size | Line height | Letter spacing |
| --- | --- | --- | --- | --- |
| Display lg, md, sm | SemiBold | 40, 32, 26 | 125% | 0%, -2%, -1.5% |
| Heading lg, md, sm, xs | Medium | 32, 26, 20, 15 | 125% | -2%, -1.5%, -1%, -1% |
| Title lg, md, sm, xs | Medium | 18, 15, 14, 12 | 150% | -0.1%, -0.1%, -0.1%, 0% |
| Body lg, md, sm | Regular | 18, 15, 14 | 150% | -0.1% |
| Body xs | Medium | 12 | 150% | -0.1% |
| Link lg, md, sm, xs | Medium | 18, 15, 14, 12 | 150% | -0.1% |
| Button md, sm | Medium | 15, 14 | 150% | -0.1% |
| Tabular number sm, xs | Medium | 14, 12 | 150% | 0% |
| Code sm | Medium, mono family | 14 | 150% | 0% |

What the numbers show:

- Eight font sizes: 12, 14, 15, 18, 20, 26, 32, 40. They do not follow one ratio: the
  steps between them run from 1.07 to 1.3.
- Two line heights: 125% for display and heading, 150% for everything else.
- Five letter spacings: 0, -0.1, -1, -1.5 and -2 percent, tighter as the size grows.
- The 24 styles are 17 distinct combinations by value. Identical sets: Title lg and Link
  lg; Title md, Link md and Button md; Title sm, Link sm and Button sm; Body xs and Link
  xs; Title xs and Tabular number xs.
- Body xs is Medium where the rest of Body is Regular.

**The ten modes.** They are platform and text-size contexts, not breakpoints: mobile web
with the base iOS sizes, desktop web, and eight larger iOS text-size settings.

Desktop web changes only display and heading: Display 72, 60, 48; Heading 40, 32, 26, 20.
Title, body, link, button, code and tabular number keep their base size.

The iOS settings scale every style. One row per base size:

| Base | XL | 2XL | 3XL | AX1 | AX2 | AX3 | AX4 | AX5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12 | 14 | 16 | 18 | 20 | 21 | 22 | 23 | 24 |
| 14 | 16 | 18 | 20 | 21 | 23 | 24 | 26 | 28 |
| 15 | 17 | 19 | 21 | 22 | 24 | 26 | 28 | 30 |
| 18 | 20 | 22 | 24 | 26 | 28 | 30 | 33 | 36 |
| 20 | 22 | 24 | 26 | 29 | 32 | 35 | 38 | 40 |
| 26 | 28 | 30 | 32 | 36 | 40 | 44 | 48 | 52 |
| 32 | 34 | 36 | 38 | 43 | 48 | 53 | 58 | 64 |
| 40 | 42 | 44 | 46 | 53 | 60 | 67 | 74 | 80 |

**Archived.** Seven desktop styles under `_ARCHIVE`, bound to no variable.

**Content fidelity.** Three modes that swap the three font families for a placeholder
face and a comic face. A Figma convenience for low-fidelity work, not a token.

## Elevation, shadow, opacity, motion, breakpoints

- Four effect styles, `Elevation shadow/Level 1` to `Level 4`, each two drop shadows with
  raw offsets, blurs and alphas (0.04 to 0.1).
- Four paint styles, `Elevation surface/Level 1` to `Level 4`, and four overlay color
  variables under `(int) Elevation`.
- No opacity variables. No motion variables or styles. No breakpoint variables.

## Color, documented only

- Color modes, 143: a spectrum of gray, five hue families and three absolutes (65), nine
  client hue families at seven steps each (63), merge and scrim rows (11), four elevation
  overlays.
- Color palettes, 42: the roles in use today, as Content, Background, Stroke, Signal,
  Brand, Merge and Skeleton loader palettes.
- Color themes, 3 brand rows across eight brand modes.

## Naming as it stands

Four spellings in one file:

- `Primitives/space-400`: a group, then a hyphenated name with a numeric step.
- `radius-200`, `width-025`, `icon-sm`: flat, no group.
- `display/lg/font-size`: role, size, property, joined by slashes.
- `(int) Spectrum/Gray/100` and `Content palette/Content Primary`: title case with
  spaces, the role repeated in the leaf.

The space, size, radius and border width steps already follow one rule: the base unit is
4 px and the step is the number of base units times 100.

## Not covered

- How product files use any of this: text layers on a style versus detached, fills bound
  versus raw, padding and gap values in auto layout, radius and effect values. That is
  the second half of the Figma-side audit and needs a walk of the product files.
- Hard-coded values inside the library's own components.
