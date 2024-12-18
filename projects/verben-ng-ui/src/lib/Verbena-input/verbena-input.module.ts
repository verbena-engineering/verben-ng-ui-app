import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../components/tooltip/tooltip.module';
import { VerbenaInputComponent } from './verbena-input.component';
import { SvgModule } from "../components/svg/svg.module";

@NgModule({
  declarations: [VerbenaInputComponent],
  imports: [CommonModule, FormsModule, TooltipModule, SvgModule],
  exports: [VerbenaInputComponent],
})
export class VerbenaInputModule {}
