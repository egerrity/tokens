// The roster: every token the generator emits, in document order. It is the definition
// of what exists; the emitters and the audit ride it, so a token cannot appear in one
// output and not another.
import { space } from '../declarations/space.ts'
import { size } from '../declarations/size.ts'
import { radius } from '../declarations/radius.ts'
import { borderWidth } from '../declarations/border-width.ts'
import { opacity } from '../declarations/opacity.ts'
import { motion } from '../declarations/motion.ts'
import { breakpoint } from '../declarations/breakpoint.ts'
import { grid } from '../declarations/grid.ts'
import { font } from '../declarations/font.ts'
import { text } from '../declarations/text.ts'
import { CATEGORIES, type Category } from '../grammar/words.ts'
import {
  spaceTokens, sizeTokens, radiusTokens, borderWidthTokens, opacityTokens, motionTokens, breakpointTokens,
  gridTokens, fontTokens, textTokens,
} from './derive.ts'
import type { Token } from './types.ts'

const BY_CATEGORY: Record<Category, () => Token[]> = {
  space: () => spaceTokens(space),
  size: () => sizeTokens(size),
  radius: () => radiusTokens(radius),
  'border-width': () => borderWidthTokens(borderWidth),
  opacity: () => opacityTokens(opacity),
  motion: () => motionTokens(motion),
  breakpoint: () => breakpointTokens(breakpoint),
  grid: () => gridTokens(grid, space.steps),
  font: () => fontTokens(font),
  text: () => textTokens(text, font),
}

export const tokensOf = (category: Category): Token[] => BY_CATEGORY[category]()

export const roster = (): Token[] => CATEGORIES.flatMap(tokensOf)
