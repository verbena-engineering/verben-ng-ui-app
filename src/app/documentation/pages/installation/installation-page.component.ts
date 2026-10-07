import { Component } from '@angular/core';

@Component({
  selector: 'docs-installation-page',
  templateUrl: './installation-page.component.html',
})
export class InstallationPageComponent {
  install = `npm install verben-ng-ui @angular/cdk`;

  angularJson = `"styles": [
  "node_modules/@angular/cdk/overlay-prebuilt.css",
  "node_modules/verben-ng-ui/styles/theme.css",
  "src/styles.scss"
],
"assets": [
  {
    "glob": "**/*",
    "input": "./node_modules/verben-ng-ui/assets",
    "output": "./assets/lib-icons"
  }
]`;

  appModule = `import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { VerbenUiModule } from 'verben-ng-ui';

@NgModule({
  imports: [
    // Optional: brand the whole library once
    VerbenUiModule.forRoot({
      color: { primary: '#FFE681' },
      typography: { fontFamily: 'Montserrat, sans-serif' },
    }),
  ],
  // <verben-svg> loads icons over HTTP
  providers: [provideHttpClient()],
})
export class AppModule {}`;

  featureModule = `import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule, VerbenaButtonModule } from 'verben-ng-ui';

@NgModule({
  declarations: [InvoicesComponent],
  imports: [FormsModule, DatePickerModule, VerbenaButtonModule],
})
export class InvoicesModule {}`;

  usage = `<app-date-picker [(ngModel)]="dueDate"></app-date-picker>
<verbena-button text="Save" styleType="secondary" (click)="save()"></verbena-button>`;

  localDev = `# terminal 1 — rebuild the library into dist/ on every save
npx ng build verben-ng-ui --watch --configuration development

# terminal 2 — run this docs app on http://localhost:4200
npm start`;
}
