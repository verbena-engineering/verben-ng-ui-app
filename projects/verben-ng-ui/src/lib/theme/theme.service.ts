import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { ThemeMode, VerbenThemeConfig } from './theme.types';
import { VERBEN_THEME } from './theme.token';

/**
 * Maps lean `VerbenThemeConfig` fields to their `--vbn-*` CSS custom property
 * names. Component tokens are reached via the raw `tokens` escape hatch.
 */
const TOKEN_MAP: Record<string, string> = {
  'color.primary': '--vbn-color-primary',
  'color.onPrimary': '--vbn-color-on-primary',
  'color.secondary': '--vbn-color-secondary',
  'color.onSecondary': '--vbn-color-on-secondary',
  'color.surface': '--vbn-color-surface',
  'color.surfaceAlt': '--vbn-color-surface-alt',
  'color.background': '--vbn-color-background',
  'color.text': '--vbn-color-text',
  'color.textMuted': '--vbn-color-text-muted',
  'color.border': '--vbn-color-border',
  'color.borderFocus': '--vbn-color-border-focus',
  'color.success': '--vbn-color-success',
  'color.warning': '--vbn-color-warning',
  'color.error': '--vbn-color-error',
  'color.info': '--vbn-color-info',
  'color.scrim': '--vbn-color-scrim',
  'typography.fontFamily': '--vbn-font-family',
  'typography.fontSize': '--vbn-font-size-base',
  'radius': '--vbn-radius',
  'shadow.sm': '--vbn-shadow-sm',
  'shadow.md': '--vbn-shadow-md',
};

const MODE_ATTR = 'data-vbn-theme';

/**
 * Runtime theming: writes `--vbn-*` tokens onto the document root and toggles
 * light/dark mode. CSS custom properties cascade to every component, so a single
 * write here re-themes the whole library at runtime.
 *
 * Provided via `VerbenUiModule.forRoot(config)`, which applies the initial
 * config on bootstrap. Can also be injected directly for dynamic changes.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root: HTMLElement | null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(VERBEN_THEME) initial: VerbenThemeConfig | null
  ) {
    this.root = this.document?.documentElement ?? null;
    if (initial) {
      this.applyTheme(initial);
    }
  }

  /** Apply a (partial) theme config. Only provided values are written. */
  applyTheme(config: VerbenThemeConfig): void {
    if (!this.root || !config) {
      return;
    }

    for (const [path, cssVar] of Object.entries(TOKEN_MAP)) {
      const value = this.resolvePath(config, path);
      if (value != null && value !== '') {
        this.root.style.setProperty(cssVar, value);
      }
    }

    if (config.tokens) {
      for (const [name, value] of Object.entries(config.tokens)) {
        this.setToken(name, value);
      }
    }

    if (config.mode) {
      this.setMode(config.mode);
    }
  }

  /** Set a single token. Accepts names with or without the leading `--`. */
  setToken(name: string, value: string): void {
    if (!this.root) {
      return;
    }
    const cssVar = name.startsWith('--') ? name : `--${name}`;
    this.root.style.setProperty(cssVar, value);
  }

  /** Switch between light and dark color modes. */
  setMode(mode: ThemeMode): void {
    if (!this.root) {
      return;
    }
    if (mode === 'dark') {
      this.root.setAttribute(MODE_ATTR, 'dark');
    } else {
      this.root.removeAttribute(MODE_ATTR);
    }
  }

  /** The currently active color mode. */
  getMode(): ThemeMode {
    return this.root?.getAttribute(MODE_ATTR) === 'dark' ? 'dark' : 'light';
  }

  /** Toggle between light and dark, returning the new mode. */
  toggleMode(): ThemeMode {
    const next: ThemeMode = this.getMode() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
    return next;
  }

  private resolvePath(config: VerbenThemeConfig, path: string): string | undefined {
    return path
      .split('.')
      .reduce<any>((acc, key) => (acc == null ? acc : acc[key]), config);
  }
}
