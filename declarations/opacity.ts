import type { OpacityDeclaration } from '../src/declare.ts'

export const opacity: OpacityDeclaration = {
  purpose: 'translucent layers: state grounds, shadows and scrims',
  steps: [4, 8, 12, 16, 24, 32, 48, 64],
  disabled: { percent: 38, req: 'the disabled state of a component' },
}
