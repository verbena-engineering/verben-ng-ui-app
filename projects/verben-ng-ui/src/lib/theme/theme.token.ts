import { InjectionToken } from '@angular/core';
import { VerbenThemeConfig } from './theme.types';

/**
 * DI token carrying the consumer's theme configuration. Provided by
 * `VerbenUiModule.forRoot(config)`; consumed by `ThemeService`.
 */
export const VERBEN_THEME = new InjectionToken<VerbenThemeConfig>('VERBEN_THEME');
