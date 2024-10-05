import { Component, Input } from '@angular/core';

@Component({
  selector: 'verbena-badge',
  template: `
    <span [ngStyle]="{
        'background-color': bgColor,
        'color': textColor,
        'border-radius': borderRadius,
        'padding': pd,
        'width': width,
        'height': height,
        'font-size': fontSize
      }"
      class="verbena-badge"
    >
      {{ text }}
    </span>
  `,
  styles: [`
    .verbena-badge {
      display: inline-flex;
      text-align: center;
      justify-content: center;
      place-items: center;
      // vertical-align: middle;
      margin: auto;
      font-weight: bold;
    }
    .verbena-badge span {
      display: flex;
      align-items: center;
      text-align: center;
      vertical-align: middle;
      font-weight: bold;
    }

  `]
})
export class VerbenaBadgeComponent {
  // Badge text and customization properties
  @Input() text: string = '';                 // Text or number inside the badge
  @Input() bgColor: string = '#ff4757';       // Background color (default red)
  @Input() textColor: string = '#fff';        // Text color (default white)
  @Input() borderRadius: string = '12px';     // Border radius (default round)
  @Input() pd: string = '5px 10px';           // Padding inside the badge
  @Input() fontSize: string = '14px';         // Font size for the badge text
   @Input() width: string = '';
  @Input() height: string = '';
}
