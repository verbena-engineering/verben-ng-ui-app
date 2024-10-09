import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications-sample',
  templateUrl: './notifications-sample.component.html',
  styleUrl: './notifications-sample.component.scss',
})

export class NotificationsSampleComponent {
  handleButtonClick(button: any) {
    console.log('Button clicked', button);
  }
}
