import { Component, Input, EventEmitter, Output,OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.services';
import { Subscription} from 'rxjs';

interface Button {
  text: string;
  bgColor?: string; 
  primarycolor?: string;  
  secondarycolor?: string;
  fontSize?:string;  
  fontWeight?:string;  
}

@Component({
  selector: 'verben-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})

export class NotificationComponent implements OnInit, OnDestroy {
 @Input() width?: string = '400px';  
 height?: string = '50px'; 
 borderRadius: string = '15px';
fontSize: string = '20px';
fontWeight: string = '700';
 padding: string = '10px 2.5rem 10px 1.5rem';
  @Input() content?: string;
   top: string = '';
  bottom: string = '';
  @Input() buttons: Button[] = [];
  @Input() timeout: number = 10000; 
  @Input() position: string = 'top-left';
  transition: string = '0.6s ease-in-out';

  showNotification = false;
  notificationContent = '';
  notificationOptions: any = {};
  subscription:Subscription
   
  constructor(
    private notificationService: NotificationService,
  ) {
    this.subscription = new Subscription();
    // console.log('show notification is here',this.showNotification)
  }

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      if (notification) {
        this.showNotification = true;
        this.notificationContent = notification.message;
        this.notificationOptions = notification.options;
        // console.log('show notification value is here',this.showNotification)

        setTimeout(() => {
          this.closeNotification();
        }, this.notificationOptions.timeout);
      } else {
        this.showNotification = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeNotification() {
    this.showNotification = false;
    this.notificationService.clearNotification();
  }

  // handleButtonClick(button: any) {
  //   this.notificationService.clearNotification();
  // }
  
  @Output() buttonClick = new EventEmitter<Button>();
  @Output() close = new EventEmitter();

  get notificationStyles() {
    return {
      'background-color': this.notificationOptions.backgroundColor,
      'color': this.notificationOptions.textColor,
      'padding': this.padding,
      'border-radius': this.borderRadius,
      'border': '1px solid transparent',
      'width': this.width,
      'font-size':this.fontSize,
      'font-weight':this.fontWeight,
      'display':'flex',
      'align-items':'center',
      'justify-content':'space-between',
      ...this.getPositionStyles(), 
      'position': 'fixed',
       'z-index': '9999',
      'transition': this.transition,
    };
  };
  
  getPositionStyles() {
    const positions: { [key: string]: any } = {
      'top-left': {
        top: this.top || '1rem' ,
        left: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'top-right': {
        top: this.top || '1rem' ,
        right: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'middle-left': {
        top: this.top || '45%' ,
        left: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'middle-right': {
        top: this.top || '45%' ,
        right: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'bottom-left': {
        bottom: this.bottom || '1rem',
        left: this.showNotification ? '1rem' : '-100%',
        transition: 'bottom 0.5s ease-in-out',
      },
      'bottom-right': {
        bottom: this.bottom || '1rem',
        right: this.showNotification ? '1rem' : '-100%',
        transition: 'bottom 0.5s ease-in-out',
      },
    };
  
    return positions[this.position] || positions['top-left'];
  }
  
  get btnWrapperStyle(){ 
    return { 
      'display':'flex',
      'align-items':'center',
      'gap':'0.8rem',
      'position':'relative'
    }
  }

  get innerWrapperStyles(){ 
    return { 
      'display':'flex',
      'align-items':'center',
      'gap':'1.5rem'
    }
  }

  onButtonClick(button: Button) {
    this.buttonClick.emit(button);
  }

}



