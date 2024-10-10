import { Component } from '@angular/core';
import { NotificationComponent } from 'verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications-sample',
  templateUrl: './notifications-sample.component.html',
  styleUrl: './notifications-sample.component.scss',
  standalone:true,
  imports:[NotificationComponent,CommonModule]
})

export class NotificationsSampleComponent {
  handleButtonClick(button: any) {
    console.log('Button clicked', button);
  }
}
