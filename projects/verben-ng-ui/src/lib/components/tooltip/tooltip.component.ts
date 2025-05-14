import { Component, Input, HostListener, TemplateRef, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'verben-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {
  @Input() tooltipContent!: TemplateRef<any>;
  @Input() customClass: string = '';   
  @Input() backgroundColor: string = 'black'; 
  @Input() textColor: string = 'white'; 
  @Input() padding: string = '5px 10px'; 
  @Input() borderRadius: string = '4px'; 
  @Input() zIndex: string = ''; 
  @Input() border: string = '';
  @Input() width: string = '';
  @Input() top?: string; 
  @Input() bottom?: string; 
  @Input() left?: string; 
  @Input() right?: string; 
  visible = false;

  tooltipPosition = { top: '', left: '' };

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  onMouseEnter(event: MouseEvent) {
    this.visible = true;
    this.updateTooltipPosition(event);
  }

  onMouseLeave() {
    this.visible = false;
  }

  private updateTooltipPosition(event: MouseEvent) {
    const tooltipElement = this.elementRef.nativeElement.querySelector('.tooltip-box');
    const triggerElement = event.target as HTMLElement;

    if (tooltipElement && triggerElement) {

      const triggerRect = triggerElement.getBoundingClientRect();

      const tooltipRect = tooltipElement.getBoundingClientRect();

      const availableSpaceAbove = triggerRect.top;
      const availableSpaceBelow = window.innerHeight - triggerRect.bottom;
      const availableSpaceLeft = triggerRect.left;
      const availableSpaceRight = window.innerWidth - triggerRect.right;

      let top = triggerRect.bottom + 'px';
      let left = (triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2) + 'px'; 

      if (availableSpaceBelow < tooltipRect.height && availableSpaceAbove >= tooltipRect.height) {
        top = (triggerRect.top - tooltipRect.height) + 'px';
      }

      if (availableSpaceRight < tooltipRect.width && availableSpaceLeft >= tooltipRect.width) {
        left = (triggerRect.left - tooltipRect.width) + 'px';
      } else if (availableSpaceLeft < tooltipRect.width && availableSpaceRight >= tooltipRect.width) {
        left = (triggerRect.right) + 'px';
      }

      this.tooltipPosition = { top, left };
    }
  }

  get tooltipStyles() {
    return {
      'background-color':this.backgroundColor,
      'width': this.width,
      'color': this.textColor,
      'padding': this.padding,
      'border-radius': this.borderRadius,
      'border': this.border,
      'position': 'absolute',
      'z-index': this.zIndex || '9999',
      'top':  this.top || this.tooltipPosition.top,
      'left': this.left || this.tooltipPosition.left,
      'right': this.right,
      'bottom': this.bottom,
    };
  }
}
