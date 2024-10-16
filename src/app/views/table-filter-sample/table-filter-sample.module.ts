import { NgModule } from '@angular/core';
import { TableFilterSampleComponent } from './table-filter-sample.component';
import { CommonModule } from '@angular/common';
import { TableFilterModule } from '../../../../projects/verben-ng-ui/src/lib/components/table-filter/table-filter.module';
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
