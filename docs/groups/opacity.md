# Opacity

Generated from `declarations/opacity.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The scale: the list of steps, in percent.
- The disabled opacity.

## Derived

- Each step's name, which is its percent.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `opacity/004` | 0.04 | translucent layers: state grounds, shadows and scrims |
| `opacity/008` | 0.08 | translucent layers: state grounds, shadows and scrims |
| `opacity/010` | 0.1 | translucent layers: state grounds, shadows and scrims |
| `opacity/012` | 0.12 | translucent layers: state grounds, shadows and scrims |
| `opacity/016` | 0.16 | translucent layers: state grounds, shadows and scrims |
| `opacity/020` | 0.2 | translucent layers: state grounds, shadows and scrims |
| `opacity/024` | 0.24 | translucent layers: state grounds, shadows and scrims |
| `opacity/032` | 0.32 | translucent layers: state grounds, shadows and scrims |
| `opacity/048` | 0.48 | translucent layers: state grounds, shadows and scrims |
| `opacity/064` | 0.64 | translucent layers: state grounds, shadows and scrims |
| `opacity/disabled` | 0.38 | the disabled state of a component |
| `opacity/scrim` | `opacity/064` (0.64) | the scrim behind a modal |
| `opacity/ghost/hover` | `opacity/008` (0.08) | the ghost ground under the pointer |
| `opacity/ghost/pressed` | `opacity/012` (0.12) | the ghost ground while pressed |
| `opacity/ghost/selected` | `opacity/016` (0.16) | the ghost ground when selected |
| `opacity/soft/enabled` | `opacity/012` (0.12) | the soft ground at rest |
| `opacity/soft/hover` | `opacity/016` (0.16) | the soft ground under the pointer |
| `opacity/soft/pressed` | `opacity/024` (0.24) | the soft ground while pressed |
| `opacity/soft/selected` | `opacity/032` (0.32) | the soft ground when selected |
