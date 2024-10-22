import { Component, Input } from '@angular/core';

@Component({
  selector: 'verbena-button',
  templateUrl: './verbena-button.component.html',
  styleUrls: ['./verbena-button.component.css']
})
export class VerbenaButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() svgPosition: 'left' | 'right' = 'left';
  @Input() bgColor?: string = '';
  @Input() textColor?: string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() pd: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() fontSize: string = '14px';
  @Input() disable: boolean = false;

  @Input() styleType: 'primary' | 'secondary' | 'danger' | 'small' | 'outline' | 'grey' | 'ylw-outline' = 'primary';  // Predefined styles

  @Input() svg: string = '';
  @Input() svgWidth: number = 20;
  @Input() svgHeight: number = 20;
  @Input() svgColor: string = '';


  @Input() buttonClass: string = ''; // Custom class for button

  get buttonStyles() {
    switch (this.styleType) {
      case 'primary':
        return {
          bgColor: this.bgColor || 'lightgrey',
          textColor: this.textColor || '#000000',
          border: this.border || 'none',
          borderRadius: this.borderRadius || '4px',
          pd: this.pd || '10px 15px'
        };
      case 'secondary':
        return {
          bgColor: this.bgColor || '#FFE681',
          textColor: this.textColor || '#404040',
          border: this.border || 'none',
          borderRadius: this.borderRadius || '4px',
          pd: this.pd || '10px 15px'
        };
      case 'danger':
        return {
          bgColor: this.bgColor || '#dc3545',
          textColor: this.textColor || '#ffffff',
          border: this.border || 'none',
          borderRadius: this.borderRadius || '4px',
          pd: this.pd || '8px 10px'
        };
      case 'small':
        return {
          bgColor: this.bgColor || '#fff',
          textColor: this.textColor || '#000',
          border: this.border || '1px solid grey',
          borderRadius: this.borderRadius || '7px',
          pd: this.pd || '0px 10px'
        };

      case 'outline':
        return {
          bgColor: this.bgColor || 'none',
          textColor: this.textColor || '#000',
          border: this.border || '1px solid #404040',
          borderRadius: this.borderRadius || '5px',
          pd: this.pd || '0px 8px'
        };
      case 'ylw-outline':
        return {
          bgColor: this.bgColor || '#FFFBEB',
          textColor: this.textColor || '#404040',
          border: this.border || '1px solid #FFE681',
          borderRadius: this.borderRadius || '5px',
          pd: this.pd || '10px 15px'
        };
      case 'grey':
        return {
          bgColor: this.bgColor || 'none',
          textColor: this.textColor || '#D9D9D940',
          border: this.border || '2px solid grey',
          borderRadius: this.borderRadius || '4px',
          pd: this.pd || '10px 15px'
        };
      default:
        return {};
    }
  }
}
