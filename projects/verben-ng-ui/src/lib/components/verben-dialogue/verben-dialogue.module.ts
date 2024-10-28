import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenDialogueComponent } from './verben-dialogue.component';
import { SvgModule } from '../svg/svg.module';
import {VerbenaButtonModule} from "../../verbena-button/verbena-button.module"
@NgModule({
  declarations:[VerbenDialogueComponent],
  imports: [CommonModule,SvgModule,VerbenaButtonModule],
  exports: [VerbenDialogueComponent]
})
export class VerbenDialogueModule {}
