import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenDialogueComponent } from './verben-dialogue.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { VerbenaButtonModule } from 'verben-ng-ui/src/lib/verbena-button';
@NgModule({
  declarations: [VerbenDialogueComponent],
  imports: [CommonModule, SvgModule, VerbenaButtonModule],
  exports: [VerbenDialogueComponent],
})
export class VerbenDialogueModule {}
