import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component'
import { VerbenaValidationComponent } from './verbena-validation/verbena-validation.component';
import { VerbenaInputModule } from "../../../projects/verben-ng-ui/src/lib/Verbena-input/verbena-input.module";
import { VerbenaSwitchModule } from "../../../projects/verben-ng-ui/src/lib/verbena-switch/verbena-switch.module";
import { VerbenaTextareaModule } from "../../../projects/verben-ng-ui/src/lib/verbena-textarea/verbena-textarea.module";
import { TooltipModule } from "../../../projects/verben-ng-ui/src/lib/components/tooltip/tooltip.module";
import { VerbenaBadgeModule } from "../../../projects/verben-ng-ui/src/lib/verbena-badge/verbena-badge.module";
import { VerbenaButtonModule } from "../../../projects/verben-ng-ui/src/lib/verbena-button/verbena-button.module";




@NgModule({
  declarations: [
    DocumentationComponent,

    VerbenaValidationComponent,


  ],
  imports: [
    CommonModule,
    DocumentationRoutingModule,
    VerbenaInputModule,
    VerbenaSwitchModule,
    VerbenaTextareaModule,
    TooltipModule,
    VerbenaBadgeModule,
    VerbenaButtonModule
]
})
export class DocumentationModule { }
