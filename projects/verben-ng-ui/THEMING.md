# Theming `verben-ng-ui`

> **Just wiring this into a consuming project?** See **[INTEGRATION.md](./INTEGRATION.md)** —
> a task-oriented, agent-friendly playbook covering leaf apps, intermediate libraries, and
> the multi-layer (peer-dependency) setup. This file is the reference for tokens and design.

Every color, font, radius and shadow in the library is driven by CSS custom
properties (`--vbn-*`). Because custom properties inherit through the DOM
regardless of Angular's view encapsulation, a single value set on `:root`
reaches every component — including styles applied through `[ngStyle]`. This is
the enforcement mechanism: components have **no hardcoded colors**; they read
tokens, so the theme is always obeyed.

## 1. Load the token stylesheet (required)

`styles/theme.css` ships the default values for every token (light + dark). Add
it once to your app's `angular.json` `styles` array:

```jsonc
"styles": [
  "node_modules/verben-ng-ui/styles/theme.css",
  "src/styles.scss"
]
```

…or `@import` it from your global stylesheet:

```scss
@import 'verben-ng-ui/styles/theme.css';
```

## 2. Configure (pick either approach)

### a) Plain CSS — override tokens in your `:root`

```css
:root {
  --vbn-color-primary: #d4a007;
  --vbn-color-error: #e20000;
  --vbn-font-family: 'Montserrat', sans-serif;
  --vbn-radius: 6px;
}
```

### b) TypeScript — `VerbenUiModule.forRoot()`

The lean config maps to core tokens; anything omitted keeps its default.

```ts
import { VerbenUiModule } from 'verben-ng-ui';

@NgModule({
  imports: [
    VerbenUiModule.forRoot({
      color: { primary: '#d4a007', error: '#e20000' },
      typography: { fontFamily: 'Montserrat, sans-serif' },
      radius: '6px',
      // Escape hatch for component tokens that have no lean alias:
      tokens: { '--vbn-table-header-bg': '#1f2937' },
    }),
  ],
})
export class AppModule {}
```

For dynamic changes, inject `ThemeService`:

```ts
constructor(private theme: ThemeService) {}
enableDark() { this.theme.setMode('dark'); }          // or toggleMode()
rebrand()    { this.theme.applyTheme({ color: { primary: '#0ea5e9' } }); }
```

## 3. Dark mode

`theme.css` defines a dark token set under `[data-vbn-theme="dark"]`. Activate it
with `ThemeService.setMode('dark')`, the `[appThemeSwitcher]` directive (click to
toggle, persists to localStorage), or by setting the attribute yourself.

## 4. Per-instance overrides

The color `@Input()`s on components (`bgColor`, `textColor`, `[styleConfig]`, …)
still work and take precedence over the token for that one instance:

```html
<verbena-button bgColor="#fff">One-off</verbena-button>
```

---

## Token reference

### Core tokens (the lean surface you normally set)

| Token | Default (light) | Default (dark) | Purpose |
|---|---|---|---|
| `--vbn-color-primary` | `#ffe681` | — | Brand color |
| `--vbn-color-on-primary` | `#404040` | — | Text/icon on `primary` |
| `--vbn-color-secondary` | `#e8eaf1` | — | Secondary surface |
| `--vbn-color-on-secondary` | `#404040` | — | Text on `secondary` |
| `--vbn-color-surface` | `#ffffff` | `#1e1e1e` | Component background |
| `--vbn-color-surface-alt` | `#f9f9f9` | `#2a2a2a` | Striping/hover/subtle fills |
| `--vbn-color-background` | `#ffffff` | `#121212` | Page/overlay base |
| `--vbn-color-text` | `#334155` | `#e5e7eb` | Body text |
| `--vbn-color-text-muted` | `#64748b` | `#9ca3af` | Secondary text |
| `--vbn-color-border` | `#cbd5e1` | `#3f3f46` | Borders/dividers |
| `--vbn-color-border-focus` | `#3b82f6` | — | Focus border / accent links |
| `--vbn-color-success` / `-bg` / `-contrast` | `#2db76f` / `#d6f3e6` / `#2db76f` | — | Success |
| `--vbn-color-warning` / `-bg` / `-contrast` | `#eda73f` / `#eda73f1a` / `#eda73f` | — | Warning |
| `--vbn-color-error` / `-bg` / `-contrast` | `#e20000` / `#ffe681` / `#e20000` | — | Error/danger |
| `--vbn-color-info` / `-bg` / `-contrast` | `#0552b5` / `#e7f1ff` / `#0552b5` | — | Info |
| `--vbn-color-scrim` | `rgba(0,0,0,.5)` | `rgba(0,0,0,.7)` | Modal/overlay backdrop |
| `--vbn-font-family` | `sans-serif` | — | Base font |
| `--vbn-font-size-base` / `-sm` / `-lg` | `.9rem` / `.8rem` / `1.1rem` | — | Font sizes |
| `--vbn-font-weight-normal` / `-bold` | `400` / `700` | — | Font weights |
| `--vbn-radius` / `-sm` / `-lg` | `5px` / `4px` / `8px` | — | Border radii |
| `--vbn-shadow-sm` / `-md` | — | — | Elevation |
| `--vbn-space-xs…lg` | `4–16px` | — | Spacing scale |

### Component tokens (default to core; override for fine control)

These cascade from the core tokens above unless you set them explicitly.

| Group | Tokens |
|---|---|
| Button | `--vbn-btn-{primary,secondary,danger,small}-{bg,fg}`, `--vbn-btn-{outline,ylw-outline}-{bg,fg,border}`, `--vbn-btn-grey-fg` |
| Input | `--vbn-input-{bg,text,border,border-hover,border-focus,placeholder,disabled-bg}` |
| Chip | `--vbn-chip-bg` |
| States | `--vbn-state-{hover-bg,selected-bg,selected-fg,on}` |
| Data table | `--vbn-table-{header-bg,header-fg,row-even-bg,row-odd-bg,row-hover-bg,footer-bg,border}` |
| Status (notifications) | `--vbn-status-{success,error,warning,info}-{bg,fg}` |

> **Note on SVG icons:** the `<verben-svg>` component applies `fill`/`stroke`
> as inline styles, so `var(--vbn-*)` tokens resolve correctly there too.
