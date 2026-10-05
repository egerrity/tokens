import type { MotionDeclaration } from '../src/declare.ts'

export const motion: MotionDeclaration = {
  easing: {
    default: { curve: [0.2, 0, 0.3, 0.95], req: 'elements that stay in view from the start to the end of the transition, such as a toggle' },
    enter: { curve: [0.4, 1, 0.89, 1], req: 'elements entering the screen: a quick start that slows to a rest' },
    exit: { curve: [0.11, 0, 0.6, 0], req: 'elements leaving the screen: a slow start that speeds out of the way' },
    linear: { curve: [0, 0, 1, 1], req: 'changes of opacity and color; never movement' },
  },
  duration: {
    bounds: { shortest: 50, longest: 600 },
    steps: [
      { ms: 50, req: 'pressed states and other immediate feedback' },
      { ms: 80, req: 'micro-interactions, hover states and fades' },
      { ms: 200, req: 'short movements and small expansions' },
      { ms: 300, req: 'short movements and expansions, such as an accordion' },
      { ms: 400, req: 'long movements and large expansions' },
      { ms: 600, req: 'the longest movements and expansions' },
    ],
  },
  transition: {
    default: { easing: 'default', ms: 80, req: 'most micro-interactions that involve movement, such as a toggle' },
    'default-opacity': { easing: 'linear', ms: 80, req: 'micro-interactions on opacity or color, such as the hover state of a button or a chip' },
    'default-fast': { easing: 'linear', ms: 50, req: 'immediate feedback, such as a pressed state' },
    open: { easing: 'enter', ms: 200, req: 'elements that open into view, such as a dropdown menu' },
    dismiss: { easing: 'linear', ms: 80, req: 'elements dismissed by the user or automatically' },
    'slide-in': { easing: 'enter', ms: 300, req: 'elements that slide into view from the bottom, such as a toast' },
    'slide-out': { easing: 'default', ms: 200, req: 'elements that slide out of view' },
  },
}
