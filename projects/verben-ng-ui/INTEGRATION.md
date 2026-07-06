# Integrating the `verben-ng-ui` Theme (Consumer Guide)

> **Audience:** an engineer or coding agent working *inside a project that depends on
> `verben-ng-ui`*. This file tells you exactly how to wire the theme into that project.
> For the full token list and the design rationale, see **[THEMING.md](./THEMING.md)**.
> This is the task-oriented playbook; THEMING.md is the reference.

---

## 0. TL;DR (agent fast path)

The theme is a set of CSS custom properties (`--vbn-*`) shipped in
`node_modules/verben-ng-ui/styles/theme.css`. They cascade from `:root`, so they cross
component **and library** boundaries automatically. **Exactly one project — the top-level
application — loads `theme.css` and (optionally) calls `VerbenUiModule.forRoot(...)`.**
Everything nested below it inherits the same tokens for free.

First, determine which role this project plays, then jump to that section:

| Role | How to tell | What you do |
|---|---|---|
| **A. Leaf application** | Has a root `AppModule`/bootstrap, an `angular.json` with a buildable app target, is deployed to users. Depends on `verben-ng-ui` (directly or transitively). | §2 — load `theme.css`, call `forRoot()`. **This is the only layer that configures the theme.** |
| **B. Intermediate library** | Is itself an Angular library (`ng-packagr`, publishes to npm), lists `verben-ng-ui` under **`peerDependencies`**, is consumed by other projects. | §3 — do **not** load `theme.css` or call `forRoot()`. Just make your own styles read `--vbn-*` tokens. |
| **C. `verben-ng-ui` itself** | You're editing this library. | Not a consumer — see [THEMING.md](./THEMING.md). |

**Minimum version:** the theme layer ships in `verben-ng-ui@>=1.3.0` (the first release
that contains `styles/theme.css` and the `theme` entry point). If
`node_modules/verben-ng-ui/styles/theme.css` does not exist, upgrade first:
`npm i verben-ng-ui@latest`.

---

## 1. Mental model (read this once)

- **The contract is CSS custom properties**, prefixed `--vbn-`. Because custom
  properties inherit through the DOM regardless of Angular's `ViewEncapsulation`, a value
  set on `:root` reaches every component's scoped CSS **and** every `[ngStyle]`/inline
  binding — in `verben-ng-ui` and in every other library that reads the same tokens.
- **Two token layers:** a small set of *core* tokens (brand, surface, text, border,
  status, radius, typography) and *component* tokens that fall back to core via
  `var(--vbn-component-x, var(--vbn-core-x))`. You normally set only core tokens.
- **`theme.css` is the single source of default values** (light `:root` + dark
  `[data-vbn-theme="dark"]`). It must be loaded **once, globally**, by the leaf app.
  Loading it in a library or more than once is wrong (see §3, §5).
- **`forRoot()` / `ThemeService` is a convenience layer** that writes tokens onto
  `document.documentElement` from TypeScript. It is optional — a project can theme purely
  by overriding `--vbn-*` in its own CSS. Use `forRoot()` for static brand config;
  `ThemeService` for runtime changes (rebrand, dark-mode toggle).

---

## 2. Role A — Leaf application (the configuring layer)

Do all three steps. This is the complete integration for an app like `White360FE`.

### 2.1 Load `theme.css` globally (required)

Add it as the **first** entry so your own styles can override tokens after it. Pick one:

**Option 1 — `angular.json` `styles` array** (preferred; add to every build config that
has a `styles` array):

```jsonc
"styles": [
  "node_modules/verben-ng-ui/styles/theme.css",
  // ...existing entries (other verben-*-ui styles, src/styles.css) after this
]
```

**Option 2 — `@import` at the top of your global stylesheet** (`src/styles.css` / `.scss`):

```css
@import 'verben-ng-ui/styles/theme.css';
```

> Load `theme.css` **before** any other `verben-*-ui` style sheets and before your own
> `src/styles.*`, so those can override tokens.

### 2.2 Configure the brand (optional but usual)

In your root `AppModule` (or `main.ts` providers for standalone bootstrap):

