import type { FontDeclaration } from '../src/declare.ts'

export const font: FontDeclaration = {
  family: {
    sans: { names: ['Matter', 'sans-serif'], req: 'all text except code and tabular numbers' },
    number: { names: ['Matter', 'sans-serif'], req: 'tabular numbers' },
    mono: { names: ['Roboto Mono', 'monospace'], req: 'code' },
  },
  weight: {
    regular: { value: 400, req: 'body text' },
    medium: { value: 500, req: 'headings, titles, links, buttons, numbers and code' },
    semibold: { value: 600, req: 'display text' },
  },
  size: {
    purpose: 'the font size of a text style',
    steps: [12, 14, 15, 18, 20, 26, 32, 40, 48, 60, 72],
  },
  lineHeight: {
    purpose: 'the line height of a text style, as a multiple of its font size',
    steps: [1.25, 1.5],
  },
}
