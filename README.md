# VerbenUi

Do npm install (After the first pull)
Run the project( npm start)
Use ng build --watch to watching and listen to change in  library 


## Theming

The library is fully themeable from the consuming project via CSS custom
properties (`--vbn-*`), configured once and obeyed by every component. Load
`node_modules/verben-ng-ui/styles/theme.css`, then either override `--vbn-*`
tokens in your own CSS or call `VerbenUiModule.forRoot({...})`. Built-in light/dark
mode is available via `ThemeService.setMode()` or the `[appThemeSwitcher]`
directive. For consuming projects, start with
**[projects/verben-ng-ui/INTEGRATION.md](projects/verben-ng-ui/INTEGRATION.md)** (setup
playbook, incl. multi-layer peer-dependency projects); see
**[projects/verben-ng-ui/THEMING.md](projects/verben-ng-ui/THEMING.md)** for the full
design guide and token reference.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
