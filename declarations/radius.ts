import type { RadiusDeclaration } from '../src/declare.ts'

export const radius: RadiusDeclaration = {
  steps: [
    { px: 0, req: 'square corners' },
    { px: 2, req: 'component focus states only' },
    { px: 3, req: 'selection controls at the small size' },
    { px: 4, req: 'selection controls at the medium size' },
    { px: 6, req: 'small elements, such as chips' },
    { px: 8, req: 'most elements and components' },
    { px: 12, req: 'large containers, such as cards and modals' },
  ],
  full: { px: 10000, req: 'contained buttons' },
}
