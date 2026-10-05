# Grid

Generated from `declarations/grid.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The column count per viewport.
- The margin and the gutter per viewport, as px on the space scale.
- The width at which page content stops growing, per viewport.

## Derived

- Each margin and gutter as a reference to its space step, per viewport.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `grid/columns` | 4 (mobile); 6 (tablet); 12 (desktop, wide) | the number of columns content aligns to |
| `grid/margin` | `space/400` (16 px) (mobile); `space/800` (32 px) (tablet, desktop, wide) | the space between content and the left and right edges of the screen |
| `grid/gutter` | `space/200` (8 px) (mobile, tablet); `space/400` (16 px) (desktop, wide) | the space between columns |
| `grid/max-width` | 1280 px (mobile, tablet, desktop, wide) | the width at which page content stops growing and centers |
