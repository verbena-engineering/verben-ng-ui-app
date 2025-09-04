import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { CardDataViewModule } from 'verben-ng-ui/src/lib/components/card-data-view';

import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { DataTableModule } from 'verben-ng-ui/src/lib/components/data-table';
import { OutSideClickDirective } from './data-view-click-outside.directive';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';
import { VerbenaButtonModule } from 'verben-ng-ui/src/lib/verbena-button';
import { VisibleColumnModule } from 'verben-ng-ui/src/lib/components/visible-column';
import { VerbenPopUpModule } from 'verben-ng-ui/src/lib/components/pop-up';
@NgModule({
  declarations: [DataViewComponent],
  imports: [
    CommonModule,
    CardDataViewModule,
    DataTableModule,
    SvgModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    OutSideClickDirective,
    VisibleColumnModule,
    VerbenPopUpModule,
  ],
  exports: [DataViewComponent],
})
export class DataViewModule {}
