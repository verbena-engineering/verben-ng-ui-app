import { Component, Input } from '@angular/core';

@Component({
  selector: 'verbena-badge',
  templateUrl: './verbena-badge.component.html',
  styleUrls: ['./verbena-badge.component.css']
})
export class VerbenaBadgeComponent {
  // Badge text and customization properties
  @Input() text: string = '';                 // Text or number inside the badge
  @Input() bgColor: string = 'var(--vbn-color-error)';       // Background color (default red)
  @Input() textColor: string = 'var(--vbn-color-surface)';        // Text color (default white)
  @Input() borderRadius: string = '12px';     // Border radius (default round)
  @Input() pd: string = '5px 10px';           // Padding inside the badge
  @Input() fontSize: string = '14px';         // Font size for the badge text
  @Input() width: string = '';
  @Input() height: string = '';
}
