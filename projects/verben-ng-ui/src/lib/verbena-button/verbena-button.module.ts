import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaButtonComponent } from './verbena-button.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { VerbenaIconModule } from 'verben-ng-ui/src/lib/components/verbena-icon';

@NgModule({
  declarations: [VerbenaButtonComponent],
  imports: [CommonModule, SvgModule, VerbenaIconModule],
  exports: [VerbenaButtonComponent],
})
export class VerbenaButtonModule {}
