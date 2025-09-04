import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerbenaSvgRoutingModule } from './verbena-svg-routing.module';
import { VerbenaSvgComponent } from './verbena-svg.component';
import {
  IconModule,
  SvgModule,
  VerbenaButtonModule,
  VerbenaIconModule,
} from 'verben-ng-ui';

@NgModule({
  declarations: [VerbenaSvgComponent],
  imports: [
    CommonModule,
    VerbenaSvgRoutingModule,
    SvgModule,
    FormsModule,
    IconModule,
    VerbenaButtonModule,
    VerbenaIconModule,
  ],
})
export class VerbenaSvgModule {}
