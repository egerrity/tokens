# The five slots, by layer

Generated with the rest of the set. For each slot: what it holds in each layer, in the
grammar's words, and what fills it today, read from the shapes every path matches. The
rules for the slots are in `grammar.md`. The color engine's rows are counted as bases:
a family and one position word.

## category

| Layer | Holds | Today |
| --- | --- | --- |
| Base | The kind of value, in the everyday word. | `space`, `size`, `radius`, `border-width`, `opacity`, `motion`, `breakpoint`, `font`, `color` |
| Semantic | The kind of value, in the everyday word. | `space`, `size`, `opacity`, `motion`, `grid`, `text`, `color`, `shadow` |
| Component | The component’s name, in the category’s place. | none yet |

## property

| Layer | Holds | Today |
| --- | --- | --- |
| Base | Which scale. | `space`: `negative` · `motion`: `easing`, `duration` · `font`: `family`, `weight`, `size`, `line-height` |
| Semantic | Which purpose. | `space`: `gap`, `padding` · `size`: `icon`, `control`, `illustration` · `motion`: `transition` · `color`: `plane`, `surface`, `fg`, `border`, `bg`, `illustration` |
| Component | Always: the property the component sets. | none yet |

## family

| Layer | Holds | Today |
| --- | --- | --- |
| Base | Which member: the same scale for each, built by one rule. | `color`: `neutral`, `brand`, `brand-alt`, `critical`, `warning`, `positive`, `info`, `link`, `absolute` |
| Semantic | Which member: the same roles for each. | `color`: `brand`, `brand-alt`, `critical`, `warning`, `positive`, `info` |
| Component | As semantic. | none yet |

## variant

| Layer | Holds | Today |
| --- | --- | --- |
| Base | Never: a base narrows by position alone. | none |
| Semantic | Which kind: a where, a level, a role, a posture. | `space`: `control`, `content`, `layout`, `card`, `container` · `size`: `spot`, `hero` · `opacity`: `ghost`, `soft` · `text`: `display`, `heading`, `title`, `body`, `link`, `tabular-number`, `button`, `code` · `color`: `link`, `on-inverse`, `ghost`, `soft`, `solid` |
| Component | As semantic. | none yet |

## specifier

| Layer | Holds | Today |
| --- | --- | --- |
| Base | A position: a step of three or more digits, or a named place on the scale. | `space`: a step · `size`: a step · `radius`: a step, `full` · `border-width`: a step · `opacity`: a step · `motion`: `default`, `enter`, `exit`, `linear`, a step · `breakpoint`: `sm`, `md`, `lg`, `xl`, `2xl` · `font`: `sans`, `number`, `mono`, `regular`, `medium`, `semibold`, a step · `color`: `paper-0`, `paper-1`, `paper-3`, `paper-5`, `chalk-8`, `chalk-11`, `chalk-15`, `chalk-20`, `highlighter-26`, `pencil-47`, `pen-58`, `pen-70`, `pen-100`, `stamp-0`, `stamp-1`, `stamp-2`, `stamp-edge`, `stamp-on`, `default-0`, `default-1`, `default-2`, `inverse-0`, `inverse-1`, `inverse-2`, `brand`, `brand-alt` |
| Semantic | A state, a size, a density, an emphasis word, or a name from the group’s own list. | `space`: `condensed`, `normal`, `spacious` · `size`: `xs`, `sm`, `md`, `lg`, `measure` · `opacity`: `disabled`, `scrim`, `hover`, `pressed`, `selected`, `enabled` · `motion`: `default`, `default-opacity`, `default-fast`, `open`, `dismiss`, `slide-in`, `slide-out` · `grid`: `columns`, `margin`, `gutter`, `max-width` · `text`: `lg`, `md`, `sm`, `xs` · `color`: `dim`, `low`, `mid`, `high`, `inverse`, `scrim`, `regular`, `accent`, `hint`, `muted`, `strong`, `enabled`, `hover`, `pressed`, `focus`, `selected`, `solid`, `on-solid`, `paper`, `chalk-light`, `chalk`, `highlighter`, `pencil`, `pen`, `shadow`, `shine` · `shadow`: `raised`, `floating`, `overlay`, `lifted` |
| Component | A state, with the default spelled; a name where the component has no states. | none yet |
