import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterComponent } from './table-filter.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';
import { ValidationModule } from 'verben-ng-ui/src/lib/validate';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';

@NgModule({
  declarations: [TableFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropDownModule,
    VerbenaInputModule,
    ValidationModule,
    TooltipModule,
    SvgModule,
  ],
  exports: [TableFilterComponent],
})
export class TableFilterModule {}
