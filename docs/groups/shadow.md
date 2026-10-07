# Shadow

Generated from `declarations/shadow.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- Each level, named for what sits at that height: its layers, as offsets, blur and spread in px and black at a percent, the same in both themes.

## Derived

- Each level as a shadow composite, and as an effect style in Figma with its values set in place.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `shadow/raised` | 0 4 8 0 px, black at 8 percent; 0 0 1 0 px, black at 4 percent | elevated cards, bottom sheets |
| `shadow/floating` | 0 4 6 -1 px, black at 10 percent; 0 2 4 -2 px, black at 10 percent | menus, popovers, the navigation bar |
| `shadow/overlay` | 0 4 6 0 px, black at 5 percent; 0 10 15 0 px, black at 10 percent | dialogs, modal sheets, the floating action button |
| `shadow/lifted` | 0 10 10 0 px, black at 4 percent; 0 20 25 0 px, black at 10 percent | an elevated card at its strongest |
