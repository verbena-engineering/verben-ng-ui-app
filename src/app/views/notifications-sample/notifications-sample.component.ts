import { NotificationModule } from './../../../../projects/verben-ng-ui/src/lib/components/notification/notification.module';
import { Component } from '@angular/core';
;
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications-sample',
  templateUrl: './notifications-sample.component.html',
  styleUrl: './notifications-sample.component.scss',
  standalone:true,
  imports:[NotificationModule,CommonModule]
})

export class NotificationsSampleComponent {
  handleButtonClick(button: any) {
    console.log('Button clicked', button);
  }
}
