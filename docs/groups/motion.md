# Motion

Generated from `declarations/motion.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- The easing curves, each with what it is for.
- The durations, in ms, each with what it is for, and the bounds no duration may leave.
- Each transition: one easing with one duration.

## Derived

- Each duration's name, which is its milliseconds.
- Each transition's references to its easing and its duration.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `motion/easing/default` | 0.2, 0, 0.3, 0.95 | elements that stay in view from the start to the end of the transition, such as a toggle |
| `motion/easing/enter` | 0.4, 1, 0.89, 1 | elements entering the screen: a quick start that slows to a rest |
| `motion/easing/exit` | 0.11, 0, 0.6, 0 | elements leaving the screen: a slow start that speeds out of the way |
| `motion/easing/linear` | 0, 0, 1, 1 | changes of opacity and color; never movement |
| `motion/duration/050` | 50 ms | pressed states and other immediate feedback |
| `motion/duration/080` | 80 ms | micro-interactions, hover states and fades |
| `motion/duration/200` | 200 ms | short movements and small expansions |
| `motion/duration/300` | 300 ms | short movements and expansions, such as an accordion |
| `motion/duration/400` | 400 ms | long movements and large expansions |
| `motion/duration/600` | 600 ms | the longest movements and expansions |
| `motion/transition/default` | `motion/easing/default` over `motion/duration/080` | most micro-interactions that involve movement, such as a toggle |
| `motion/transition/default-opacity` | `motion/easing/linear` over `motion/duration/080` | micro-interactions on opacity or color, such as the hover state of a button or a chip |
| `motion/transition/default-fast` | `motion/easing/linear` over `motion/duration/050` | immediate feedback, such as a pressed state |
| `motion/transition/open` | `motion/easing/enter` over `motion/duration/200` | elements that open into view, such as a dropdown menu |
| `motion/transition/dismiss` | `motion/easing/linear` over `motion/duration/080` | elements dismissed by the user or automatically |
| `motion/transition/slide-in` | `motion/easing/enter` over `motion/duration/300` | elements that slide into view from the bottom, such as a toast |
| `motion/transition/slide-out` | `motion/easing/default` over `motion/duration/200` | elements that slide out of view |
