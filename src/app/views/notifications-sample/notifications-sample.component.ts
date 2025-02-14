// parent.component.ts
import { Component } from '@angular/core';
import { NotificationService } from '../../../../projects/verben-ng-ui/src/lib/services/notification.services';

@Component({
  selector: 'app-notifications-sample',
  templateUrl: './notifications-sample.component.html',
  styleUrls: ['./notifications-sample.component.scss'],
  providers:[NotificationService]
})

export class NotificationsSampleComponent {
  buttons = [
    { text: 'Yes', bgColor: 'white', primarycolor : '#2DB76F',fontSize:'14px'  },
    { text: 'no', bgColor: 'white', primarycolor : '#2DB76F',fontSize:'14px'  },
    { text: 'about', bgColor: 'white', primarycolor : '#2DB76F',fontSize:'14px'  },
]
  constructor(private notificationService: NotificationService) {}

  showSuccessNotification() {
    this.notificationService.success("Operation successful!", { timeout: 2000});
  }

  showErrorNotification() {
    this.notificationService.error("Something went wrong!", { timeout: 3000 });
  }

  showWarningNotification() {
    this.notificationService.warning("This is a warning.", { timeout: 3000 });
  }

  showInfoNotification() {
    this.notificationService.info("Here’s some information.", { timeout: 3000 });
  }

  handleButtonClick(event:any){ 
    console.log('events is here',event)
  }
}
