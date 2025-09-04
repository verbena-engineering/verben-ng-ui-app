import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerbenaInputTextareaComponent } from './verbena-input-textarea.component';

import { buttonBadgeRoutingModule } from './verbena-input-textarea-routing.module';
import {
  NumberInputModule,
  NumberRangeModule,
  ValidationModule,
  VerbenaBadgeModule,
  VerbenaButtonModule,
  VerbenaInputModule,
  VerbenaSwitchModule,
  VerbenaTextareaModule,
} from 'verben-ng-ui';

@NgModule({
  declarations: [VerbenaInputTextareaComponent],
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
    NumberInputModule,
  ],
})
export class VerbenaInputTextareaModule {}
