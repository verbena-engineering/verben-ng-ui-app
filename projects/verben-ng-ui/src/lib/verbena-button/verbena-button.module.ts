import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaButtonComponent } from './verbena-button.component';
import { SvgModule } from '../../public-api';

@NgModule({
  declarations: [VerbenaButtonComponent],
  imports: [CommonModule, SvgModule],
  exports: [VerbenaButtonComponent]
})
export class VerbenaButtonModule {}
