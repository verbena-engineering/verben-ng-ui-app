import { Component, Input } from '@angular/core';

@Component({
  selector: 'verbena-button',
  templateUrl: './verbena-button.component.html',
  styleUrls: ['./verbena-button.component.css']
})
export class VerbenaButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = ''; // Class for icon fonts (e.g., FontAwesome)
  @Input() iconPosition: 'left' | 'right' = 'left'; // Position for icon or SVG
  @Input() bgColor: string = '';
  @Input() textColor: string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() pd: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() disable: boolean = false;

  // Inputs for SVG support
  @Input() svg: string = ''; // SVG content as a string
  @Input() svgWidth: string = '16px'; // Width of the SVG
  @Input() svgHeight: string = '16px'; // Height of the SVG
}
