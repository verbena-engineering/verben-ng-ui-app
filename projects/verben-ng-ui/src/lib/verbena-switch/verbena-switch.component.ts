// verbena-switch.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'verbena-switch',
  template: `
    <div class="switch" [ngClass]="{'disabled': disabled}" (click)="toggleSwitch()" [style]="customStyles">
      <input type="checkbox" [checked]="checked" (change)="onChange($event)" [disabled]="disabled" />
      <span class="slider"></span>
      <label *ngIf="label">{{ label }}</label>
    </div>
  `,
  styles: [`
    .switch {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
    }
    .slider {
      width: 34px;
      height: 20px;
      background-color: #ccc;
      border-radius: 34px;
      position: relative;
      transition: background-color 0.2s;
      margin-right: 10px;
    }
    .slider::before {
      content: "";
      position: absolute;
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    input:checked + .slider {
      background-color: #4caf50;
    }
    input:checked + .slider::before {
      transform: translateX(14px);
    }
    .disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `]
})
export class VerbenaSwitchComponent {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customStyles: string = '';

  @Output() change = new EventEmitter<boolean>();

  toggleSwitch() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.change.emit(this.checked);
    }
  }

  onChange(event: Event) {
    if (!this.disabled) {
      this.checked = (event.target as HTMLInputElement).checked;
      this.change.emit(this.checked);
    }
  }
}
