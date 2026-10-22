# The case for the plan

Written for an engineer reading `design-system-plan.md`, in answer to two concerns
raised about the design system: that theme behavior needs one source of truth, and that
palette generation must not depend on any UI library. Both are right. This page says how
the plan meets each, where it goes past them and why, and what is engineering's to build
and to decide. The words it uses are defined in `glossary.md`.

## The two concerns, as raised

1. **One source of truth for theme behavior.** The system defines semantic tokens
   independent of any framework, for color, typography, spacing, shape, motion and
   component states. Each supported library has a maintained adapter that applies them
   through that library's own theme. For MUI, visual rules flow through the theme, with
   component-level styling limited to intentional exceptions, because a product that
   mixes theme overrides with hard-coded component styles drifts, and a change to the
   shared theme stops reaching every application. With it, a doubt: that per-component
   declarations can be managed at a granular level.
2. **Palette generation independent of the framework.** A complete, accessible palette
   from an arbitrary brand color, produced by a color engine that is not MUI's,
   deterministic, with each adapter mapping its output onto the library's own concepts.
   A different engine is reasonable if its output is deterministic and accessible and
   maps cleanly across every supported library.

## What the system is, in those terms

Five layers, each generated from the one before it.

| Layer | What it holds | Generated from |
| --- | --- | --- |
| base tokens | values on scales; the color ones solved by the engine from a seed | the declarations and the engine |
| semantic tokens | a name for a purpose, every one an alias to a base token | the declarations |
| component declarations | per component, its parts by variant and state, each part reading a semantic token | the rules by component, transcribed |
| adapters | one library's theme: MUI's theme options and style overrides; Tamagui's theme; the Figma binding spec | the component declarations |
| packages | the React package a product installs; the native package later | the adapters |

Each sentence of the first concern lands on a layer. The framework-independent semantic
tokens are the second layer. The adapter per library is the fourth, and it is generated,
which is what "maintained" means here. Visual rules flow through the theme because the
adapter's output is a theme. And no product carries component-level styling, because
the component-level rules are generated into the theme as style overrides from the
third layer. The intentional exceptions are the rows the owner ruled in the component
declaration, and they live in the theme, never in a product.

The second concern is the engine's definition. It takes a seed and solves every family's
stops in both modes with the contrast requirements met during generation, so the output
is deterministic from the seed and accessible by construction, and the adapters map it
onto each library's concepts. The engine is a workspace package inside the repository,
linked at the source, so the generator and the engine cannot drift apart by a version.

## The granularity

The doubt is that per-component declarations cannot be managed at a granular level.
What manages them:

- **They are data, not documents.** One record per component, checked on every build by
  an audit for totality, every part mapped in every adapter, and for the resolved values
  per brand and mode, every text over its fill meeting WCAG's minimum contrast for text
  ([Contrast (Minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum)).
- **They are transcribed, not designed.** The rules exist already as tables by
  component, variant, state and part, for the library's components and for MUI's. The
  declaration is those tables as data.
- **The generator already works this way.** Every path in the token roster comes from
  one grammar, is audited on every build, and two builds are identical. The component
  declaration is the same mechanism one layer up.
- **The alternative is the unmanageable one.** Adapter rows written by hand, per library,
  are what cannot be kept consistent at scale. Generating them from one record is what
  removes that work rather than adding it.

A second adapter exists in proof form: a Tamagui theme map onto the engine's names, with
its decisions recorded. The plan re-keys it onto the component declaration at the stage
that writes the declaration, as a check that nothing of MUI's anatomy has become the
system's, before the native package is built.

## Why MUI's palette cannot be the canonical palette

Three facts about how MUI's palette is built, each a reason the engine is needed:

- **One `main` per family serves as text and as fill.** A button's fill and a label's
  color read the same value, so the fill cannot fork from the text. A seed that works as
  a fill often fails as text, or the reverse.
- **Hover, `light` and `dark` are derived by lightening and darkening `main`** by fixed
  amounts. No contrast is solved, so a derived hover can fall under the bar the resting
  fill passed.
- **The text over a fill is chosen by a threshold against `main` alone.** So a seed must
  already pass against its ground for the theme to come out accessible. The palette does
  not make it so.

The engine solves the contrast during generation. The button fill is its own instrument
per family, with its text and its edge paired to it; every level and state is a solved
stop. The plan keeps MUI's palette only as a backstop: filled from the engine's resolved
values where MUI's internals read it, with a sentinel color in every slot the set has no
color for, so a read an override missed shows as magenta in the test rather than as an
invented color.

## Two states, and why not a fork

- **First, the thin package.** MUI's components re-exported unchanged, the generated
  adapter applied by a provider, the props speaking MUI's words. Upstream fixes arrive as
  a version bump. The API is MUI's, so adoption costs nothing to learn.
- **Last, the system's own components on a substrate.** Behavior and accessibility stay
  upstream in a headless library; the visible layer is the system's, styled from the
  declarations, exposing only the overrides the system chooses.
- **Not a fork of MUI.** A fork owns the styling layer, which is the part to strip, the
  behavior layer, which is the part worth inheriting, the tests, the docs, and React and
  browser compatibility, and it loses upstream the day it diverges.

The field's advice at enterprise scale, "Custom design system is still worth it", from
Romina Kavcic's 2026 guide, comes paired with a small team that curates rather than
builds, on an open-source substrate, and with governance over components. The plan reads
it that way. The move from the first state to the last is per component, behind the
same import path, and the declarations, the audits, the Figma library and the docs do
not change when a component moves. The first state is also how the system earns what the
last one needs: usage data before components are built, and the engineer's buy-in while
they are.

## Control

Control is by checks, not by the package. The ways to override MUI stay open in the
first state, so the checks are what hold the line, and they run in the system and in
every product:

- The generator's audit: every name in the grammar, every token described, every alias
  resolving, every scale ascending, two builds identical and equal to the committed
  files.
- The engine's value gates, with their snapshots.
- The component declaration's audits: totality, adapter coverage, the resolved pairings.
- The backstop's slot list, every slot filled or sentinel.
- The runtime entry's output equal to the build's, for every declared brand.
- The rendered-color test in the harness and in each product: every rendered color a
  token or a token at a token opacity, every text meeting WCAG's minimum, no sentinel on
  screen.
- The lint a product installs: no MUI import, no color literal, no color key in `sx`.
- The Figma binding audit, whose report is committed with each library publish.

Design owns the rules: the declarations, the grammar, the engine, the emitters, the docs
and the Figma payload. Engineering owns what ships: the package code, the build tooling,
CI, publishing, the harness's test infrastructure and the lint. Ownership is by folder.
A declaration change merges on design's review when the gates pass, so the gates are the
reviewer for a visual rule; engineering reviews code that changes how a gate or a
package works.

## What is engineering's

To build: the React package's code, the re-exports and the provider; the workspace and
the build tooling; CI; publishing; the harness's test infrastructure; the lint as a
config a product installs.

To decide: the registry; the MUI major at the stage that builds the adapter, recorded in
the package; how the lint is distributed; the harness's test framework; the native
trigger, with the platform team.

## What stays open

- The graduation trigger and the substrate.
- The native package's trigger.
- The component rows listed under the plan's open rulings.
