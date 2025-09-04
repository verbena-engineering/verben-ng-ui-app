import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataColumnsComponent } from './data-columns.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { CardModule } from 'verben-ng-ui/src/lib/components/card';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';

@NgModule({
  declarations: [DataColumnsComponent],
  imports: [CommonModule, SvgModule, CardModule, DropDownModule, TooltipModule],
  exports: [DataColumnsComponent],
})
export class DataColumnsModule {}
