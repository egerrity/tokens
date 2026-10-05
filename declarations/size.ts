import type { SizeDeclaration } from '../src/declare.ts'

export const size: SizeDeclaration = {
  purpose: 'the width and height of elements',
  steps: [12, 16, 20, 24, 32, 40, 48, 56, 64],
  icon: {
    purpose: 'the width and height of an icon',
    sizes: { xs: 12, sm: 16, md: 20, lg: 24 },
  },
  control: {
    purpose: 'the fixed height of a control, such as a button or a text field',
    sizes: { sm: 40, md: 48, lg: 56 },
  },
  illustration: {
    spot: { purpose: 'the width and height of a spot illustration', sizes: { sm: 48, md: 56, lg: 64 } },
    hero: { purpose: 'the width and height of a hero illustration', sizes: { sm: 200, md: 256, lg: 300 } },
  },
  measure: {
    px: 640,
    req: 'the longest line of running text: paragraphs, descriptions, long-form content',
    use: 'the maximum width of a block of body text, about seventy characters at the body size. Not for controls, tables or cards',
  },
}
