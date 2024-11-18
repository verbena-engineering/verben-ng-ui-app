import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CardDataViewModule,
  DataTableModule,
  DataViewModule,
  SortTableModule,
  SvgModule,
  TableFilterModule,
  VerbenaButtonModule,
  VisibleColumnModule,
} from 'verben-ng-ui';
import { FormsModule } from '@angular/forms';

const shared = [
  CommonModule,
  DataViewModule,
  FormsModule,
  DataTableModule,
  CardDataViewModule,
  SvgModule,
  SortTableModule,
  VisibleColumnModule,
  TableFilterModule,
  VerbenaButtonModule,
];

@NgModule({
  declarations: [],
  imports: [...shared],
  exports: [...shared],
})
export class ExamplesSharedModule {}
