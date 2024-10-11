import { Component, Input, TemplateRef, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'verben-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {
  @Input() tooltipTemplate!: TemplateRef<any>; 
  @Input() customClass: string = ''; 
  @Input() backgroundColor: string = 'black'; 
  @Input() textColor: string = 'white'; 
  @Input() padding: string = '5px 10px'; 
  @Input() borderRadius: string = '4px'; 
  @Input() border: string = '';
  @Input() width: string = '';
  @Input() top?: string; 
  @Input() bottom?: string; 
  @Input() left?: string; 
  @Input() right?: string; 

  @ViewChild('tooltipRef', { static: false }) tooltipRef!: ElementRef;

  get tooltipStyles() {
    return {
      'background-color': this.backgroundColor,
      'width': this.width,
      'color': this.textColor,
      'padding': this.padding,
      'border-radius': this.borderRadius,
      'border': this.border,
      'position': 'absolute',
      'z-index': '9999',
      'top': this.top,
      'left': this.left,
      'right': this.right,
      'bottom': this.bottom,
    };
  }
}
