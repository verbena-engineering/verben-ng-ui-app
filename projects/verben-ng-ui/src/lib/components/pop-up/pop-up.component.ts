import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'verben-pop-Up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})


export class VerbenPopUpComponent {
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
    this.close.emit();
    // this.dropdownOpen = false;
    // this.dropdownOpenChange.emit(this.dropdownOpen);
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
