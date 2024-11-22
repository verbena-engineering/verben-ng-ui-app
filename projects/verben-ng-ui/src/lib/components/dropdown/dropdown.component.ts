import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'verben-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})


export class DropdownComponent {
  @Input() dropdownOpen: boolean = false;
  @Input() dropdownWidth: string = '300px';
  @Input() color: string = 'black';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Output() close: EventEmitter<Event> = new EventEmitter();

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onMouseOut() {
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  get dropdownStyles(){ 
    return{ 
      width:this.dropdownWidth,
      border:this.border,
      borderRadius:this.borderRadius,
    }
  }
}
