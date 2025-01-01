import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationComponent } from './documentation.component';

const routes: Routes = [
  { path: '', component: DocumentationComponent },
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
      import('./verbena-input-textarea/verbena-input-textarea.module').then((m) => m.VerbenaInputTextareaModule),
  },
  {
    path: 'switch',
    loadChildren: () =>
      import('./switch/switch.module').then((m) => m.SwitchModule),
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
        (m) => m.DropdownSampleModule
      ),
  },
  {
    path: 'chip',
    loadChildren: () =>
      import('./chip/chip.module').then((m) => m.ChipExampleModule),

  },
  {
    path: 'icons',
    loadChildren: () =>
      import('../views/icons-sample/icons-sample.module').then(
        (m) => m.IconSampleModule
      ),
  },
  {
    path: 'images',
    loadChildren: () =>
      import('../views/image-sample/image-sample.module').then(
        (m) => m.ImageSampleModule
      ),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('../views/notifications-sample/notifications-sample.module').then(
        (m) => m.NotificationsSampleModule
      ),
  },
  {
    path: 'table-filter',
    loadChildren: () =>
      import('../views/table-filter-sample/table-filter-sample.module').then(
        (m) => m.TableFilterSampleModule
      ),
  },
  {
    path: 'tooltip',
    loadChildren: () =>
      import('../views/tooltip-sample/tooltip-sample.module').then(
        (m) => m.TooltipSampleModule
      ),
  },
    {
    path: 'card-data-view',
    loadChildren: () =>
      import('../views/card-data-view/cdv.module').then((m)=>m.CDVModule),
  },
  {
      path: 'card-view',
      loadChildren: () =>
        import('../views/card-view/card-view.module').then((m)=>m.CardViewModule),
    },
    {
      path: 'date-picker',
      loadChildren: () =>
        import('./date-picker/date-picker.module').then((m)=>m.AppDatePickerSample),
    },
    {
      path: 'dialogue',
      loadChildren: () =>
        import('./dialogue-sample/dialogue-sample.module').then((m)=>m.DialogueSampleModule),
    },
    {
      path: 'dropdown-sample',
      loadChildren: () => import('./sample-for-dropdowns/sample-for-dropdowns.module').then((m) => m.SampleForDropdownsModule)
    },
    { 
      path:'test-run-pops',
      loadChildren:() => import('../views/test-run-pops/test-run-pops.module').then(m => m.TestRunPopsModule)
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
