import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationComponent } from './documentation.component';
import { DocsHomeComponent } from './pages/home/docs-home.component';
import { InstallationPageComponent } from './pages/installation/installation-page.component';
import { ThemingPageComponent } from './pages/theming/theming-page.component';
import { BadgePageComponent } from './pages/components/badge-page.component';
import { ButtonPageComponent } from './pages/components/button-page.component';
import { CardPageComponent } from './pages/components/card-page.component';
import { ChipPageComponent } from './pages/components/chip-page.component';
import { DatePickerPageComponent } from './pages/components/date-picker-page.component';
import { DialogPageComponent } from './pages/components/dialog-page.component';
import { DropdownPageComponent } from './pages/components/dropdown-page.component';
import { IconsPageComponent } from './pages/components/icons-page.component';
import { InputPageComponent } from './pages/components/input-page.component';
import { NotificationPageComponent } from './pages/components/notification-page.component';
import { NumberInputPageComponent } from './pages/components/number-input-page.component';
import { SwitchPageComponent } from './pages/components/switch-page.component';
import { TabsPageComponent } from './pages/components/tabs-page.component';
import { TextareaPageComponent } from './pages/components/textarea-page.component';
import { TimePickerPageComponent } from './pages/components/time-picker-page.component';
import { TooltipPageComponent } from './pages/components/tooltip-page.component';
import { VendorInvoicesComponent } from './pages/playground/vendor-invoices/vendor-invoices.component';

const title = (page: string) => `${page} · verben-ng-ui`;

/**
 * Every docs route is a CHILD of DocumentationComponent (the shell with the
 * header + sidebar). Before, the pages were siblings, so they rendered
 * without any navigation.
 */
const routes: Routes = [
  {
    path: '',
    component: DocumentationComponent,
    children: [
      // ---- Docs pages (new) ----
      { path: '', component: DocsHomeComponent, title: 'verben-ng-ui' },
      { path: 'installation', component: InstallationPageComponent, title: title('Installation') },
      { path: 'theming', component: ThemingPageComponent, title: title('Theming') },
      { path: 'components/badge', component: BadgePageComponent, title: title('Badge') },
      { path: 'components/button', component: ButtonPageComponent, title: title('Button') },
      { path: 'components/card', component: CardPageComponent, title: title('Card') },
      { path: 'components/chip', component: ChipPageComponent, title: title('Chip') },
      { path: 'components/date-picker', component: DatePickerPageComponent, title: title('Date Picker') },
      // The classic picker was folded into <app-date-picker>; old links still work
      { path: 'components/date-picker-classic', redirectTo: 'components/date-picker' },
      { path: 'components/dialog', component: DialogPageComponent, title: title('Dialog') },
      { path: 'components/dropdown', component: DropdownPageComponent, title: title('Dropdown') },
      { path: 'components/icons', component: IconsPageComponent, title: title('Icons') },
      { path: 'components/input', component: InputPageComponent, title: title('Input') },
      { path: 'components/notification', component: NotificationPageComponent, title: title('Notification') },
      { path: 'components/number-input', component: NumberInputPageComponent, title: title('Number Input') },
      { path: 'components/switch', component: SwitchPageComponent, title: title('Switch') },
      { path: 'components/tabs', component: TabsPageComponent, title: title('Tabs') },
      { path: 'components/textarea', component: TextareaPageComponent, title: title('Textarea') },
      { path: 'components/time-picker', component: TimePickerPageComponent, title: title('Time Picker') },
      { path: 'components/tooltip', component: TooltipPageComponent, title: title('Tooltip') },

      // ---- Unstable: new components in team review ----
      // The composable card was folded back into <verben-card>; old links still work
      { path: 'unstable/card', redirectTo: 'components/card' },


      // ---- Playground: the original test pages, URLs unchanged ----
      // ⚠️ Unstable: a full screen built with the composable card
      { path: 'vendor-invoices', component: VendorInvoicesComponent, title: title('Vendor Invoices') },
      {
        path: 'data-table',
        loadChildren: () =>
          import('./data-table/data-table.module').then((m) => m.DataTableModule),
      },
      {
        path: 'button-badge',
        loadChildren: () =>
          import('./button-badge/button-badge.module').then((m) => m.ButtonBadgeModule),
      },
      {
        path: 'input-textarea',
        loadChildren: () =>
          import('./verbena-input-textarea/verbena-input-textarea.module').then(
            (m) => m.VerbenaInputTextareaModule,
          ),
      },
      {
        path: 'switch',
        loadChildren: () => import('./switch/switch.module').then((m) => m.SwitchModule),
      },
      {
        path: 'sort-table',
        loadChildren: () =>
          import('./sort-table/sort-table.module').then((m) => m.SortModule),
      },
      {
        path: 'visible-column',
        loadChildren: () =>
          import('./visible-column/visible-column.module').then((m) => m.VisibleColModule),
      },
      {
        path: 'verben-mail',
        loadChildren: () =>
          import('./verben-mail/verben-mail.module').then((m) => m.VerbenMailModule),
      },
      {
        path: 'data-view',
        loadChildren: () =>
          import('./data-view/data.view.module').then((m) => m.AppDataViewModule),
      },
      {
        path: 'dropdown',
        loadChildren: () =>
          import('./dropdown-sample/dropdown-sample.module').then(
            (m) => m.DropdownSampleModule,
          ),
      },
      {
        path: 'chip',
        loadChildren: () => import('./chip/chip.module').then((m) => m.ChipExampleModule),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('../views/icons-sample/icons-sample.module').then((m) => m.IconSampleModule),
      },
      {
        path: 'images',
        loadChildren: () =>
          import('../views/image-sample/image-sample.module').then((m) => m.ImageSampleModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('../views/notifications-sample/notifications-sample.module').then(
            (m) => m.NotificationsSampleModule,
          ),
      },
      {
        path: 'table-filter',
        loadChildren: () =>
          import('../views/table-filter-sample/table-filter-sample.module').then(
            (m) => m.TableFilterSampleModule,
          ),
      },
      {
        path: 'tooltip',
        loadChildren: () =>
          import('../views/tooltip-sample/tooltip-sample.module').then(
            (m) => m.TooltipSampleModule,
          ),
      },
      {
        path: 'card-data-view',
        loadChildren: () =>
          import('../views/card-data-view/cdv.module').then((m) => m.CDVModule),
      },
      {
        path: 'card-view',
        loadChildren: () =>
          import('../views/card-view/card-view.module').then((m) => m.CardViewModule),
      },
      {
        path: 'date-picker',
        loadChildren: () =>
          import('./date-picker/date-picker.module').then((m) => m.AppDatePickerSample),
      },
      {
        path: 'dialogue',
        loadChildren: () =>
          import('./dialogue-sample/dialogue-sample.module').then(
            (m) => m.DialogueSampleModule,
          ),
      },
      {
        path: 'dropdown-sample',
        loadChildren: () =>
          import('./sample-for-dropdowns/sample-for-dropdowns.module').then(
            (m) => m.SampleForDropdownsModule,
          ),
      },
      {
        path: 'time-picker',
        loadChildren: () =>
          import('./time-picker/time-picker.module').then((m) => m.TimePickerModule),
      },
      {
        path: 'svg',
        loadChildren: () =>
          import('./verbena-svg/verbena-svg.module').then((m) => m.VerbenaSvgModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
