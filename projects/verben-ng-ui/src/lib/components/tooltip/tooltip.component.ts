import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-tooltip',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {
  @Input() message?: string = ''; 
  @Input() position: { 
    top?: string; 
    left?: string; 
    right?: string; 
    bottom?: string; 
    transform?: string; 
  } = { top: '100%', left: '50%', transform: 'translateX(-50%)' };
  @Input() customClass: string = ''; 
  

  @Input() backgroundColor?: string; 
  @Input() textColor?: string = 'white';
  @Input() padding?: string = '5px 10px';
  @Input() borderRadius?: string = '4px'; 
  @Input() border?: string

  visible: boolean = false; 

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  get tooltipStyles() {
    return {
      'background-color': this.backgroundColor,
      'color': this.textColor,
      'padding': this.padding,
      'border-radius': this.borderRadius,
      ...this.position 
    };
  }
}
