import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonBadgeComponent } from './button-badge.component';

import { buttonBadgeRoutingModule } from './button-badge-routing.module';
import { VerbenaInputModule } from 'verben-ng-ui';
import { TooltipComponent } from 'verben-ng-ui';
import { VerbenaBadgeModule } from 'verben-ng-ui';
import { VerbenaButtonModule } from 'verben-ng-ui';
import { VerbenaSwitchModule } from 'verben-ng-ui';
import { VerbenaTextareaModule } from 'verben-ng-ui';
import { ValidationModule } from 'verben-ng-ui';
import { NumberRangeModule } from 'verben-ng-ui';
import { SvgModule } from 'verben-ng-ui';
import { VerbenaTabModule } from 'verben-ng-ui';

@NgModule({
  declarations: [ButtonBadgeComponent],
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
    SvgModule,
    VerbenaTabModule,
  ],
})
export class ButtonBadgeModule {}
