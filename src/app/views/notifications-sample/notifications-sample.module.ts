import { NgModule } from '@angular/core';
import { NotificationsSampleComponent } from './notifications-sample.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations:[NotificationsSampleComponent],
  imports: [CommonModule],
  exports: [NotificationsSampleComponent]
})
export class NotificationsSampleModule {}
