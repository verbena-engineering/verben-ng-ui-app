import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerbenMailRoutingModule } from './verben-mail-routing.module';
import { VerbenMailComponent } from './verben-mail.component';
import { VerbenaMailTemplateModule } from 'verben-ng-ui/src/public-api';


@NgModule({
  declarations: [VerbenMailComponent],
  imports: [CommonModule,VerbenMailRoutingModule,VerbenaMailTemplateModule , FormsModule],
})
export class VerbenMailModule {}
