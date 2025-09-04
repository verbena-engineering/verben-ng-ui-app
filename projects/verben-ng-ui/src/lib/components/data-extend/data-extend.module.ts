import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExtendComponent } from './data-extend.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { CardModule } from 'verben-ng-ui/src/lib/components/card';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';
import { VerbenaSwitchModule } from 'verben-ng-ui/src/lib/verbena-switch';
import { ChipModule } from 'verben-ng-ui/src/lib/components/chip';

@NgModule({
  declarations: [DataExtendComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgModule,
    CardModule,
    DropDownModule,
    TooltipModule,
    VerbenaInputModule,
    VerbenaSwitchModule,
    ChipModule,
  ],
  exports: [DataExtendComponent],
})
export class DataExtendModule {}
