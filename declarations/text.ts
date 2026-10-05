import type { TextDeclaration } from '../src/declare.ts'

// Display and heading grow on desktop; every other role keeps its size at every
// viewport. A viewport without a size takes its fallback's (collections.ts).
export const text: TextDeclaration = {
  roles: {
    display: 'large, high-impact moments: page titles, major section introductions',
    heading: 'the headings that define content blocks and guide a reader through the page',
    title: 'labels for subsections, card headers and contextual identifiers',
    body: 'paragraphs, descriptions and general content',
    link: 'navigation and actions written as underlined text',
    'tabular-number': 'scannable numeric data in tables',
    button: 'text inside buttons and other interactive components',
    code: 'inline code, developer references and system output',
  },
  styles: [
    { role: 'display', size: 'lg', family: 'sans', weight: 'semibold', lineHeight: 1.25, letterSpacing: 0, px: { mobile: 40, desktop: 72 } },
    { role: 'display', size: 'md', family: 'sans', weight: 'semibold', lineHeight: 1.25, letterSpacing: -2, px: { mobile: 32, desktop: 60 } },
    { role: 'display', size: 'sm', family: 'sans', weight: 'semibold', lineHeight: 1.25, letterSpacing: -1.5, px: { mobile: 26, desktop: 48 } },
    { role: 'heading', size: 'lg', family: 'sans', weight: 'medium', lineHeight: 1.25, letterSpacing: -2, px: { mobile: 32, desktop: 40 } },
    { role: 'heading', size: 'md', family: 'sans', weight: 'medium', lineHeight: 1.25, letterSpacing: -1.5, px: { mobile: 26, desktop: 32 } },
    { role: 'heading', size: 'sm', family: 'sans', weight: 'medium', lineHeight: 1.25, letterSpacing: -1, px: { mobile: 20, desktop: 26 } },
    { role: 'heading', size: 'xs', family: 'sans', weight: 'medium', lineHeight: 1.25, letterSpacing: -1, px: { mobile: 15, desktop: 20 } },
    { role: 'title', size: 'lg', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 18 } },
    { role: 'title', size: 'md', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 15 } },
    { role: 'title', size: 'sm', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 14 } },
    { role: 'title', size: 'xs', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: 0, px: { mobile: 12 } },
    { role: 'body', size: 'lg', family: 'sans', weight: 'regular', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 18 } },
    { role: 'body', size: 'md', family: 'sans', weight: 'regular', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 15 } },
    { role: 'body', size: 'sm', family: 'sans', weight: 'regular', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 14 } },
    { role: 'body', size: 'xs', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 12 } },
    { role: 'link', size: 'lg', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 18 } },
    { role: 'link', size: 'md', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 15 } },
    { role: 'link', size: 'sm', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 14 } },
    { role: 'link', size: 'xs', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 12 } },
    { role: 'tabular-number', size: 'sm', family: 'number', weight: 'medium', lineHeight: 1.5, letterSpacing: 0, px: { mobile: 14 } },
    { role: 'tabular-number', size: 'xs', family: 'number', weight: 'medium', lineHeight: 1.5, letterSpacing: 0, px: { mobile: 12 } },
    { role: 'button', size: 'md', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 15 } },
    { role: 'button', size: 'sm', family: 'sans', weight: 'medium', lineHeight: 1.5, letterSpacing: -0.1, px: { mobile: 14 } },
    { role: 'code', size: 'sm', family: 'mono', weight: 'medium', lineHeight: 1.5, letterSpacing: 0, px: { mobile: 14 } },
  ],
}
