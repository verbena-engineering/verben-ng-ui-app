import { NgModule } from '@angular/core';
import { TableFilterSampleComponent } from './table-filter-sample.component';
import { CommonModule } from '@angular/common';
import { TableFilterModule } from 'verben-ng-ui/src/public-api';

@NgModule({
  declarations:[TableFilterSampleComponent],
  imports: [CommonModule,TableFilterModule],
  exports: [TableFilterSampleComponent]
})
export class TableFilterSampleModule {}
