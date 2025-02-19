import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ButtonBadgeComponent } from './button-badge.component';


import { buttonBadgeRoutingModule } from './button-badge-routing.module'
import { VerbenaInputModule } from "../../../../projects/verben-ng-ui/src/lib/Verbena-input/verbena-input.module";
import { TooltipComponent } from "../../../../projects/verben-ng-ui/src/lib/components/tooltip/tooltip.component";
import { VerbenaBadgeModule } from "../../../../projects/verben-ng-ui/src/lib/verbena-badge/verbena-badge.module";
import { VerbenaButtonModule } from '../../../../projects/verben-ng-ui/src/lib/verbena-button/verbena-button.module';
import { VerbenaSwitchModule } from '../../../../projects/verben-ng-ui/src/lib/verbena-switch/verbena-switch.module';
import { VerbenaTextareaModule } from '../../../../projects/verben-ng-ui/src/lib/verbena-textarea/verbena-textarea.module';
import { ValidationModule } from '../../../../projects/verben-ng-ui/src/lib/validate/validate.module';
import { NumberRangeModule } from '../../../../projects/verben-ng-ui/src/lib/number-range/number-range.module';
import { SvgModule } from 'verben-ng-ui/src/public-api';


@NgModule({
  declarations: [ButtonBadgeComponent],
  imports: [CommonModule, FormsModule, VerbenaBadgeModule, VerbenaButtonModule, VerbenaSwitchModule, VerbenaTextareaModule, buttonBadgeRoutingModule, VerbenaInputModule, ValidationModule, NumberRangeModule, SvgModule],
})
export class ButtonBadgeModule {}
