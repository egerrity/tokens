import type { GridDeclaration } from '../src/declare.ts'

export const grid: GridDeclaration = {
  columns: {
    req: 'the number of columns content aligns to',
    count: { mobile: 4, tablet: 6, desktop: 12, wide: 12 },
  },
  maxWidth: {
    req: 'the width at which page content stops growing and centers',
    use: 'the outer width of the grid on a wide screen; below it the grid is fluid and fills the viewport inside its margins',
    px: { mobile: 1280, tablet: 1280, desktop: 1280, wide: 1280 },
  },
  margin: {
    req: 'the space between content and the left and right edges of the screen',
    px: { mobile: 16, tablet: 32, desktop: 32, wide: 32 },
  },
  gutter: {
    req: 'the space between columns',
    px: { mobile: 8, tablet: 8, desktop: 16, wide: 16 },
  },
}
