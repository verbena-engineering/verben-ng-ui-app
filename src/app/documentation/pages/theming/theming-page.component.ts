import { Component, OnDestroy, OnInit } from '@angular/core';

interface Swatch {
  token: string;
  value: string;
}

const COLOR_TOKENS = [
  '--vbn-color-primary',
  '--vbn-color-on-primary',
  '--vbn-color-secondary',
  '--vbn-color-surface',
  '--vbn-color-surface-alt',
  '--vbn-color-background',
  '--vbn-color-text',
  '--vbn-color-text-muted',
  '--vbn-color-border',
  '--vbn-color-border-focus',
  '--vbn-color-success',
  '--vbn-color-warning',
  '--vbn-color-error',
  '--vbn-color-info',
];

@Component({
  selector: 'docs-theming-page',
  templateUrl: './theming-page.component.html',
})
export class ThemingPageComponent implements OnInit, OnDestroy {
  swatches: Swatch[] = [];
  private observer?: MutationObserver;

  forRoot = `VerbenUiModule.forRoot({
  color: {
    primary: '#D4A007',
    error: '#E20000',
  },
  typography: { fontFamily: 'Montserrat, sans-serif' },
  radius: '6px',
  // Escape hatch for component tokens without a short alias
  tokens: { '--vbn-table-header-bg': '#EFF2FB' },
})`;

  css = `/* src/styles.scss — after theme.css */
:root {
  --vbn-color-primary: #0ea5e9;
  --vbn-radius: 8px;
}

/* Dark mode overrides */
[data-vbn-theme='dark'] {
  --vbn-color-primary: #38bdf8;
}`;

  darkMode = `import { ThemeService } from 'verben-ng-ui';

export class HeaderComponent {
  constructor(private theme: ThemeService) {}

  toggle() {
    this.theme.toggleMode(); // or setMode('dark' | 'light')
  }
}`;

  directive = `<!-- Click toggles dark mode and remembers it in localStorage -->
<button appThemeSwitcher>Toggle theme</button>`;

  runtime = `// Repaint everything live, e.g. per-tenant branding
this.theme.applyTheme({ color: { primary: '#0ea5e9' } });
this.theme.setToken('--vbn-table-header-bg', '#1f2937');`;

  ngOnInit(): void {
    this.readSwatches();
    // Re-read the values when dark mode is toggled from the header
    this.observer = new MutationObserver(() => this.readSwatches());
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-vbn-theme', 'style'],
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private readSwatches(): void {
    const styles = getComputedStyle(document.documentElement);
    this.swatches = COLOR_TOKENS.map((token) => ({
      token,
      value: styles.getPropertyValue(token).trim(),
    }));
  }
}
