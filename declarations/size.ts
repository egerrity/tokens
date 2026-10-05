import type { SizeDeclaration } from '../src/declare.ts'

export const size: SizeDeclaration = {
  purpose: 'the width and height of elements',
  steps: [12, 16, 20, 24, 32, 40, 48, 56],
  icon: {
    purpose: 'the width and height of an icon',
    sizes: { xs: 12, sm: 16, md: 20, lg: 24 },
  },
  control: {
    purpose: 'the fixed height of a control, such as a button or a text field',
    sizes: { sm: 40, md: 48, lg: 56 },
  },
  content: {
    max: { px: 1280, req: 'the widest that page content gets on a desktop screen' },
    paragraph: { px: 720, req: 'the widest that a paragraph of text gets' },
    min: { px: 320, req: 'the narrowest that page content gets on a mobile screen' },
  },
}
