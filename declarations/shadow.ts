import type { ShadowDeclaration } from '../src/declare.ts'

// Material 3's four working elevation levels (1, 2, 3 and 5), named the way Atlassian
// and Primer name theirs: for what sits at that height, never for a plane, because a
// card, a menu and a dialog all rest on the same plane and take three different
// shadows. The layers are today's four recipes in order, kept so the look does not
// change; a shadow is black, never a colored glow, and the same in both themes, where
// the plane carries the step on its own in dark.
export const shadow: ShadowDeclaration = {
  purpose: 'the elevation shadows: the step between surfaces, in light',
  levels: [
    { name: 'raised', req: 'elevated cards, bottom sheets', use: 'the first elevation level, on surface/high; the same in both themes', layers: [{ x: 0, y: 4, blur: 8, spread: 0, alpha: 8 }, { x: 0, y: 0, blur: 1, spread: 0, alpha: 4 }] },
    { name: 'floating', req: 'menus, popovers, the navigation bar', use: 'the second elevation level, on surface/high; the same in both themes', layers: [{ x: 0, y: 4, blur: 6, spread: -1, alpha: 10 }, { x: 0, y: 2, blur: 4, spread: -2, alpha: 10 }] },
    { name: 'overlay', req: 'dialogs, modal sheets, the floating action button', use: 'the third elevation level, on surface/high; the same in both themes', layers: [{ x: 0, y: 4, blur: 6, spread: 0, alpha: 5 }, { x: 0, y: 10, blur: 15, spread: 0, alpha: 10 }] },
    { name: 'lifted', req: 'an elevated card at its strongest', use: 'the fifth elevation level, on surface/high; the same in both themes', layers: [{ x: 0, y: 10, blur: 10, spread: 0, alpha: 4 }, { x: 0, y: 20, blur: 25, spread: 0, alpha: 10 }] },
  ],
}
