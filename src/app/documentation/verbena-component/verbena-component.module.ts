import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerbenaComponentComponent } from './verbena-component.component';

import { verbenaComponentRoutingModule } from './verbena-component-routing.module';
import {
  NumberRangeModule,
  ValidationModule,
  VerbenaBadgeModule,
  VerbenaButtonModule,
  VerbenaInputModule,
  VerbenaSwitchModule,
  VerbenaTextareaModule,
} from 'verben-ng-ui';
import { TooltipModule } from 'verben-ng-ui';

@NgModule({
  declarations: [VerbenaComponentComponent],
  imports: [
    CommonModule,
    FormsModule,
    VerbenaBadgeModule,
    VerbenaButtonModule,
    VerbenaSwitchModule,
    VerbenaTextareaModule,
    verbenaComponentRoutingModule,
    VerbenaInputModule,
    TooltipModule,
    ValidationModule,
    NumberRangeModule,
  ],
})
export class VerbenaComponentModule {}
