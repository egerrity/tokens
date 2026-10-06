import type { OpacityDeclaration } from '../src/declare.ts'

export const opacity: OpacityDeclaration = {
  purpose: 'translucent layers: state grounds, shadows and scrims',
  steps: [4, 8, 10, 12, 16, 20, 24, 32, 48, 64],
  disabled: { percent: 38, req: 'the disabled state of a component' },
  scrim: { percent: 64, req: 'the scrim behind a modal' },
  ghost: { hover: 8, pressed: 12, selected: 16 },
  soft: { enabled: 12, hover: 16, pressed: 24, selected: 32 },
}
