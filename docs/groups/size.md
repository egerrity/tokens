# Size

Generated from `declarations/size.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The scale: the list of steps, in px.
- The icon sizes, the control heights and the illustration sizes, each a size word with a px value; a value on the scale references its step, one above it holds its value.
- The measure, the longest line of running text, which sits above the scale and holds its own value.

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
| `size/1600` | 64 px | the width and height of elements |
| `size/icon/xs` | `size/300` (12 px) | the width and height of an icon |
| `size/icon/sm` | `size/400` (16 px) | the width and height of an icon |
| `size/icon/md` | `size/500` (20 px) | the width and height of an icon |
| `size/icon/lg` | `size/600` (24 px) | the width and height of an icon |
| `size/control/sm` | `size/1000` (40 px) | the fixed height of a control, such as a button or a text field |
| `size/control/md` | `size/1200` (48 px) | the fixed height of a control, such as a button or a text field |
| `size/control/lg` | `size/1400` (56 px) | the fixed height of a control, such as a button or a text field |
| `size/illustration/spot/sm` | `size/1200` (48 px) | the width and height of a spot illustration |
| `size/illustration/spot/md` | `size/1400` (56 px) | the width and height of a spot illustration |
| `size/illustration/spot/lg` | `size/1600` (64 px) | the width and height of a spot illustration |
| `size/illustration/hero/sm` | 200 px | the width and height of a hero illustration |
| `size/illustration/hero/md` | 256 px | the width and height of a hero illustration |
| `size/illustration/hero/lg` | 300 px | the width and height of a hero illustration |
| `size/measure` | 640 px | the longest line of running text: paragraphs, descriptions, long-form content |
