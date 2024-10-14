import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications-sample',
  templateUrl: './notifications-sample.component.html',
  styleUrls: ['./notifications-sample.component.scss'],
})

export class NotificationsSampleComponent {

   showNotification : boolean = false
   showNotification1 : boolean = false
   showNotification2 : boolean = false

  showNotificationComp1(){ 
    this.showNotification = true;
  }
  showNotificationComp2(){ 
    this.showNotification1 = true;
  }
  showNotificationComp3(){ 
    this.showNotification2 = true;
  }
  
  closeNotificationComp1(){ 
    this.showNotification = false;
  }
  closeNotificationComp2(){ 
    this.showNotification1 = false;
  }
  closeNotificationComp3(){ 
    this.showNotification2 = false;
  }
  

  handleButtonClick(button: any) {
    console.log('Button clicked', button);
    this.showNotification = false;
    this.showNotification1 = false;
    this.showNotification2 = false;
  }
}
