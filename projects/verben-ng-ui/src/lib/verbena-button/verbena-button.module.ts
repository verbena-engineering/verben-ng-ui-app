import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaButtonComponent } from './verbena-button.component';
import { SvgModule } from '../components/svg/svg.module';
import { VerbenaIconModule } from '../components/verbena-icon/verbena-icon.module';

@NgModule({
  declarations: [VerbenaButtonComponent],
  imports: [CommonModule, SvgModule, VerbenaIconModule],
  exports: [VerbenaButtonComponent]
})
export class VerbenaButtonModule {}
