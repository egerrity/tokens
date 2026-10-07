# Color roles

Generated from `declarations/color.ts, with the opacity steps in declarations/opacity.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- Each property's ladder: which engine stop every emphasis word names, with what the row is for, and which words the neutral and the families are offered.
- Whose highlighter draws the focus ring.
- The two illustration pair opacities.

## Derived

- Every row as an alias to an engine primitive: the same word on the same stop in the neutral and in every family.
- The interaction levels per family: ghost and soft on the highlighter at the level's opacities, solid on the engine's stamp with its edge and on-text.
- The surfaces per theme context, in the engine's plane order.
- Each translucent row's pair, the opacity it is composed with.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `color/plane/dim` | `color/neutral/paper-5` (#eceef2) (light); `color/neutral/paper-0` (#0c0d0f) (dark) | the dim plane (reserved for components) |
| `color/surface/dim` | `color/plane/dim` (`color/neutral/paper-5` (#eceef2)) | the page behind everything |
| `color/plane/low` | `color/neutral/paper-3` (#f3f5f8) (light); `color/neutral/paper-1` (#131415) (dark) | the low plane (reserved for components) |
| `color/surface/low` | `color/plane/low` (`color/neutral/paper-3` (#f3f5f8)) | a recessed surface: an inset well, a table header |
| `color/plane/mid` | `color/neutral/paper-1` (#f9fafd) (light); `color/neutral/paper-3` (#191b1d) (dark) | the mid plane (reserved for components) |
| `color/surface/mid` | `color/plane/mid` (`color/neutral/paper-1` (#f9fafd)) | the resting surface of a panel or a section |
| `color/plane/high` | `color/neutral/paper-0` (#ffffff) (light); `color/neutral/paper-5` (#202225) (dark) | the high plane (reserved for components) |
| `color/surface/high` | `color/plane/high` (`color/neutral/paper-0` (#ffffff)) | the raised surface: a card, a menu, a dialog, an input |
| `color/surface/inverse` | `color/neutral/pen-70` (#2d2d2e) | an inverted banner, card or toast |
| `color/surface/scrim` | #000000 with `opacity/scrim` | the scrim behind a modal |
| `color/fg/regular` | `color/neutral/pen-70` (#2d2d2e) | running text |
| `color/fg/accent` | `color/neutral/pencil-47` (#6a6b6c) | text that grabs the eye |
| `color/fg/hint` | `color/neutral/highlighter-26` (#868789) | icons and shapes only |
| `color/fg/muted` | `color/neutral/pen-58` (#474748) | secondary text |
| `color/fg/strong` | `color/neutral/pen-100` (#000000) | the strongest emphasis |
| `color/fg/link/enabled` | `color/link/default/enabled` (`color/brand/pencil-47` (#265db4)) | a link in running text, at rest |
| `color/fg/link/hover` | `color/link/default/hover` (`color/brand/pen-58` (#003a8e)) | a link in running text, under the pointer |
| `color/fg/link/pressed` | `color/link/default/pressed` (`color/brand/pen-70` (#0e274f)) | a link in running text, while pressed |
| `color/fg/on-inverse/regular` | `color/neutral/paper-3` (#f3f5f8) | running text on an inverted ground |
| `color/fg/on-inverse/accent` | `color/neutral/chalk-20` (#bcbec1) | the quietest text on an inverted ground |
| `color/fg/on-inverse/muted` | `color/neutral/chalk-11` (#d8dbe0) | secondary text on an inverted ground |
| `color/fg/on-inverse/strong` | `color/neutral/paper-0` (#ffffff) | the strongest text on an inverted ground |
| `color/fg/on-inverse/link/enabled` | `color/link/inverse/enabled` (#7baaf4) | a link on an inverted ground, at rest |
| `color/fg/on-inverse/link/hover` | `color/link/inverse/hover` (#a2c6ff) | a link on an inverted ground, under the pointer |
| `color/fg/on-inverse/link/pressed` | `color/link/inverse/pressed` (#cfe1ff) | a link on an inverted ground, while pressed |
| `color/border/regular` | `color/neutral/highlighter-26` (#868789) | inputs, cards and dividers that must be seen |
| `color/border/accent` | `color/neutral/pencil-47` (#6a6b6c) | a border that grabs the eye |
| `color/border/hint` | `color/neutral/chalk-8` (#e3e5ea) | the faintest border |
| `color/border/muted` | `color/neutral/chalk-15` (#ccced2) | a decorative border |
| `color/border/strong` | `color/neutral/pen-70` (#2d2d2e) | an emphasized outline |
| `color/border/focus` | `color/brand/highlighter-26` (#5287dd) | the focus ring |
| `color/border/inverse` | `color/neutral/paper-0` (#ffffff) | borders on an inverted ground |
| `color/bg/regular` | `color/neutral/paper-3` (#f3f5f8) | the default ground with color |
| `color/bg/accent` | `color/neutral/pencil-47` (#6a6b6c) | the fill that grabs the eye |
| `color/bg/hint` | `color/neutral/paper-1` (#f9fafd) | the lightest ground (reserved for components) |
| `color/bg/muted` | `color/neutral/paper-5` (#eceef2) | a restrained ground (reserved for components) |
| `color/bg/strong` | `color/neutral/chalk-20` (#bcbec1) | a heavy ground (reserved for components) |
| `color/bg/ghost/enabled` | #000000 at 0 percent | the ghost ground of a neutral control, at rest |
| `color/bg/ghost/hover` | `color/neutral/highlighter-26` (#868789) with `opacity/ghost/hover` | the ghost ground of a neutral control, under the pointer |
| `color/bg/ghost/pressed` | `color/neutral/highlighter-26` (#868789) with `opacity/ghost/pressed` | the ghost ground of a neutral control, while pressed |
| `color/bg/ghost/selected` | `color/neutral/highlighter-26` (#868789) with `opacity/ghost/selected` | the ghost ground of a neutral control, when selected |
| `color/bg/soft/enabled` | `color/neutral/highlighter-26` (#868789) with `opacity/soft/enabled` | the soft ground of a neutral control, at rest |
| `color/bg/soft/hover` | `color/neutral/highlighter-26` (#868789) with `opacity/soft/hover` | the soft ground of a neutral control, under the pointer |
| `color/bg/soft/pressed` | `color/neutral/highlighter-26` (#868789) with `opacity/soft/pressed` | the soft ground of a neutral control, while pressed |
| `color/bg/soft/selected` | `color/neutral/highlighter-26` (#868789) with `opacity/soft/selected` | the soft ground of a neutral control, when selected |
| `color/bg/solid/enabled` | `color/neutral/stamp/fill` (#e3e5ea) | the solid ground of a neutral control, at rest (reserved for components) |
| `color/bg/solid/hover` | `color/neutral/stamp/fill-hover` (#d3d5d9) | the solid ground of a neutral control, under the pointer (reserved for components) |
| `color/bg/solid/pressed` | `color/neutral/stamp/fill-pressed` (#c3c5c8) | the solid ground of a neutral control, while pressed (reserved for components) |
| `color/border/solid` | `color/neutral/stamp/edge` (#000000 at 8 percent) | the edge of the solid ground of a neutral control (reserved for components) |
| `color/fg/on-solid` | `color/neutral/stamp/on` (#000000 at 75 percent) | text and icons over the solid ground of a neutral control (reserved for components) |
| `color/fg/brand/regular` | `color/brand/pen-70` (#0e274f) | running text, in the brand color |
| `color/fg/brand/accent` | `color/brand/pencil-47` (#265db4) | text that grabs the eye, in the brand color |
| `color/fg/brand/hint` | `color/brand/highlighter-26` (#5287dd) | icons and shapes only, in the brand color (reserved for components) |
| `color/fg/brand/muted` | `color/brand/pen-58` (#003a8e) | secondary text, in the brand color (reserved for components) |
| `color/border/brand/regular` | `color/brand/highlighter-26` (#5287dd) | inputs, cards and dividers that must be seen, in the brand color |
| `color/border/brand/accent` | `color/brand/pencil-47` (#265db4) | a border that grabs the eye, in the brand color |
| `color/border/brand/hint` | `color/brand/chalk-8` (#d3e4fd) | the faintest border, in the brand color (reserved for components) |
| `color/border/brand/muted` | `color/brand/chalk-15` (#afcaf5) | a decorative border, in the brand color |
| `color/border/brand/strong` | `color/brand/pen-70` (#0e274f) | an emphasized outline, in the brand color (reserved for components) |
| `color/bg/brand/regular` | `color/brand/paper-3` (#f0f4fb) | the default ground with color, in the brand color |
| `color/bg/brand/accent` | `color/brand/pencil-47` (#265db4) | the fill that grabs the eye, in the brand color |
| `color/bg/brand/hint` | `color/brand/paper-1` (#f9fafd) | the lightest ground, in the brand color (reserved for components) |
| `color/bg/brand/muted` | `color/brand/paper-5` (#e4edfc) | a restrained ground, in the brand color (reserved for components) |
| `color/bg/brand/strong` | `color/brand/chalk-20` (#96b8ee) | a heavy ground, in the brand color (reserved for components) |
| `color/bg/brand/ghost/enabled` | #000000 at 0 percent | the ghost ground of a brand control, at rest (reserved for components) |
| `color/bg/brand/ghost/hover` | `color/brand/highlighter-26` (#5287dd) with `opacity/ghost/hover` | the ghost ground of a brand control, under the pointer (reserved for components) |
| `color/bg/brand/ghost/pressed` | `color/brand/highlighter-26` (#5287dd) with `opacity/ghost/pressed` | the ghost ground of a brand control, while pressed (reserved for components) |
| `color/bg/brand/ghost/selected` | `color/brand/highlighter-26` (#5287dd) with `opacity/ghost/selected` | the ghost ground of a brand control, when selected (reserved for components) |
| `color/bg/brand/soft/enabled` | `color/brand/highlighter-26` (#5287dd) with `opacity/soft/enabled` | the soft ground of a brand control, at rest (reserved for components) |
| `color/bg/brand/soft/hover` | `color/brand/highlighter-26` (#5287dd) with `opacity/soft/hover` | the soft ground of a brand control, under the pointer (reserved for components) |
| `color/bg/brand/soft/pressed` | `color/brand/highlighter-26` (#5287dd) with `opacity/soft/pressed` | the soft ground of a brand control, while pressed (reserved for components) |
| `color/bg/brand/soft/selected` | `color/brand/highlighter-26` (#5287dd) with `opacity/soft/selected` | the soft ground of a brand control, when selected (reserved for components) |
| `color/bg/brand/solid/enabled` | `color/brand/stamp/fill` (#044baf) | the solid ground of a brand control, at rest (reserved for components) |
| `color/bg/brand/solid/hover` | `color/brand/stamp/fill-hover` (#003e97) | the solid ground of a brand control, under the pointer (reserved for components) |
| `color/bg/brand/solid/pressed` | `color/brand/stamp/fill-pressed` (#00327d) | the solid ground of a brand control, while pressed (reserved for components) |
| `color/border/brand/solid` | `color/brand/stamp/edge` (#000000 at 0 percent) | the edge of the solid ground of a brand control (reserved for components) |
| `color/fg/brand/on-solid` | `color/brand/stamp/on` (#ffffff) | text and icons over the solid ground of a brand control (reserved for components) |
| `color/fg/brand-alt/regular` | `color/brand-alt/pen-70` (#252d38) | running text, in the brand-alt color |
| `color/fg/brand-alt/accent` | `color/brand-alt/pencil-47` (#596983) | text that grabs the eye, in the brand-alt color |
| `color/fg/brand-alt/hint` | `color/brand-alt/highlighter-26` (#7689a8) | icons and shapes only, in the brand-alt color (reserved for components) |
| `color/fg/brand-alt/muted` | `color/brand-alt/pen-58` (#3a4961) | secondary text, in the brand-alt color (reserved for components) |
| `color/border/brand-alt/regular` | `color/brand-alt/highlighter-26` (#7689a8) | inputs, cards and dividers that must be seen, in the brand-alt color |
| `color/border/brand-alt/accent` | `color/brand-alt/pencil-47` (#596983) | a border that grabs the eye, in the brand-alt color |
| `color/border/brand-alt/hint` | `color/brand-alt/chalk-8` (#dfe5ee) | the faintest border, in the brand-alt color (reserved for components) |
| `color/border/brand-alt/muted` | `color/brand-alt/chalk-15` (#c3cddd) | a decorative border, in the brand-alt color |
| `color/border/brand-alt/strong` | `color/brand-alt/pen-70` (#252d38) | an emphasized outline, in the brand-alt color (reserved for components) |
| `color/bg/brand-alt/regular` | `color/brand-alt/paper-3` (#f3f5f7) | the default ground with color, in the brand-alt color |
| `color/bg/brand-alt/accent` | `color/brand-alt/pencil-47` (#596983) | the fill that grabs the eye, in the brand-alt color |
| `color/bg/brand-alt/hint` | `color/brand-alt/paper-1` (#fafbfc) | the lightest ground, in the brand-alt color (reserved for components) |
| `color/bg/brand-alt/muted` | `color/brand-alt/paper-5` (#ebeef3) | a restrained ground, in the brand-alt color (reserved for components) |
| `color/bg/brand-alt/strong` | `color/brand-alt/chalk-20` (#b0bcd0) | a heavy ground, in the brand-alt color (reserved for components) |
| `color/bg/brand-alt/ghost/enabled` | #000000 at 0 percent | the ghost ground of a brand-alt control, at rest (reserved for components) |
| `color/bg/brand-alt/ghost/hover` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/ghost/hover` | the ghost ground of a brand-alt control, under the pointer (reserved for components) |
| `color/bg/brand-alt/ghost/pressed` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/ghost/pressed` | the ghost ground of a brand-alt control, while pressed (reserved for components) |
| `color/bg/brand-alt/ghost/selected` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/ghost/selected` | the ghost ground of a brand-alt control, when selected (reserved for components) |
| `color/bg/brand-alt/soft/enabled` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/soft/enabled` | the soft ground of a brand-alt control, at rest (reserved for components) |
| `color/bg/brand-alt/soft/hover` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/soft/hover` | the soft ground of a brand-alt control, under the pointer (reserved for components) |
| `color/bg/brand-alt/soft/pressed` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/soft/pressed` | the soft ground of a brand-alt control, while pressed (reserved for components) |
| `color/bg/brand-alt/soft/selected` | `color/brand-alt/highlighter-26` (#7689a8) with `opacity/soft/selected` | the soft ground of a brand-alt control, when selected (reserved for components) |
| `color/bg/brand-alt/solid/enabled` | `color/brand-alt/stamp/fill` (#aabddb) | the solid ground of a brand-alt control, at rest (reserved for components) |
| `color/bg/brand-alt/solid/hover` | `color/brand-alt/stamp/fill-hover` (#9aadcb) | the solid ground of a brand-alt control, under the pointer (reserved for components) |
| `color/bg/brand-alt/solid/pressed` | `color/brand-alt/stamp/fill-pressed` (#8b9ebb) | the solid ground of a brand-alt control, while pressed (reserved for components) |
| `color/border/brand-alt/solid` | `color/brand-alt/stamp/edge` (#000000 at 0 percent) | the edge of the solid ground of a brand-alt control (reserved for components) |
| `color/fg/brand-alt/on-solid` | `color/brand-alt/stamp/on` (#000000 at 75 percent) | text and icons over the solid ground of a brand-alt control (reserved for components) |
| `color/fg/critical/regular` | `color/critical/pen-70` (#4c190f) | running text, in the critical color |
| `color/fg/critical/accent` | `color/critical/pencil-47` (#ac3d27) | text that grabs the eye, in the critical color |
| `color/fg/critical/hint` | `color/critical/highlighter-26` (#e06046) | icons and shapes only, in the critical color (reserved for components) |
| `color/fg/critical/muted` | `color/critical/pen-58` (#7d1500) | secondary text, in the critical color (reserved for components) |
| `color/border/critical/regular` | `color/critical/highlighter-26` (#e06046) | inputs, cards and dividers that must be seen, in the critical color |
| `color/border/critical/accent` | `color/critical/pencil-47` (#ac3d27) | a border that grabs the eye, in the critical color |
| `color/border/critical/hint` | `color/critical/chalk-8` (#ffded6) | the faintest border, in the critical color (reserved for components) |
| `color/border/critical/muted` | `color/critical/chalk-15` (#febdad) | a decorative border, in the critical color |
| `color/border/critical/strong` | `color/critical/pen-70` (#4c190f) | an emphasized outline, in the critical color (reserved for components) |
| `color/bg/critical/regular` | `color/critical/paper-3` (#fdf3f0) | the default ground with color, in the critical color |
| `color/bg/critical/accent` | `color/critical/pencil-47` (#ac3d27) | the fill that grabs the eye, in the critical color |
| `color/bg/critical/hint` | `color/critical/paper-1` (#fefaf9) | the lightest ground, in the critical color (reserved for components) |
| `color/bg/critical/muted` | `color/critical/paper-5` (#ffeae4) | a restrained ground, in the critical color (reserved for components) |
| `color/bg/critical/strong` | `color/critical/chalk-20` (#f7a693) | a heavy ground, in the critical color (reserved for components) |
| `color/bg/critical/ghost/enabled` | #000000 at 0 percent | the ghost ground of a critical control, at rest (reserved for components) |
| `color/bg/critical/ghost/hover` | `color/critical/highlighter-26` (#e06046) with `opacity/ghost/hover` | the ghost ground of a critical control, under the pointer (reserved for components) |
| `color/bg/critical/ghost/pressed` | `color/critical/highlighter-26` (#e06046) with `opacity/ghost/pressed` | the ghost ground of a critical control, while pressed (reserved for components) |
| `color/bg/critical/ghost/selected` | `color/critical/highlighter-26` (#e06046) with `opacity/ghost/selected` | the ghost ground of a critical control, when selected (reserved for components) |
| `color/bg/critical/soft/enabled` | `color/critical/highlighter-26` (#e06046) with `opacity/soft/enabled` | the soft ground of a critical control, at rest (reserved for components) |
| `color/bg/critical/soft/hover` | `color/critical/highlighter-26` (#e06046) with `opacity/soft/hover` | the soft ground of a critical control, under the pointer (reserved for components) |
| `color/bg/critical/soft/pressed` | `color/critical/highlighter-26` (#e06046) with `opacity/soft/pressed` | the soft ground of a critical control, while pressed (reserved for components) |
| `color/bg/critical/soft/selected` | `color/critical/highlighter-26` (#e06046) with `opacity/soft/selected` | the soft ground of a critical control, when selected (reserved for components) |
| `color/bg/critical/solid/enabled` | `color/critical/stamp/fill` (#d63e1e) | the solid ground of a critical control, at rest (reserved for components) |
| `color/bg/critical/solid/hover` | `color/critical/stamp/fill-hover` (#c42b04) | the solid ground of a critical control, under the pointer (reserved for components) |
| `color/bg/critical/solid/pressed` | `color/critical/stamp/fill-pressed` (#ad2300) | the solid ground of a critical control, while pressed (reserved for components) |
| `color/border/critical/solid` | `color/critical/stamp/edge` (#000000 at 0 percent) | the edge of the solid ground of a critical control (reserved for components) |
| `color/fg/critical/on-solid` | `color/critical/stamp/on` (#ffffff) | text and icons over the solid ground of a critical control (reserved for components) |
| `color/fg/warning/regular` | `color/warning/pen-70` (#4b2800) | running text, in the warning color |
| `color/fg/warning/accent` | `color/warning/pencil-47` (#9e5b00) | text that grabs the eye, in the warning color |
| `color/fg/warning/hint` | `color/warning/highlighter-26` (#c27700) | icons and shapes only, in the warning color (reserved for components) |
| `color/fg/warning/muted` | `color/warning/pen-58` (#724000) | secondary text, in the warning color (reserved for components) |
| `color/border/warning/regular` | `color/warning/highlighter-26` (#c27700) | inputs, cards and dividers that must be seen, in the warning color |
| `color/border/warning/accent` | `color/warning/pencil-47` (#9e5b00) | a border that grabs the eye, in the warning color |
| `color/border/warning/hint` | `color/warning/chalk-8` (#ffebbd) | the faintest border, in the warning color (reserved for components) |
| `color/border/warning/muted` | `color/warning/chalk-15` (#ffd36e) | a decorative border, in the warning color |
| `color/border/warning/strong` | `color/warning/pen-70` (#4b2800) | an emphasized outline, in the warning color (reserved for components) |
| `color/bg/warning/regular` | `color/warning/paper-3` (#fff7e3) | the default ground with color, in the warning color |
| `color/bg/warning/accent` | `color/warning/pencil-47` (#9e5b00) | the fill that grabs the eye, in the warning color |
| `color/bg/warning/hint` | `color/warning/paper-1` (#fffbf4) | the lightest ground, in the warning color (reserved for components) |
| `color/bg/warning/muted` | `color/warning/paper-5` (#fff2d2) | a restrained ground, in the warning color (reserved for components) |
| `color/bg/warning/strong` | `color/warning/chalk-20` (#feba00) | a heavy ground, in the warning color (reserved for components) |
| `color/bg/warning/ghost/enabled` | #000000 at 0 percent | the ghost ground of a warning control, at rest (reserved for components) |
| `color/bg/warning/ghost/hover` | `color/warning/highlighter-26` (#c27700) with `opacity/ghost/hover` | the ghost ground of a warning control, under the pointer (reserved for components) |
| `color/bg/warning/ghost/pressed` | `color/warning/highlighter-26` (#c27700) with `opacity/ghost/pressed` | the ghost ground of a warning control, while pressed (reserved for components) |
| `color/bg/warning/ghost/selected` | `color/warning/highlighter-26` (#c27700) with `opacity/ghost/selected` | the ghost ground of a warning control, when selected (reserved for components) |
| `color/bg/warning/soft/enabled` | `color/warning/highlighter-26` (#c27700) with `opacity/soft/enabled` | the soft ground of a warning control, at rest (reserved for components) |
| `color/bg/warning/soft/hover` | `color/warning/highlighter-26` (#c27700) with `opacity/soft/hover` | the soft ground of a warning control, under the pointer (reserved for components) |
| `color/bg/warning/soft/pressed` | `color/warning/highlighter-26` (#c27700) with `opacity/soft/pressed` | the soft ground of a warning control, while pressed (reserved for components) |
| `color/bg/warning/soft/selected` | `color/warning/highlighter-26` (#c27700) with `opacity/soft/selected` | the soft ground of a warning control, when selected (reserved for components) |
| `color/bg/warning/solid/enabled` | `color/warning/stamp/fill` (#ffc53d) | the solid ground of a warning control, at rest (reserved for components) |
| `color/bg/warning/solid/hover` | `color/warning/stamp/fill-hover` (#eeb524) | the solid ground of a warning control, under the pointer (reserved for components) |
| `color/bg/warning/solid/pressed` | `color/warning/stamp/fill-pressed` (#dda500) | the solid ground of a warning control, while pressed (reserved for components) |
| `color/border/warning/solid` | `color/warning/stamp/edge` (#000000 at 0 percent) | the edge of the solid ground of a warning control (reserved for components) |
| `color/fg/warning/on-solid` | `color/warning/stamp/on` (#000000) | text and icons over the solid ground of a warning control (reserved for components) |
| `color/fg/positive/regular` | `color/positive/pen-70` (#0f3818) | running text, in the positive color |
| `color/fg/positive/accent` | `color/positive/pencil-47` (#1a7c34) | text that grabs the eye, in the positive color |
| `color/fg/positive/hint` | `color/positive/highlighter-26` (#009d3c) | icons and shapes only, in the positive color (reserved for components) |
| `color/fg/positive/muted` | `color/positive/pen-58` (#00591e) | secondary text, in the positive color (reserved for components) |
| `color/border/positive/regular` | `color/positive/highlighter-26` (#009d3c) | inputs, cards and dividers that must be seen, in the positive color |
| `color/border/positive/accent` | `color/positive/pencil-47` (#1a7c34) | a border that grabs the eye, in the positive color |
| `color/border/positive/hint` | `color/positive/chalk-8` (#ccefcf) | the faintest border, in the positive color (reserved for components) |
| `color/border/positive/muted` | `color/positive/chalk-15` (#a0dda7) | a decorative border, in the positive color |
| `color/border/positive/strong` | `color/positive/pen-70` (#0f3818) | an emphasized outline, in the positive color (reserved for components) |
| `color/bg/positive/regular` | `color/positive/paper-3` (#eff7ef) | the default ground with color, in the positive color |
| `color/bg/positive/accent` | `color/positive/pencil-47` (#1a7c34) | the fill that grabs the eye, in the positive color |
| `color/bg/positive/hint` | `color/positive/paper-1` (#f8fcf8) | the lightest ground, in the positive color (reserved for components) |
| `color/bg/positive/muted` | `color/positive/paper-5` (#e0f4e2) | a restrained ground, in the positive color (reserved for components) |
| `color/bg/positive/strong` | `color/positive/chalk-20` (#81d08c) | a heavy ground, in the positive color (reserved for components) |
| `color/bg/positive/ghost/enabled` | #000000 at 0 percent | the ghost ground of a positive control, at rest (reserved for components) |
| `color/bg/positive/ghost/hover` | `color/positive/highlighter-26` (#009d3c) with `opacity/ghost/hover` | the ghost ground of a positive control, under the pointer (reserved for components) |
| `color/bg/positive/ghost/pressed` | `color/positive/highlighter-26` (#009d3c) with `opacity/ghost/pressed` | the ghost ground of a positive control, while pressed (reserved for components) |
| `color/bg/positive/ghost/selected` | `color/positive/highlighter-26` (#009d3c) with `opacity/ghost/selected` | the ghost ground of a positive control, when selected (reserved for components) |
| `color/bg/positive/soft/enabled` | `color/positive/highlighter-26` (#009d3c) with `opacity/soft/enabled` | the soft ground of a positive control, at rest (reserved for components) |
| `color/bg/positive/soft/hover` | `color/positive/highlighter-26` (#009d3c) with `opacity/soft/hover` | the soft ground of a positive control, under the pointer (reserved for components) |
| `color/bg/positive/soft/pressed` | `color/positive/highlighter-26` (#009d3c) with `opacity/soft/pressed` | the soft ground of a positive control, while pressed (reserved for components) |
| `color/bg/positive/soft/selected` | `color/positive/highlighter-26` (#009d3c) with `opacity/soft/selected` | the soft ground of a positive control, when selected (reserved for components) |
| `color/bg/positive/solid/enabled` | `color/positive/stamp/fill` (#70d07f) | the solid ground of a positive control, at rest (reserved for components) |
| `color/bg/positive/solid/hover` | `color/positive/stamp/fill-hover` (#5fbf70) | the solid ground of a positive control, under the pointer (reserved for components) |
| `color/bg/positive/solid/pressed` | `color/positive/stamp/fill-pressed` (#4faf61) | the solid ground of a positive control, while pressed (reserved for components) |
| `color/border/positive/solid` | `color/positive/stamp/edge` (#000000 at 0 percent) | the edge of the solid ground of a positive control (reserved for components) |
| `color/fg/positive/on-solid` | `color/positive/stamp/on` (#000000) | text and icons over the solid ground of a positive control (reserved for components) |
| `color/fg/info/regular` | `color/info/pen-70` (#292348) | running text, in the info color |
| `color/fg/info/accent` | `color/info/pencil-47` (#6255a5) | text that grabs the eye, in the info color |
| `color/fg/info/hint` | `color/info/highlighter-26` (#8979da) | icons and shapes only, in the info color (reserved for components) |
| `color/fg/info/muted` | `color/info/pen-58` (#443480) | secondary text, in the info color (reserved for components) |
| `color/border/info/regular` | `color/info/highlighter-26` (#8979da) | inputs, cards and dividers that must be seen, in the info color |
| `color/border/info/accent` | `color/info/pencil-47` (#6255a5) | a border that grabs the eye, in the info color |
| `color/border/info/hint` | `color/info/chalk-8` (#e1dffc) | the faintest border, in the info color (reserved for components) |
| `color/border/info/muted` | `color/info/chalk-15` (#c6c2f3) | a decorative border, in the info color |
| `color/border/info/strong` | `color/info/pen-70` (#292348) | an emphasized outline, in the info color (reserved for components) |
| `color/bg/info/regular` | `color/info/paper-3` (#f4f3fb) | the default ground with color, in the info color |
| `color/bg/info/accent` | `color/info/pencil-47` (#6255a5) | the fill that grabs the eye, in the info color |
| `color/bg/info/hint` | `color/info/paper-1` (#fafafd) | the lightest ground, in the info color (reserved for components) |
| `color/bg/info/muted` | `color/info/paper-5` (#ecebfb) | a restrained ground, in the info color (reserved for components) |
| `color/bg/info/strong` | `color/info/chalk-20` (#b5aeeb) | a heavy ground, in the info color (reserved for components) |
| `color/bg/info/ghost/enabled` | #000000 at 0 percent | the ghost ground of an info control, at rest (reserved for components) |
| `color/bg/info/ghost/hover` | `color/info/highlighter-26` (#8979da) with `opacity/ghost/hover` | the ghost ground of an info control, under the pointer (reserved for components) |
| `color/bg/info/ghost/pressed` | `color/info/highlighter-26` (#8979da) with `opacity/ghost/pressed` | the ghost ground of an info control, while pressed (reserved for components) |
| `color/bg/info/ghost/selected` | `color/info/highlighter-26` (#8979da) with `opacity/ghost/selected` | the ghost ground of an info control, when selected (reserved for components) |
| `color/bg/info/soft/enabled` | `color/info/highlighter-26` (#8979da) with `opacity/soft/enabled` | the soft ground of an info control, at rest (reserved for components) |
| `color/bg/info/soft/hover` | `color/info/highlighter-26` (#8979da) with `opacity/soft/hover` | the soft ground of an info control, under the pointer (reserved for components) |
| `color/bg/info/soft/pressed` | `color/info/highlighter-26` (#8979da) with `opacity/soft/pressed` | the soft ground of an info control, while pressed (reserved for components) |
| `color/bg/info/soft/selected` | `color/info/highlighter-26` (#8979da) with `opacity/soft/selected` | the soft ground of an info control, when selected (reserved for components) |
| `color/bg/info/solid/enabled` | `color/info/stamp/fill` (#bcb3ff) | the solid ground of an info control, at rest (reserved for components) |
| `color/bg/info/solid/hover` | `color/info/stamp/fill-hover` (#aca0fc) | the solid ground of an info control, under the pointer (reserved for components) |
| `color/bg/info/solid/pressed` | `color/info/stamp/fill-pressed` (#9d90eb) | the solid ground of an info control, while pressed (reserved for components) |
| `color/border/info/solid` | `color/info/stamp/edge` (#000000 at 0 percent) | the edge of the solid ground of an info control (reserved for components) |
| `color/fg/info/on-solid` | `color/info/stamp/on` (#000000) | text and icons over the solid ground of an info control (reserved for components) |
| `color/illustration/paper` | `color/brand/paper-5` (#e4edfc) | illustration: the palest wash |
| `color/illustration/chalk-light` | `color/brand/chalk-11` (#c2d8fa) | illustration: a light fill |
| `color/illustration/chalk` | `color/brand/chalk-20` (#96b8ee) | illustration: a mid fill |
| `color/illustration/highlighter` | `color/brand/highlighter-26` (#5287dd) | illustration: an accent |
| `color/illustration/pencil` | `color/brand/pencil-47` (#265db4) | illustration: a line or a dark fill |
| `color/illustration/pen` | `color/brand/pen-58` (#003a8e) | illustration: the darkest line |
| `color/illustration/shadow` | `color/brand/pen-58` (#003a8e) with `opacity/010` | illustration: a cast shadow |
| `color/illustration/shine` | `color/brand/paper-5` (#e4edfc) with `opacity/020` | illustration: a highlight |
