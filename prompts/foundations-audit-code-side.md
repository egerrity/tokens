# Foundations audit, code side: the design values in use

Instructions for a coding agent working in a terminal with read access to the product
code. The operator starts you with "Follow this file, stage 1 only", reads what you
report, and later says "stage 2". Do one stage per request and stop at the end of it.

## What this is for

The design system's foundations (typography, space, size, radius, border width, shadow,
opacity, motion, breakpoints) are being rebuilt as generated design tokens. Before that,
the design owner needs a count of what the product code uses now, for two decisions:

- per foundation, whether a usable scale already exists with a few outliers, or whether
  there is no scale to find;
- how the existing tokens are consumed, so old names can be mapped to new ones.

You produce the counts. You do not give the verdict, propose new values, or change any
product code.

## Rules for both stages

- Read-only on every repository. Write only inside the output folder, which is
  `foundations-audit/` under the directory the operator started you in, unless they name
  another. Create it if missing.
- No commits, no pushes, no branches, no pull requests, no dependency installs inside a
  product repository, no network calls with any content from the code.
- Do not guess. Where you cannot tell, say so and ask.
- Report in plain language: what you found, where, how many. No narrative of your steps.
- Every number must be reproducible: it comes from a script in the output folder, never
  from reading files by eye.

## Stage 1: look and plan. Change nothing.

Find out, and write to `foundations-audit/plan.md`:

1. **Scope.** The repositories and packages reachable from here: product applications,
   the component library, any shared style or token package. List each with its path and
   what it is. Ask the operator to confirm the list and add what you cannot see.
2. **How styling is written.** Every mechanism in use, with the files that prove it and a
   rough share of the code each covers: utility classes and their configuration (name the
   framework, its version, the config files, theme extensions, presets and plugins),
   stylesheets (CSS, SCSS, Less, CSS modules), styles written in script (styled
   components, style objects, inline style attributes, native style sheets), component
   library theme objects.
3. **Where tokens are defined today.** Each file or package that defines named design
   values (custom properties, preprocessor variables, theme keys, JSON or script
   objects): its path, how many names it defines, how the names are spelled, and how the
   values reach the applications (import, build step, published package).
4. **What to scan.** The file patterns to include, and what you would leave out and why
   (dependencies, build output, generated files, vendored code). Tests and component
   stories are scanned but counted separately.
5. **How you would extract values**, per mechanism from point 2, and what each approach
   cannot see (class names assembled at run time, values computed in script, styles
   injected by a dependency). Name the blind spots; do not hide them.
6. **The script.** Language and runtime already available on this machine, no new
   dependencies if it can be avoided, expected run time.

Then print a summary of `plan.md` of 30 lines or fewer and stop. Do not write the scan
script yet.

## Stage 2: run and report. Only after the operator says so.

Write the scan script into `foundations-audit/`, run it, and produce the files below. The
script is deterministic: the same code produces the same files, rows sorted, no
timestamps inside them.

### What counts as a value

For each foundation, every place the code sets one of these:

| Foundation | Properties |
| --- | --- |
| typography | font size, line height, font weight, font family, letter spacing |
| space | margin, padding, gap, and position offsets (top, right, bottom, left, inset) |
| size | width, height, their minimums and maximums, icon sizes |
| radius | corner radius, any corner |
| border width | border and outline widths |
| shadow | box shadow, drop shadow, text shadow, native elevation |
| opacity | opacity, and alpha written into a color |
| motion | transition and animation durations, delays, easing curves |
| breakpoint | media and container query widths, and breakpoint keys in configuration |
| color | literal colors only (hex, rgb, hsl, named), counted, not analysed |

Classify each occurrence by how it is written:

- `token`: a reference to a named design value from stage 1, point 3;
- `scale-utility`: a utility class or theme key that resolves through the framework's
  configured scale;
- `arbitrary`: a utility with a one-off value written into it;
- `literal`: a raw value in a stylesheet, style object or attribute.

Normalize so equal values compare equal: lengths in pixels (say which root font size you
assumed for rem and whether the code overrides it), line height as a multiplier of the
font size where both are known and otherwise as written, durations in milliseconds.
Keep the value as written beside the normalized one.

### Files to produce

- `values.csv`: one row per distinct value per property. Columns: foundation, property,
  value as written, normalized value, classification, token or class name if any, number
  of uses, number of files, number of repositories, uses in tests and stories.
- `type-combinations.csv`: font size, line height, weight, family and letter spacing as
  they occur together on one element or rule, with the number of uses. One row per
  distinct combination.
- `tokens.csv`: one row per existing token. Columns: name, defining file, value, the
  foundation it belongs to, number of references, number of files referencing it, how it
  is referenced (custom property, utility class, import, preprocessor variable). Tokens
  with no references are listed, not dropped.
- `samples.md`: for each foundation, five occurrences picked by a fixed rule (every nth
  row), each with file path, line number and the line itself, so a person can check the
  extraction by hand.
- `summary.md`: one page.
  - One table, one row per foundation: distinct values; total uses; share of uses by
    classification; how many values are used once; how many values cover 80 percent of
    uses; an empty column headed "verdict" for the design owner.
  - Under it, one short paragraph per foundation stating only what the numbers show: for
    example whether the values in use sit on a regular step or ratio, and which values
    fall outside it. No recommendation.
  - One paragraph: how the existing tokens are consumed, and how many are unused.
  - One list: what the scan could not see, from stage 1, point 5, with an estimate of how
    much code that is.

### Before you report

- Run the script twice and confirm the output files are identical.
- Check each foundation's total in `summary.md` against a direct count from `values.csv`.
- Open three rows of `samples.md` yourself and confirm the extracted value matches the
  line.

Then print `summary.md` and the path of the output folder, and stop. If a check fails,
say which and what the difference is.
