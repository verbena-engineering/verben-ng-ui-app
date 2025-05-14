import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerbenMailTemplate } from './verben-mail.component';
import { ChipModule } from '../chip/chip.module';
import { SvgModule } from '../svg/svg.module';
@NgModule({
  declarations: [VerbenMailTemplate],
  imports: [
    FormsModule,
    CommonModule,
    ChipModule,
    ReactiveFormsModule,
    SvgModule,
  ],
  exports: [VerbenMailTemplate],
})
export class VerbenaMailTemplateModule {}
