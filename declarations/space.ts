import type { SpaceDeclaration } from '../src/declare.ts'

export const space: SpaceDeclaration = {
  purpose: 'distance between and around elements: gaps, padding and offsets',
  steps: [0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128],
  negative: {
    purpose: 'overlap between elements',
    steps: [4, 8, 12, 16, 20, 24],
  },
  places: {
    control: 'inside a single control',
    content: 'between pieces of content that belong together',
    layout: 'between the blocks of a page',
    card: 'inside a card',
    container: 'inside a container, such as a panel, a modal or a dialog',
  },
  semantic: [
    { property: 'gap', where: 'control', density: 'condensed', px: 4, covers: ['an icon and its text, close together'] },
    { property: 'gap', where: 'control', density: 'normal', px: 8, covers: ['an icon and its text'] },
    { property: 'gap', where: 'control', density: 'spacious', px: 12, covers: ['an icon and its text, further apart'] },
    { property: 'gap', where: 'content', density: 'condensed', px: 8, covers: ['body text blocks, close together', 'a title and its content, close together', 'titles, further apart'] },
    { property: 'gap', where: 'content', density: 'normal', px: 12, covers: ['buttons side by side'] },
    { property: 'gap', where: 'content', density: 'spacious', px: 16, covers: ['inputs in a form', 'body text blocks, further apart', 'a title and its content, further apart'] },
    { property: 'gap', where: 'layout', density: 'condensed', px: 16, covers: ['cards in a list or a grid'] },
    { property: 'gap', where: 'layout', density: 'normal', px: 24, covers: ['cards, further apart', 'sections, close together', 'content and the buttons that act on it'] },
    { property: 'gap', where: 'layout', density: 'spacious', px: 32, covers: ['sections of a page'] },
    { property: 'padding', where: 'card', density: 'condensed', px: 12, covers: ['a card in a dense list or grid'] },
    { property: 'padding', where: 'card', density: 'normal', px: 16, covers: ['a card'] },
    { property: 'padding', where: 'container', density: 'condensed', px: 20, covers: ['a container whose heading line height already adds room'] },
    { property: 'padding', where: 'container', density: 'normal', px: 24, covers: ['a container'] },
  ],
}
