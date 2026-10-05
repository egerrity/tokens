# Space

Generated from `declarations/space.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The scale: the list of steps, in px.
- Which steps get a negative.
- Each semantic row: a gap or a padding, where it applies, its density, the step it uses and the cases it covers.
- The words that say where a semantic row applies.

## Derived

- Each step's name, from the base unit.
- Each negative step, as the mirror of its positive step.
- Each semantic token's reference to its step.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `space/000` | 0 px | distance between and around elements: gaps, padding and offsets |
| `space/025` | 1 px | distance between and around elements: gaps, padding and offsets |
| `space/050` | 2 px | distance between and around elements: gaps, padding and offsets |
| `space/075` | 3 px | distance between and around elements: gaps, padding and offsets |
| `space/100` | 4 px | distance between and around elements: gaps, padding and offsets |
| `space/150` | 6 px | distance between and around elements: gaps, padding and offsets |
| `space/200` | 8 px | distance between and around elements: gaps, padding and offsets |
| `space/250` | 10 px | distance between and around elements: gaps, padding and offsets |
| `space/300` | 12 px | distance between and around elements: gaps, padding and offsets |
| `space/400` | 16 px | distance between and around elements: gaps, padding and offsets |
| `space/500` | 20 px | distance between and around elements: gaps, padding and offsets |
| `space/600` | 24 px | distance between and around elements: gaps, padding and offsets |
| `space/800` | 32 px | distance between and around elements: gaps, padding and offsets |
| `space/1000` | 40 px | distance between and around elements: gaps, padding and offsets |
| `space/1200` | 48 px | distance between and around elements: gaps, padding and offsets |
| `space/1400` | 56 px | distance between and around elements: gaps, padding and offsets |
| `space/1600` | 64 px | distance between and around elements: gaps, padding and offsets |
| `space/2000` | 80 px | distance between and around elements: gaps, padding and offsets |
| `space/2400` | 96 px | distance between and around elements: gaps, padding and offsets |
| `space/2800` | 112 px | distance between and around elements: gaps, padding and offsets |
| `space/3200` | 128 px | distance between and around elements: gaps, padding and offsets |
| `space/negative/100` | -4 px | overlap between elements |
| `space/negative/200` | -8 px | overlap between elements |
| `space/negative/300` | -12 px | overlap between elements |
| `space/negative/400` | -16 px | overlap between elements |
| `space/negative/500` | -20 px | overlap between elements |
| `space/negative/600` | -24 px | overlap between elements |
| `space/gap/control/condensed` | `space/100` (4 px) | an icon and its text, close together |
| `space/gap/control/normal` | `space/200` (8 px) | an icon and its text |
| `space/gap/control/spacious` | `space/300` (12 px) | an icon and its text, further apart |
| `space/gap/content/condensed` | `space/200` (8 px) | body text blocks, close together; a title and its content, close together; titles, further apart |
| `space/gap/content/normal` | `space/300` (12 px) | buttons side by side |
| `space/gap/content/spacious` | `space/400` (16 px) | inputs in a form; body text blocks, further apart; a title and its content, further apart |
| `space/gap/layout/condensed` | `space/400` (16 px) | cards in a list or a grid |
| `space/gap/layout/normal` | `space/600` (24 px) | cards, further apart; sections, close together; content and the buttons that act on it |
| `space/gap/layout/spacious` | `space/800` (32 px) | sections of a page |
| `space/padding/card/condensed` | `space/300` (12 px) | a card in a dense list or grid |
| `space/padding/card/normal` | `space/400` (16 px) | a card |
| `space/padding/container/condensed` | `space/500` (20 px) | a container whose heading line height already adds room |
| `space/padding/container/normal` | `space/600` (24 px) | a container |
