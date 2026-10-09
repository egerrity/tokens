# Glossary

The words the grammar, the set and the share-outs use, each defined once. A word not
here is either an everyday word or jargon to replace. Definitions use only words defined
above them or everyday ones.

## Names

- **Path.** A token's one name: segments joined by slashes (`color/bg/positive/solid/enabled`).
  Every spelling comes from it: the Figma name (slashes), the CSS name (hyphens behind
  the prefix), the token file name (dots).
- **Segment.** One piece of a path, between slashes. Lower-case words and digits; words
  inside one segment join with a hyphen (`border-width`).
- **Slot.** The role a segment plays in the path. Five, always in this order: category,
  property, family, variant, specifier. Every path has a category and a specifier; the
  three middle slots appear when the category or the layer calls for them.
- **Category.** The first segment: the kind of value, in the everyday word (`space`,
  `color`, `motion`).
- **Property.** The aspect of the category the token sets (`gap`, `weight`, `fg`). It
  appears when the category has more than one aspect with its own scale or list.
- **Family.** A named member of a parallel set: every member carries the same words below
  it, each pointing at the same kind of stop. Today only color has families (`brand`, `critical` …); the
  neutral is implied by its absence.
- **Variant.** A qualifier that narrows which one, within a property, that is neither a
  state nor a position (`ghost`, `heading`, `on-inverse`).
- **Specifier.** The last segment: the word that makes a token unique within its group.
  Its kind depends on the layer: a position in a base token, a state, size, density, word
  or name in a semantic token, a state in a component token.
- **Shape.** One allowed sequence of segments for a category, as a list of word lists:
  `space`, then `gap`, then a where-word, then a density word. The grammar is the set of
  shapes; a path is legal when it matches one.
- **Word list.** The closed list of words a segment may draw from (the state words, the
  size words, the five emphasis words). A word enters the system by being added to a
  list, nowhere else.
- **Default spelled.** A path is a token or a group, never both, so the default of a set
  is written out (`enabled`, `normal`, `regular`) rather than left bare.
- **Group, token; parent, child, sibling.** The words for structure. A group is a path
  that holds other paths (a folder in Figma); a token is a path that holds a value. A
  group is the parent of what it holds; those are its children; children of one group
  are siblings. These, or the exact slot words, are used instead of metaphors.

## Layers

- **Layer.** Which of three kinds a token is. The layer is not a segment; it is recorded
  on every token and shows in the shape.
- **Base token.** A value on a scale, named for its position (`space/400`, `opacity/016`,
  `color/brand/pen-70`). It never says what it is for. Intent is allowed in how the scale
  is built, never in the name.
- **Semantic token.** A value named for its purpose, always an alias to a base token or a
  composition of them (`size/icon/sm`, `color/fg/critical/regular`).
- **Component token.** A value only one component needs; the component's name takes the
  category's place. None exist yet.

## Scales and positions

- **Scale.** An ordered run of values of one kind: the space steps, the opacity steps,
  the font sizes.
- **Unit.** The 4 px every dimension scale is built on. Never "base unit".
- **Step.** A numbered position on a scale: for a dimension, the number of units times
  100, at least three digits (`400` is 16 px); for any other scale, the value itself
  (`016` is sixteen percent, `080` is eighty milliseconds).
- **Position.** Where a base token sits on its scale: a step, or a named place (`full`,
  `enter`, `sm` for a breakpoint, `pen-70`).
- **Size word.** `2xs` to `2xl`: the words for a position on a run of sizes, used by
  semantic tokens only (icons, controls, text), and by breakpoints.
- **Density word.** `condensed`, `normal`, `spacious`: the semantic space words.
- **State.** One of a closed list of conditions a token changes with: `enabled`, `hover`,
  `pressed`, `selected`, `focus`, `disabled`. A state is always the last segment, and
  only semantic and component tokens carry one.

## Color

- **Stop.** A color base token: one of a family's computed colors, a band at a lightness.
- **Band.** The word in a stop's name that says which job it serves: `paper`, `chalk`,
  `highlighter`, `pencil`, `pen`. The number after it is the lightness, inverted, so
  bigger is stronger.
