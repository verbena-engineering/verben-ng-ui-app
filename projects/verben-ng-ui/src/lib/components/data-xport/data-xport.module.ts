import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { CardModule } from 'verben-ng-ui/src/lib/components/card';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';
import { DataXportService } from './data-xport.service';
import { DataXportComponent } from './data-xport.component';

@NgModule({
  declarations: [DataXportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgModule,
    CardModule,
    DropDownModule,
    TooltipModule,
    VerbenaInputModule,
  ],
  providers: [DataXportService],
  exports: [DataXportComponent],
})
export class DataXportModule {}
