import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerbenMailTemplate } from './verben-mail.component';
import { ChipModule } from 'verben-ng-ui/src/lib/components/chip';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
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
