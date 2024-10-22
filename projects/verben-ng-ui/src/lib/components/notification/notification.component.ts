import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

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
  styleUrl: './notification.component.css'
})

export class NotificationComponent implements OnChanges {

  @Input() bgColor: string = '#D6F3E6'; 
  @Input() textColor: string = '#2DB76F';  
  @Input() width?: string = '650px';  
  @Input() height?: string = '50px'; 
  @Input() border?: string;
  @Input() borderRadius: string = '15px';
  @Input() fontSize: string = '20px';
  @Input() fontWeight: string = '700';
  @Input() padding: string = '10px 2.5rem 10px 1.5rem';
  @Input() iconName: string = 'success';
  @Input() iconWidth: number = 20;
  @Input() iconHeight: number = 20;
  @Input() content?: string;
  @Input() stroke: string = '';
  @Input() fill: string = '';
  @Input() top: string = '';
  @Input() bottom: string = '';
  @Input() buttons: Button[] = [];
  @Input() timeout: number = 10000; 
  @Input() showNotification : boolean = false; 
  @Input() position: string = 'top-left';
  @Input() transition: string = '0.6s ease-in-out';
  @Input() customClass?:string
  

  @Output() buttonClick = new EventEmitter<Button>();
  @Output() close = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showNotification']) {
      if (this.showNotification) {
        setTimeout(() => {
          this.close.emit();
        }, this.timeout);
      }
    }
  }

  get notificationStyles() {
    return {
      'background-color': this.bgColor,
      'color': this.textColor,
      'padding': this.padding,
      'border-radius': this.borderRadius,
      'border': this.border,
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

  closeNotification(){ 
    this.close.emit();
  }
}


