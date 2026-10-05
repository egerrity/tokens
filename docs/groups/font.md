# Font

Generated from `declarations/font.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The families, each as the names a renderer tries in order.
- The weights.
- The size scale, in px.
- The line heights, as multiples of the font size.

## Derived

- Each size step's name, from the base unit; each line height's name, from the multiple.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `font/family/sans` | Matter, sans-serif | all text except code and tabular numbers |
| `font/family/number` | Matter, sans-serif | tabular numbers |
| `font/family/mono` | Roboto Mono, monospace | code |
| `font/weight/regular` | 400 | body text |
| `font/weight/medium` | 500 | headings, titles, links, buttons, numbers and code |
| `font/weight/semibold` | 600 | display text |
| `font/size/300` | 12 px | the font size of a text style |
| `font/size/350` | 14 px | the font size of a text style |
| `font/size/375` | 15 px | the font size of a text style |
| `font/size/450` | 18 px | the font size of a text style |
| `font/size/500` | 20 px | the font size of a text style |
| `font/size/650` | 26 px | the font size of a text style |
| `font/size/800` | 32 px | the font size of a text style |
| `font/size/1000` | 40 px | the font size of a text style |
| `font/size/1200` | 48 px | the font size of a text style |
| `font/size/1500` | 60 px | the font size of a text style |
| `font/size/1800` | 72 px | the font size of a text style |
| `font/line-height/125` | 1.25 | the line height of a text style, as a multiple of its font size |
| `font/line-height/150` | 1.5 | the line height of a text style, as a multiple of its font size |
