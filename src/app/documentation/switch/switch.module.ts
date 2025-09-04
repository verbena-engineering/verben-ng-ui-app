import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SwitchComponent } from './switch.component';

import { buttonBadgeRoutingModule } from './switch-routing.module';
import {
  NumberRangeModule,
  ValidationModule,
  VerbenaBadgeModule,
  VerbenaButtonModule,
  VerbenaInputModule,
  VerbenaSwitchModule,
  VerbenaTextareaModule,
} from 'verben-ng-ui';

@NgModule({
  declarations: [SwitchComponent],
  imports: [
    CommonModule,
    FormsModule,
    VerbenaBadgeModule,
    VerbenaButtonModule,
    VerbenaSwitchModule,
    VerbenaTextareaModule,
    buttonBadgeRoutingModule,
    VerbenaInputModule,
    ValidationModule,
    NumberRangeModule,
  ],
})
export class SwitchModule {}
