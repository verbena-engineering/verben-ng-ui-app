import { Component, Input, EventEmitter, Output } from '@angular/core';

interface Button {
  text: string;
  bgColor?: string; 
  primarycolor?: string;  
  secondarycolor?: string;
  fontSize?:string;  
  fontWeigth?:string;  
}

@Component({
  selector: 'verben-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})

export class NotificationComponent {
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
  @Input() buttons: Button[] = [];

  @Output() buttonClick = new EventEmitter<Button>();


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
      'justify-content':'space-between'
    };
  };


  get btnWrapperStyle(){ 
    return { 
      'display':'flex',
      'align-items':'center',
      'gap':'0.8rem'
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


