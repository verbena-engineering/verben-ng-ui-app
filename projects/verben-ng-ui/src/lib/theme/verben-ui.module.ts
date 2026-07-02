import { ModuleWithProviders, NgModule } from '@angular/core';
import { ThemeService } from './theme.service';
import { VerbenThemeConfig } from './theme.types';
import { VERBEN_THEME } from './theme.token';

/**
 * Root configuration module for verben-ng-ui theming.
 *
 * Import once in your application's root module:
 *
 * ```ts
 * imports: [
 *   VerbenUiModule.forRoot({
 *     color: { primary: '#D4A007', error: '#E20000' },
 *     typography: { fontFamily: 'Montserrat' },
 *     radius: '6px',
 *   }),
 * ]
 * ```
 *
 * The config is applied to the document root on bootstrap (eagerly instantiating
 * `ThemeService`). Consumers who prefer plain CSS can skip `forRoot` entirely and
 * just override `--vbn-*` tokens in their own `:root`.
 */
@NgModule()
export class VerbenUiModule {
  // Injecting ThemeService here instantiates it eagerly so the initial
  // VERBEN_THEME config is applied at bootstrap.
  constructor(_theme: ThemeService) {}

  static forRoot(
    config: VerbenThemeConfig = {}
  ): ModuleWithProviders<VerbenUiModule> {
    return {
      ngModule: VerbenUiModule,
      providers: [{ provide: VERBEN_THEME, useValue: config }],
    };
  }
}
