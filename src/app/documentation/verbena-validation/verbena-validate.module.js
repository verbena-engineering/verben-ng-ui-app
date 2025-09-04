import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { VerbenaComponentComponent } from "./verbena-component.component";

import { verbenaValidationRoutingModule } from "./verbena-validation-routing.module";
import { VerbenaInputModule } from "verben-ng-ui";
import { TooltipComponent } from "verben-ng-ui";
import { VerbenaBadgeModule } from "verben-ng-ui";
import { VerbenaButtonModule } from "verben-ng-ui";
import { VerbenaSwitchModule } from "verben-ng-ui";
import { VerbenaTextareaModule } from "verben-ng-ui";
import { ValidationModule } from "verben-ng-ui";

@NgModule({
  declarations: [VerbenaComponentComponent],
  imports: [
    CommonModule,
    FormsModule,
    VerbenaBadgeModule,
    VerbenaButtonModule,
    VerbenaSwitchModule,
    VerbenaTextareaModule,
    verbenaValidationRoutingModule,
    VerbenaInputModule,
    TooltipComponent,
    ValidationModule,
  ],
})
export class VerbenaComponentModule {}
