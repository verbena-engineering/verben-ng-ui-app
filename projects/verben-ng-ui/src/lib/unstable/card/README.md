# ⚠️ Unstable: composable card (`<vbn-card>`)

**Status:** in team review (added 2026-10-07). The existing `<verben-card>` (`CardModule`) is unchanged.
Live docs: `/documentation/unstable/card` in the docs app.

## The idea

shadcn-style: small parts you combine in any order and nest to any depth, plus two shortcuts so
the common cases are one line.

```html
<vbn-card>                                         <!-- variant, size, orientation, align, interactive -->
  <vbn-card-header avatar title="…" description="…">   <!-- avatar → initials from the title -->
    <vbn-card-action>…</vbn-card-action>           <!-- top-right slot -->
  </vbn-card-header>
  <img vbnCardMedia ratio="4/5" src="…" alt="…">   <!-- edge to edge -->
  <vbn-card-content>… sub-cards go here …</vbn-card-content>
  <vbn-card-footer justify="between">…</vbn-card-footer>
</vbn-card>

<vbn-card title="Shipping" description="Lekki, Lagos"></vbn-card>   <!-- header shortcut -->
```

## Coming from `<verben-card>` (no rewrite needed)

`<vbn-card>` takes `<verben-card>`'s markup as it is, so moving a screen over is **renaming the tag**
and importing `UnstableCardModule` next to `CardModule` (both work side by side):

| `<verben-card>` | `<vbn-card>` |
|---|---|
| `pd`, `mg`, `width`, `height`, `aspectRatio` | Same. `pd="50px 30px"` = vertical horizontal; unset = spacing from `size` |
| `bgColor`, `textColor`, `border`, `borderRadius` | Same; applied to that card only (not to cards inside it) |
| `disabled` | Same, and now visible (dims + blocks clicks + `aria-disabled`); on `verben-card` it set a class with no style |
| `<div card-header>`, `card-body`, `card-footer` | Same. Your content keeps its own layout; header still first, footer last |

How: the inputs are host style bindings; the slots are styled in `card.css` with `:where(.vbn-card > [card-…])`
(zero specificity, only inside a `vbn-card`) so the screen's own classes (Tailwind, component CSS) still win
and old `<verben-card>`s in the same app are untouched. Then adopt parts gradually: sub-cards inside
`card-body`, `<vbn-card-footer justify>`, badges… Differences: no grey header/footer bars, and content
outside the three slots is shown (`verben-card` dropped it).

| Part | What it does |
|---|---|
| `vbn-card` / `[vbnCard]` | Container. `variant` outline·elevated·filled·ghost, `size` sm·md·lg, `orientation` vertical·horizontal, `align` start·center, `interactive`, `title`/`description` shortcut, plus every `<verben-card>` input |
| `vbn-card-header` | Grid: avatar · title / description · action. Shortcut inputs `title`, `description`, `avatar`. Below ~280px wide the action moves under the text |
| `vbn-card-title`, `vbn-card-description` | Text (title is `role="heading"`, `level` input) |
| `vbn-card-action` | Header's top-right slot; also an inline group (icon row) |
| `vbn-card-content` | Body; sub-cards spaced automatically; `columns` → grid (1 column on phones); `columns="auto"` fits as many as there's room for (min `--vbn-card-min-column`, 240px) |
| `vbn-card-footer` | Row; `justify` start·between·around·center·end |
| `[vbnCardMedia]` | Full-bleed img/video/div, `ratio`; flush with top/bottom edge when first/last |
| `vbn-card-divider` | Separator |
| `vbn-avatar` | Photo · initials · icon; `size`, `tone`, `overlap` (over a cover) |
| `vbn-stat` | Value with a label under it |
| `vbn-amount` | Money: `+₦` green in, `−₦` red out (`currency`, `locale`, `signed`, `colored`) |
| `vbn-badge` | Soft status pill; `tone` success·warning·error·info·neutral (tint mixed from the tone color) |

Nesting needs no extra code: a card inside a card gets tighter padding and smaller corners. Ghost
cards (comment rows, transaction rows) have no side padding so they line up with their parent.

## Scenarios covered in the docs (lines of template)

