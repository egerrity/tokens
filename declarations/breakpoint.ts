import type { BreakpointDeclaration } from '../src/declare.ts'

// The keys are the styling framework's; the widths are the ones the apps are built to,
// taken from their code, because nothing in Figma or the docs is built to a breakpoint
// and the apps are.
export const breakpoint: BreakpointDeclaration = {
  widths: {
    sm: { px: 440, req: 'wider than a phone: large phones in landscape, small tablets' },
    md: { px: 768, req: 'the width at which the tablet layout starts' },
    lg: { px: 1024, req: 'the width at which the desktop layout starts' },
    xl: { px: 1280, req: 'the width at which the wide desktop layout starts' },
  },
  starts: { tablet: 'md', desktop: 'lg', wide: 'xl' },
}
