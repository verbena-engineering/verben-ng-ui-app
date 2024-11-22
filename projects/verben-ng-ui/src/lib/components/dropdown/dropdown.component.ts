import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'verben-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})


export class DropdownComponent {
  @Input() dropdownOpen: boolean = false;
  @Output() dropdownOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() dropdownWidth: string = '';
  @Input() color: string = 'black';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Output() close: EventEmitter<Event> = new EventEmitter();

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpenChange.emit(this.dropdownOpen);
  }

  onMouseOut() {
    this.dropdownOpen = false;
    this.dropdownOpenChange.emit(this.dropdownOpen);
  }

  onClose() {
    this.close.emit();
  }

  get dropdownStyles() { 
    return { 
      width: this.dropdownWidth,
      border: this.border,
      borderRadius: this.borderRadius,
    };
  }
}
