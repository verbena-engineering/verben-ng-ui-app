import { NgModule } from '@angular/core';
import { NotificationComponent } from '../notification';
import { CommonModule } from '@angular/common';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { VerbenaButtonModule } from 'verben-ng-ui/src/lib/verbena-button';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, SvgModule, VerbenaButtonModule],
  exports: [NotificationComponent],
})
export class NotificationModule {}