Social post (~19) · comment thread with recursive replies (~17) · profile
with cover, overlapping avatar and stats (~12) · bank transactions with balance (~17) · order with
side-by-side sub-cards and a third nesting level (~23).

**A real screen:** the docs app's Playground → **Vendor Invoices** (`/documentation/vendor-invoices`, marked
unstable) rebuilds the app's invoices screen with these cards inside the stable `<verben-data-view>` toolbar:
search, filter / sort / create popovers (each a card), invoice cards with + for their lines (cards inside
cards), click for a details card (form, lines, Delete / Save), table view, "N of M records loaded · Load more".
Its Usage tabs show the screen's real HTML and CSS. Source: `src/app/documentation/pages/playground/vendor-invoices/`.

## How it is built

- Standalone components (+ `UnstableCardModule` and a `VBN_CARD` array for standalone apps).
- One shared stylesheet `card.css` with `ViewEncapsulation.None`; every class starts with `vbn-card`
  (avatar/stat/amount carry their own small styles so they work outside a card too).
- Parts only add a CSS class, so they work as elements or attributes (`<h3 vbnCardTitle>`).
- Colors from `--vbn-*` tokens (dark mode works). Card tokens: `--vbn-card-bg`, `--vbn-card-border`,
  `--vbn-card-radius`, `--vbn-card-padding`, `--vbn-card-gap`, `--vbn-card-nested-padding`,
  `--vbn-card-min-column`.
- Avatar and badge tints are `color-mix()`ed from the tone's main color, not the theme's `*-bg`
  tokens (`--vbn-color-error-bg` is yellow in the default theme).
- Uses CSS `:has()` (header with/without avatar) and a container query (narrow header); both are
  supported in current Chrome, Edge, Safari and Firefox.

## Performance

- Parts are standalone `OnPush` components whose template is just `<ng-content>`; they only set a class on their
  own element, so a change-detection check has nothing to compare inside them. `vbn-amount` / `vbn-avatar` compute in
  `ngOnChanges`, not per check.
- Layout (auto-fill columns, narrow header, list ↔ details) is CSS (grid, `:has()`, container queries): no JS on resize.
- Trade-off: a card is a few small components, so a full check of a screen of cards touches more bindings than plain
  `<div>`s. Keep screens `OnPush`, track lists by id and page long lists. Measured on the Vendor Invoices playground
  (`#performance`): a check from elsewhere in the app skips the screen (0.20 ms page total vs 1.16 ms for Card Data
  View with 48 items); a check of the screen itself is 1.40 ms vs 0.56 ms; 7 vs 21 elements per card.

## Decisions to confirm in review

1. **Tag names** `vbn-card…` (short) vs the library's usual `verben-…`. The "unstable" signal is the module name.
2. **Default variant** `outline` (shadcn default) vs `elevated`.
3. **Amount colors:** money out shown in red. Some banking apps show debits in the normal text color.
4. Should `verben-card` be replaced by this once promoted, or live alongside it? (Recommended: replace;
   the markup is compatible, see below.)
5. Old slots get no grey header/footer bars. Keep it that way, or add an opt-in look for screens that want them?

## Promotion checklist

- [ ] Decisions above agreed
- [ ] Used in at least one real screen
- [ ] Rename `UnstableCardModule` → e.g. `VbnCardModule` (tags stay)
- [ ] If replacing `verben-card`: add `verben-card` to `VbnCardComponent`'s selector, delete the old
      `CardComponent`, make `CardModule` export the new parts → existing screens need **no** change.
      Check the library's own users visually: data-filter, data-export, data-import, data-sort,
      data-columns, data-extend, data-xport (they style their `.card-header/.card-body/.card-footer`)
- [ ] Move `src/lib/unstable/card/` → `src/lib/components/…`, update `public-api.ts`
- [ ] Remove the dev-mode console warning in `card.component.ts`
- [ ] Move the docs page from "Unstable" to "Components"

## Tests

5 unit tests in `card-utils.spec.ts` (initials, amounts, aspect ratio, `pd` parsing).

```bash
npx ng test verben-ng-ui --watch=false --browsers=ChromeHeadless --include='**/unstable/**/*.spec.ts' --ts-config=projects/verben-ng-ui/tsconfig.spec.unstable.json
```