```ts
import { VerbenUiModule } from 'verben-ng-ui';

@NgModule({
  imports: [
    // ...
    VerbenUiModule.forRoot({
      color: {
        primary: '#D4A007',      // your brand
        error:   '#E20000',
      },
      typography: { fontFamily: 'Montserrat, sans-serif' },
      radius: '6px',
      // Escape hatch for component tokens with no lean alias:
      tokens: { '--vbn-table-header-bg': '#EFF2FB' },
    }),
  ],
})
export class AppModule {}
```

Everything you omit keeps its shipped default. Skip `forRoot()` entirely and just
override `--vbn-*` in your own `:root {}` if you prefer pure CSS.

**Standalone bootstrap** (no `AppModule`): call `importProvidersFrom(VerbenUiModule.forRoot({...}))`
in `bootstrapApplication(AppComponent, { providers: [...] })`.

### 2.3 Dark mode (optional)

`theme.css` already defines the dark set under `[data-vbn-theme="dark"]`. Activate it any of:

```ts
constructor(private theme: ThemeService) {}
enableDark() { this.theme.setMode('dark'); }   // or this.theme.toggleMode()
```
or the directive on a toggle element (persists to `localStorage`):
```html
<button [appThemeSwitcher]>Toggle theme</button>
```
or set the attribute yourself: `document.documentElement.setAttribute('data-vbn-theme','dark')`.

### 2.4 Runtime rebrand (optional)

```ts
this.theme.applyTheme({ color: { primary: '#0ea5e9' } }); // repaints everything live
this.theme.setToken('--vbn-table-header-bg', '#1f2937');  // one raw token
```

### 2.5 Done — verify (see §4).

---

## 3. Role B — Intermediate library (e.g. `verben-workflow-ui`)

An intermediate library is consumed *inside* a leaf app that already loaded `theme.css`
and called `forRoot()`. Your job is only to **participate** in whatever theme the app
sets — not to configure or load anything.

### DO

1. **Keep `verben-ng-ui` in `peerDependencies`** (not `dependencies`). This guarantees the
   final app resolves a single instance and a single `:root` token set.
   ```jsonc
   // projects/<your-lib>/package.json
   "peerDependencies": {
     "verben-ng-ui": "^1.3.0"   // bump to the theming-capable range
   }
   ```
2. **Make your own component styles read the tokens.** Replace hardcoded colors in your
   library's `.css`/`.scss` and TS style objects with `var(--vbn-*)`. Example — this lib's
   `base-table-style.ts` currently hardcodes `#D4A007` / `#FDFDFD` / `#EFF2FB`; theme-aware
   version:
   ```ts
   export const baseStyle: TableStyles = {
     border: '1px solid var(--vbn-color-border)',
     rows: {
       even: { backgroundColor: 'var(--vbn-table-row-even-bg)' },
       odd:  { backgroundColor: 'var(--vbn-table-row-odd-bg)' },
     },
     header: { backgroundColor: 'var(--vbn-table-header-bg)' },
   };
   ```
   For colors unique to your library that have no `--vbn-*` equivalent, define your **own**
   namespaced token that *falls back to* a verben core token, so it themes by default but
   stays overridable:
   ```css
   .wf-node { background: var(--wf-node-bg, var(--vbn-color-surface)); }
   ```
