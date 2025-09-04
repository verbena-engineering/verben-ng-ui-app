import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { CardModule } from 'verben-ng-ui/src/lib/components/card';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';
import { DataSortComponent } from './data-sort.component';

@NgModule({
  declarations: [DataSortComponent],
  imports: [CommonModule, SvgModule, CardModule, TooltipModule],
  exports: [DataSortComponent],
})
export class DataSortModule {}
