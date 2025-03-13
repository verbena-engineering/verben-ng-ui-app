import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VisibleColumnRoutingModule } from './visible-column-routing.module';
import { VisibleColumnComponent } from './visible-column.component';
import { VisibleColumnModule } from 'verben-ng-ui/src/public-api';

@NgModule({
  declarations: [VisibleColumnComponent],
  imports: [CommonModule,VisibleColumnRoutingModule,VisibleColumnModule , FormsModule],
})
export class VisibleColModule {}
