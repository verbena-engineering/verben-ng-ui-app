import { NgModule } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common'
import { SvgModule } from '../svg/svg.module';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule,SvgModule],
  exports: [NotificationComponent]
})
export class NotificationModule {}



