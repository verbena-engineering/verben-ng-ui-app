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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
