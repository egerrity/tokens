import type { BreakpointDeclaration } from '../src/declare.ts'

export const breakpoint: BreakpointDeclaration = {
  widths: {
    sm: { px: 640, req: 'the width at which the tablet layout starts' },
    md: { px: 768, req: 'a step between tablet and desktop; no layout range starts here' },
    lg: { px: 1024, req: 'the width at which the desktop layout starts' },
    xl: { px: 1280, req: 'the width at which the wide desktop layout starts' },
    '2xl': { px: 1536, req: 'very wide screens; no layout range starts here' },
  },
}
