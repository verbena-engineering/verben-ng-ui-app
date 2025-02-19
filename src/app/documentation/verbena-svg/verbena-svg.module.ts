import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerbenaSvgRoutingModule } from './verbena-svg-routing.module';
import { VerbenaSvgComponent } from './verbena-svg.component';
import { SvgModule } from 'verben-ng-ui/src/public-api';
import { IconModule } from 'verben-ng-ui/src/public-api';
import { VerbenaButtonModule } from 'verben-ng-ui/src/public-api';


@NgModule({
  declarations: [VerbenaSvgComponent],
  imports: [CommonModule,VerbenaSvgRoutingModule,SvgModule , FormsModule, IconModule, VerbenaButtonModule],
})
export class VerbenaSvgModule {}
