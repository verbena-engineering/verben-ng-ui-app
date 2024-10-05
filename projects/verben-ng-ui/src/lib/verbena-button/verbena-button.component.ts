import { Component, Input } from '@angular/core';

@Component({
  selector: 'verbena-button',
  template: `
    <button [ngStyle]="{
        'background-color': bgColor,
        'color': textColor,
        'border': border,
        'border-radius': borderRadius,
        'padding': pd,
        'width': width,
        'height': height
      }"
      [disabled]="disable"
      class="verbena-button"
    >
      <ng-container *ngIf="icon && iconPosition === 'left'">
        <i [class]="icon" style="margin-right: 8px;"></i>
      </ng-container>

      <span *ngIf="text">{{ text }}</span>

      <ng-container *ngIf="icon && iconPosition === 'right'">
        <i [class]="icon" style="margin-left: 8px;"></i>
      </ng-container>
    </button>
  `,
  styles: [`
    .verbena-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .verbena-button i {
      font-size: 16px;
    }
    .verbena-button[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `]
})
export class VerbenaButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() bgColor: string = '';
  @Input() textColor: string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() pd: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() disable: boolean = false;
}
