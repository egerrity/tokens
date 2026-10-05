import type { Category } from '../grammar/words.ts'

// A collection is a file-level coordinate: it names the token file and the Figma
// collection, and never appears in a path. Groups share a collection only when they
// change with the same contexts.
export const collections: Record<string, readonly Category[]> = {
  core: ['space', 'size', 'radius', 'border-width', 'opacity', 'motion', 'breakpoint'],
}
