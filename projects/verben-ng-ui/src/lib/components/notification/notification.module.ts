import { NgModule } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common'
import { SvgModule } from '../svg/svg.module';
import { VerbenaButtonModule } from 'verben-ng-ui/src/public-api';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule,SvgModule,VerbenaButtonModule],
  exports: [NotificationComponent]
})
export class NotificationModule {}