3. **Document** (in your lib's README) that the host app must load `verben-ng-ui/styles/theme.css`.

### DON'T

- ❌ Do **not** add `verben-ng-ui/styles/theme.css` to your library's `assets` or import it
  in library styles. Libraries don't emit global stylesheets into the app's `:root`, and if
  they did you'd get duplicate/competing token definitions.
- ❌ Do **not** call `VerbenUiModule.forRoot()` anywhere in the library. `forRoot()` is for
  the app's root injector exactly once; calling it in a library breaks that contract.
- ❌ Do **not** move `verben-ng-ui` to `dependencies` — that risks a second copy being
  bundled, splitting the token/`:root` ownership.

> Net effect: the workflow lib ships zero theme config. When `White360FE` sets
> `--vbn-color-primary`, the workflow lib's tables, buttons and the `verben-ng-ui`
> components it renders all recolor together, because they all read the same inherited
> `:root` variables.

---

## 4. Verification checklist (run these)

```bash
# 1. The theme stylesheet exists in the installed package (leaf app):
ls node_modules/verben-ng-ui/styles/theme.css   # must exist; else upgrade the dep

# 2. It's wired into the build (leaf app) — one of these must match:
grep -R "verben-ng-ui/styles/theme.css" angular.json src/styles.*

# 3. The app builds:
ng build

# 4. Prove configurability: change one forRoot value (e.g. color.primary) or
#    override :root { --vbn-color-primary: hotpink } and confirm buttons, table
#    headers/links, dropdown selection, tabs and switches all recolor.

# 5. Prove enforcement in an intermediate library (Role B): no stray literals
#    should remain in your own styles/TS — they should all be var(--vbn-*):
grep -rEi '#[0-9a-f]{3,6}|rgba?\(|: *(red|black|white|gr[ae]y)' \
  projects/<your-lib>/src --include=*.css --include=*.ts
```

Runtime sanity check in the browser console (leaf app):
```js
getComputedStyle(document.documentElement).getPropertyValue('--vbn-color-primary')
// -> your configured brand color, proving theme.css loaded and forRoot applied
```

---

## 5. Multi-layer topology (worked example)

```
White360FE  (Role A — leaf app)
├─ loads  node_modules/verben-ng-ui/styles/theme.css   ← the ONLY place theme.css loads
├─ calls  VerbenUiModule.forRoot({ color:{ primary } }) ← the ONLY place forRoot runs
│
├─ depends on  verben-ng-ui           (direct)
└─ depends on  verben-workflow-ui  (Role B — intermediate library)
       └─ peerDependency → verben-ng-ui   (same single instance as the app's)
          • no theme.css, no forRoot()
          • its own styles read var(--vbn-*)
```

Why this works and what to watch for:

- **Single `:root`, single source of tokens.** Only the leaf app injects `theme.css`, so
  there is exactly one set of `--vbn-*` definitions. `forRoot()` writes onto the same
  `<html>` element. Every nested library reads from that one place.
- **`peerDependency` is load-bearing.** It keeps `verben-ng-ui` a single resolved copy
  across the app and the workflow lib, so tokens (and `TableStyles`, `InjectionToken`s,
  etc.) are shared, not duplicated. Keep versions compatible: the app and every
  intermediate lib should allow the same `verben-ng-ui` major (`^1.3.0`).
- **Tailwind coexistence.** These projects use Tailwind. Tailwind utilities and `--vbn-*`
  tokens are independent — the tokens theme verben components; Tailwind classes theme your
  own markup. If you want them to share a palette, point a Tailwind color at a token:
  `colors: { primary: 'var(--vbn-color-primary)' }` in `tailwind.config.js`.
- **Upgrade order when adopting theming:** (1) publish `verben-ng-ui` with the theme layer;
  (2) bump `verben-ng-ui` in the intermediate lib's `peerDependencies` and tokenize its
  styles, republish; (3) in the leaf app, bump both deps, load `theme.css`, add `forRoot()`.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Components render unstyled / default browser colors | `theme.css` not loaded | Add it to `angular.json` `styles` or `@import` it (§2.1). |
| `forRoot` colors ignored | `theme.css` loaded *after* your overrides, or not at all | Ensure `theme.css` is first in the `styles` array. |
| `ls .../styles/theme.css` missing | Old `verben-ng-ui` (<1.3.0) | `npm i verben-ng-ui@latest`. |
| Colors change in some libs but not the workflow lib | Workflow lib still hardcodes colors | Tokenize its styles (§3, DO #2). |
| Two different primary colors on screen | Duplicate `verben-ng-ui` copies | Ensure intermediate libs use `peerDependencies`; run `npm ls verben-ng-ui` — expect one version. |
| Dark mode doesn't flip everything | A style bypasses tokens | Grep that component for literals (§4 step 5). |

---

## 7. Where to look next

- **[THEMING.md](./THEMING.md)** — every `--vbn-*` token, its light/dark default, and the
  per-component "extra tokens" list. Use it to pick the right token when tokenizing styles.
- `styles/theme.css` (in the installed package) — the authoritative default values.
