# VerbenNgUi

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Theming

All components are themed through CSS custom properties (`--vbn-*`), configurable
once from the consuming app and obeyed everywhere — with reasonable defaults and
built-in light/dark mode.

1. Load the token stylesheet: add `node_modules/verben-ng-ui/styles/theme.css` to
   your `angular.json` `styles` (or `@import` it in your global stylesheet).
2. Configure with plain CSS (override `--vbn-*` in `:root`) **or**
   `VerbenUiModule.forRoot({ color: { primary: '#d4a007' } })`.
3. Dark mode: `ThemeService.setMode('dark')` or the `[appThemeSwitcher]` directive.

Guides:
- **[INTEGRATION.md](./INTEGRATION.md)** — step-by-step consumer setup (leaf apps,
  intermediate libraries, and multi-layer / peer-dependency projects). Agent-friendly.
- **[THEMING.md](./THEMING.md)** — full design guide and `--vbn-*` token reference.

## Code scaffolding

Run `ng generate component component-name --project verben-ng-ui` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project verben-ng-ui`.
> Note: Don't forget to add `--project verben-ng-ui` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build verben-ng-ui` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build verben-ng-ui`, go to the dist folder `cd dist/verben-ng-ui` and run `npm publish`.

## Running unit tests

Run `ng test verben-ng-ui` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
