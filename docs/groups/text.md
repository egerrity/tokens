# Text styles

Generated from `declarations/text.ts`. To change anything here, edit the declaration and run `npm run generate`.

## Decided

- What each role is for.
- Each style: its role and size, family, weight, line height, letter spacing in percent, and its font size per viewport.

## Derived

- Each style as a composite whose family, size, weight and line height reference the font scale.
- The font size of a viewport that declares none, from its fallback.
- Letter spacing as a length, from the percent and the size at each viewport.
- Every description.

## Tokens

| Token | Value | Required for |
| --- | --- | --- |
| `text/display/lg` | `font/family/sans` `font/weight/semibold`, `font/size/1000` (40 px), line height `font/line-height/125`, letter spacing 0 px (mobile); `font/family/sans` `font/weight/semibold`, `font/size/1800` (72 px), line height `font/line-height/125`, letter spacing 0 px (tablet, desktop, wide) | large, high-impact moments: page titles, major section introductions; the lg size |
| `text/display/md` | `font/family/sans` `font/weight/semibold`, `font/size/800` (32 px), line height `font/line-height/125`, letter spacing -0.64 px (mobile); `font/family/sans` `font/weight/semibold`, `font/size/1500` (60 px), line height `font/line-height/125`, letter spacing -1.2 px (tablet, desktop, wide) | large, high-impact moments: page titles, major section introductions; the md size |
| `text/display/sm` | `font/family/sans` `font/weight/semibold`, `font/size/650` (26 px), line height `font/line-height/125`, letter spacing -0.39 px (mobile); `font/family/sans` `font/weight/semibold`, `font/size/1200` (48 px), line height `font/line-height/125`, letter spacing -0.72 px (tablet, desktop, wide) | large, high-impact moments: page titles, major section introductions; the sm size |
| `text/heading/lg` | `font/family/sans` `font/weight/medium`, `font/size/800` (32 px), line height `font/line-height/125`, letter spacing -0.64 px (mobile); `font/family/sans` `font/weight/medium`, `font/size/1000` (40 px), line height `font/line-height/125`, letter spacing -0.8 px (tablet, desktop, wide) | the headings that define content blocks and guide a reader through the page; the lg size |
| `text/heading/md` | `font/family/sans` `font/weight/medium`, `font/size/650` (26 px), line height `font/line-height/125`, letter spacing -0.39 px (mobile); `font/family/sans` `font/weight/medium`, `font/size/800` (32 px), line height `font/line-height/125`, letter spacing -0.48 px (tablet, desktop, wide) | the headings that define content blocks and guide a reader through the page; the md size |
| `text/heading/sm` | `font/family/sans` `font/weight/medium`, `font/size/500` (20 px), line height `font/line-height/125`, letter spacing -0.2 px (mobile); `font/family/sans` `font/weight/medium`, `font/size/650` (26 px), line height `font/line-height/125`, letter spacing -0.26 px (tablet, desktop, wide) | the headings that define content blocks and guide a reader through the page; the sm size |
| `text/heading/xs` | `font/family/sans` `font/weight/medium`, `font/size/375` (15 px), line height `font/line-height/125`, letter spacing -0.15 px (mobile); `font/family/sans` `font/weight/medium`, `font/size/500` (20 px), line height `font/line-height/125`, letter spacing -0.2 px (tablet, desktop, wide) | the headings that define content blocks and guide a reader through the page; the xs size |
| `text/title/lg` | `font/family/sans` `font/weight/medium`, `font/size/450` (18 px), line height `font/line-height/150`, letter spacing -0.018 px (mobile, tablet, desktop, wide) | labels for subsections, card headers and contextual identifiers; the lg size |
| `text/title/md` | `font/family/sans` `font/weight/medium`, `font/size/375` (15 px), line height `font/line-height/150`, letter spacing -0.015 px (mobile, tablet, desktop, wide) | labels for subsections, card headers and contextual identifiers; the md size |
| `text/title/sm` | `font/family/sans` `font/weight/medium`, `font/size/350` (14 px), line height `font/line-height/150`, letter spacing -0.014 px (mobile, tablet, desktop, wide) | labels for subsections, card headers and contextual identifiers; the sm size |
| `text/title/xs` | `font/family/sans` `font/weight/medium`, `font/size/300` (12 px), line height `font/line-height/150`, letter spacing 0 px (mobile, tablet, desktop, wide) | labels for subsections, card headers and contextual identifiers; the xs size |
| `text/body/lg` | `font/family/sans` `font/weight/regular`, `font/size/450` (18 px), line height `font/line-height/150`, letter spacing -0.018 px (mobile, tablet, desktop, wide) | paragraphs, descriptions and general content; the lg size |
| `text/body/md` | `font/family/sans` `font/weight/regular`, `font/size/375` (15 px), line height `font/line-height/150`, letter spacing -0.015 px (mobile, tablet, desktop, wide) | paragraphs, descriptions and general content; the md size |
| `text/body/sm` | `font/family/sans` `font/weight/regular`, `font/size/350` (14 px), line height `font/line-height/150`, letter spacing -0.014 px (mobile, tablet, desktop, wide) | paragraphs, descriptions and general content; the sm size |
| `text/body/xs` | `font/family/sans` `font/weight/medium`, `font/size/300` (12 px), line height `font/line-height/150`, letter spacing -0.012 px (mobile, tablet, desktop, wide) | paragraphs, descriptions and general content; the xs size |
| `text/link/lg` | `font/family/sans` `font/weight/medium`, `font/size/450` (18 px), line height `font/line-height/150`, letter spacing -0.018 px (mobile, tablet, desktop, wide) | navigation and actions written as underlined text; the lg size |
| `text/link/md` | `font/family/sans` `font/weight/medium`, `font/size/375` (15 px), line height `font/line-height/150`, letter spacing -0.015 px (mobile, tablet, desktop, wide) | navigation and actions written as underlined text; the md size |
| `text/link/sm` | `font/family/sans` `font/weight/medium`, `font/size/350` (14 px), line height `font/line-height/150`, letter spacing -0.014 px (mobile, tablet, desktop, wide) | navigation and actions written as underlined text; the sm size |
| `text/link/xs` | `font/family/sans` `font/weight/medium`, `font/size/300` (12 px), line height `font/line-height/150`, letter spacing -0.012 px (mobile, tablet, desktop, wide) | navigation and actions written as underlined text; the xs size |
| `text/tabular-number/sm` | `font/family/number` `font/weight/medium`, `font/size/350` (14 px), line height `font/line-height/150`, letter spacing 0 px (mobile, tablet, desktop, wide) | scannable numeric data in tables; the sm size |
| `text/tabular-number/xs` | `font/family/number` `font/weight/medium`, `font/size/300` (12 px), line height `font/line-height/150`, letter spacing 0 px (mobile, tablet, desktop, wide) | scannable numeric data in tables; the xs size |
| `text/button/md` | `font/family/sans` `font/weight/medium`, `font/size/375` (15 px), line height `font/line-height/150`, letter spacing -0.015 px (mobile, tablet, desktop, wide) | text inside buttons and other interactive components; the md size |
| `text/button/sm` | `font/family/sans` `font/weight/medium`, `font/size/350` (14 px), line height `font/line-height/150`, letter spacing -0.014 px (mobile, tablet, desktop, wide) | text inside buttons and other interactive components; the sm size |
| `text/code/sm` | `font/family/mono` `font/weight/medium`, `font/size/350` (14 px), line height `font/line-height/150`, letter spacing 0 px (mobile, tablet, desktop, wide) | inline code, developer references and system output; the sm size |
