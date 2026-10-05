# Size

Generated from `declarations/size.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The scale: the list of steps, in px.
- The icon sizes and the control heights, each a size word and a step.
- The content widths, which sit above the scale and hold their own value.

## Derived

- Each step's name, from the base unit.
- Each semantic token's reference to its step.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `size/300` | 12 px | the width and height of elements |
| `size/400` | 16 px | the width and height of elements |
| `size/500` | 20 px | the width and height of elements |
| `size/600` | 24 px | the width and height of elements |
| `size/800` | 32 px | the width and height of elements |
| `size/1000` | 40 px | the width and height of elements |
| `size/1200` | 48 px | the width and height of elements |
| `size/1400` | 56 px | the width and height of elements |
| `size/icon/xs` | `size/300` (12 px) | the width and height of an icon |
| `size/icon/sm` | `size/400` (16 px) | the width and height of an icon |
| `size/icon/md` | `size/500` (20 px) | the width and height of an icon |
| `size/icon/lg` | `size/600` (24 px) | the width and height of an icon |
| `size/control/sm` | `size/1000` (40 px) | the fixed height of a control, such as a button or a text field |
| `size/control/md` | `size/1200` (48 px) | the fixed height of a control, such as a button or a text field |
| `size/control/lg` | `size/1400` (56 px) | the fixed height of a control, such as a button or a text field |
| `size/content/max` | 1280 px | the widest that page content gets on a desktop screen |
| `size/content/paragraph` | 720 px | the widest that a paragraph of text gets |
| `size/content/min` | 320 px | the narrowest that page content gets on a mobile screen |
