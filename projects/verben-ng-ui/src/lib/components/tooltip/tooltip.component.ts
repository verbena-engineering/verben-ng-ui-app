import { Component, Input, TemplateRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgComponent } from '../svg/svg.component';

@Component({
  selector: 'verben-tooltip',
  standalone: true,
  imports: [CommonModule,SvgComponent],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements AfterViewInit {
  @Input() tooltipTemplate!: TemplateRef<any>; 
  @Input() customClass: string = ''; 
  @Input() backgroundColor: string = 'black'; 
  @Input() textColor: string = 'white'; 
  @Input() padding: string = '5px 10px'; 
  @Input() borderRadius: string = '4px'; 
  @Input() border: string = '';
  @Input() top?: string; 
  @Input() bottom?: string; 
  @Input() left?: string; 
  @Input() right?: string; 

  @ViewChild('tooltipRef', { static: false }) tooltipRef!: ElementRef;

  visible: boolean = false;

  ngAfterViewInit() {
    console.log('tooltip is mounted')
  }

  show() {
    this.visible = true;
    this.updatePosition();
  }

  hide() {
    this.visible = false;
  }

  updatePosition() {
    if (this.tooltipRef) {
      const tooltip = this.tooltipRef.nativeElement;
      tooltip.style.top = this.top ? this.top : `0px`; 
      tooltip.style.left = this.left ? this.left : `0px`;

      if (this.bottom) {
        tooltip.style.bottom = this.bottom;
      }
      if (this.right) {
        tooltip.style.right = this.right;
      }
    }
  }

  get tooltipStyles() {
    return {
      'background-color': this.backgroundColor,
      'color': this.textColor,
      'padding': this.padding,
      'border-radius': this.borderRadius,
      'border': this.border,
      'position': 'absolute',
      'z-index': '9999',
    };
  }
}
