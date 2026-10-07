import type { ColorDeclaration } from '../src/declare.ts'

// One vocabulary for every property and every family: five words, each a combo of a
// text, a ground and a border that go together. `regular` is the default accessible
// combo; `strong` is heavy; `muted` is colored but restrained; `hint` is light and
// versatile; `accent` is the signature stop, pencil-47, in every property, and grabs
// the eye. A property says once which engine stop each word names, and that holds in
// the neutral and in every family, so `fg/brand/accent` is the brand's pencil-47
// exactly as `fg/accent` is the neutral's. The neutral and the families then each
// offer a subset of the words; a word a designer does not get today can be offered
// later without a new name.
//
// Every word a family has a stop for is emitted, so the whole framework is recorded;
// a word can be reserved, per neutral or per family: emitted for component authors and
// hidden from publishing, so the wider designers see only what is offered. Offering a
// word later is removing it from a reserved list, never a new name.
//
// Interaction is a second axis under bg, cordoned by its level: `ghost` is nothing at
// rest and the highlighter at an opacity when touched; `soft` is that tint at rest and
// stronger when touched; `solid` is the engine's stamp, with its edge and its on-text.
// The three are emitted for every family for parity, and the solid is a component's
// color: never offered, always reserved. Every static bg stop here holds text, and says
// whose.
export const color: ColorDeclaration = {
  fg: {
    stops: {
      regular: { stop: 'pen-70', req: 'running text', use: 'body copy, labels, table cells, and the icons beside them' },
      accent: { stop: 'pencil-47', req: 'text that grabs the eye', use: 'the lightest AA text: in the neutral, placeholders and timestamps; in a family, the color itself, so not for body text; never for disabled' },
      hint: { stop: 'highlighter-26', req: 'icons and shapes only', use: 'clears the non-text bar, not the text bar, so it is kept out of the text picker: never text, never disabled', shapesOnly: true },
      muted: { stop: 'pen-58', req: 'secondary text', use: 'captions, helper text, metadata' },
      strong: { stop: 'pen-100', req: 'the strongest emphasis', use: 'display text, a key figure; not for running text' },

    },
    // the families have no text pole, so strong is the neutral's alone
    neutral: ['regular', 'accent', 'hint', 'muted', 'strong'],
    family: ['regular', 'accent', 'hint', 'muted'],
    reserved: { family: ['hint', 'muted'] },
  },
  onInverse: {
    stops: {
      regular: { stop: 'paper-3', req: 'running text on an inverted ground', use: 'on color/surface/inverse and on an accent fill; the pencil clears every paper' },
      accent: { stop: 'chalk-20', req: 'the quietest text on an inverted ground', use: 'on color/surface/inverse only; the pens clear every chalk' },
      muted: { stop: 'chalk-11', req: 'secondary text on an inverted ground', use: 'on color/surface/inverse only; the pens clear every chalk' },
      strong: { stop: 'paper-0', req: 'the strongest text on an inverted ground', use: 'on color/surface/inverse and on an accent fill' },

    },
    neutral: ['regular', 'accent', 'muted', 'strong'],
    family: [],
  },
  bg: {
    stops: {
      regular: { stop: 'paper-3', req: 'the default ground with color', use: 'an alert, a callout, a soft badge, with the regular or muted border; every fg word but hint reads on it' },
      accent: { stop: 'pencil-47', req: 'the fill that grabs the eye', use: 'a solid badge, chip or progress fill; its text is fg/on-inverse/strong or regular, nothing else' },
      hint: { stop: 'paper-1', req: 'the lightest ground', use: 'a wash that barely leaves the surface; every fg word but hint reads on it' },
      muted: { stop: 'paper-5', req: 'a restrained ground', use: 'a deeper tint than regular; every fg word but hint reads on it' },
      strong: { stop: 'chalk-20', req: 'a heavy ground', use: 'the strongest combo; fg/strong, regular and muted read on it, accent does not' },

    },
    neutral: ['regular', 'accent', 'hint', 'muted', 'strong'],
    family: ['regular', 'accent', 'hint', 'muted', 'strong'],
    reserved: { family: ['hint', 'muted', 'strong'] },
  },
  border: {
    stops: {
      regular: { stop: 'highlighter-26', req: 'inputs, cards and dividers that must be seen', use: 'the border that clears the non-text contrast bar' },
      accent: { stop: 'pencil-47', req: 'a border that grabs the eye', use: 'an input in error, a highlighted card; not a regular border' },
      hint: { stop: 'chalk-8', req: 'the faintest border', use: 'the card edge, rows in a table, items in a list' },
      muted: { stop: 'chalk-15', req: 'a decorative border', use: 'strong dividers, and the border of the regular and muted grounds' },
      strong: { stop: 'pen-70', req: 'an emphasized outline', use: 'a selected card, a current step; kept in case, rarely the right border' },

    },
    neutral: ['regular', 'accent', 'hint', 'muted', 'strong'],
    family: ['regular', 'accent', 'hint', 'muted', 'strong'],
    reserved: { family: ['hint', 'strong'] },
  },
  focus: 'brand',
  interaction: { neutral: ['ghost', 'soft'], family: [] },
  illustration: { shadow: 10, shine: 20 },
}
