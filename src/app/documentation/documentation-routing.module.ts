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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
