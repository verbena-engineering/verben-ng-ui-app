import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SortTableRoutingModule } from './sort-table-routing.module';
import { SortTableComponent } from './sort-table.component';
import { SortTableModule } from 'verben-ng-ui/src/public-api'; 

@NgModule({
  declarations: [SortTableComponent],
  imports: [CommonModule, SortTableRoutingModule, SortTableModule, FormsModule],
  exports:[SortTableComponent]
})
export class SortModule {}
