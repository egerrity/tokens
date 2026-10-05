# Breakpoints

Generated from `declarations/breakpoint.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The minimum widths, in px, each under a size word, with what starts there.

## Derived

- The order, which follows the size words.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `breakpoint/sm` | 640 px | the width at which the tablet layout starts |
| `breakpoint/md` | 768 px | a step between tablet and desktop; no layout range starts here |
| `breakpoint/lg` | 1024 px | the width at which the desktop layout starts |
| `breakpoint/xl` | 1280 px | the width at which the wide desktop layout starts |
| `breakpoint/2xl` | 1536 px | very wide screens; no layout range starts here |