- **Seed.** The brand hex every family's stops are computed from.
- **The neutral.** The gray family. In a role it is implied by the absence of a family
  word (`fg/regular` is the neutral's; `fg/brand/regular` is the brand's).
- **Stamp (color).** The engine's button fill: `stamp-0` at rest, `stamp-1` and `stamp-2`
  one and two steps from rest, `stamp-edge` its outline, `stamp-on` the text over it.
  Positions, not states; the roles name the states.
- **Emphasis word.** The five words a text, ground or border is picked by: `regular`,
  `accent`, `hint`, `muted`, `strong`, in that order everywhere.
- **Word table.** For one color property, which stop each emphasis word points at,
  with what each is for (`fg`: regular → `pen-70`, accent → `pencil-47` …). The same
  table holds in the neutral and in every family.
- **Level.** One of three interaction grounds under `bg`: `ghost` (nothing at rest),
  `soft` (a tint at rest), `solid` (the stamp).
- **Posture.** Which ground a link is read against: `default` or `inverse`.
- **Plane.** One of four hidden theme rows that hold a paper per mode (`plane/high` …);
  what a surface points at.
- **Surface.** A semantic color for a ground that is an elevation plane and reverses
  with the mode (`surface/high`). A `bg` is a flat fill and does not.
- **Pair.** A translucent semantic color, emitted as two tokens: a color alias and an
  opacity token (`bg/ghost/hover` with `opacity/ghost/hover`). Never a computed color.
  In Figma the pair is composed by hand, once.
- **Offered, reserved.** Whether a role is in the picker. Offered rows are published;
  reserved rows exist in the library for component authors and are hidden from
  publishing. Offering a row later is a list edit, never a new name.

## Figma and the token file

- **Collection.** A Figma container for variables; one per axis a designer switches on a
  frame. A collection is never part of a name.
- **Mode.** One setting of a collection's axis (light, dark; mobile, desktop). The same
  paths, different values.
- **Context.** The token file's word for a mode.
- **Alias.** A token whose value is another token (`{color.brand.pencil-47}`).
- **Composite.** A token made of parts: a text style (family, size, weight, line height,
  letter spacing), a shadow (its layers), a transition (an easing and a duration).
- **Token file.** The Design Tokens format document the generator writes: one file per
  collection and mode, joined by a resolver.
- **Resolver.** The small document that says which files make up each mode.
- **Identity tag.** The hidden mark a plugin writes on a Figma variable or style so the
  row is found by what it is rather than by its name. Both plugins write one: the color
  engine's on its rows, the generator's (holding the token's path) on every row and
  style it owns. The scripts call writing it "stamping" and name it `stamp` in code;
  in prose it is the identity tag, because `stamp` is a color word.
- **Today's name.** What a row is called in the library before the rollout; the rename
  map pairs it with its path so the row is renamed in place and its bindings survive.

## The generator

- **Declaration.** One of the short files in `declarations/` that hold a decision as
  data, one file per thing decided: `scale.ts` (the unit), `space.ts`, `size.ts`,
  `radius.ts`, `border-width.ts`, `opacity.ts`, `motion.ts`, `breakpoint.ts`, `grid.ts`,
  `font.ts`, `text.ts` (the text styles), `shadow.ts`, `color.ts` (the word tables, the levels,
  what is offered), `collections.ts` (which collection each category lives in), and
  `renames.ts` (today's names). "The declarations" means these fifteen files; nothing
  else is an input.
- **Derive.** To compute a token's name, value, alias or description from the
  declarations rather than write it.
- **Roster.** The full list of tokens the generator produces, in document order.
- **Audit.** The check that runs on every build: every name in the grammar, every token
  described, every alias resolving, every scale ascending, the files on disk equal to
  what the declarations produce, two builds identical.
- **Generate.** The command that writes every output from the declarations: the token
  file, the Figma payloads, the plugin, the documentation pages.
