import { NgModule } from '@angular/core';
import { TableFilterSampleComponent } from './table-filter-sample.component';
import { CommonModule } from '@angular/common';
import { TableFilterModule } from 'verben-ng-ui/src/public-api';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: TableFilterSampleComponent,
  },
];

@NgModule({
  declarations:[TableFilterSampleComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,
    TableFilterModule],
})
export class TableFilterSampleModule {}
