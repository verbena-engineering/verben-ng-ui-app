import { Component, EventEmitter, Input, Output, HostListener, ElementRef } from '@angular/core';

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
  @Input() customStyles: { [key: string]: string } = {}; 
  @Input() popUpClass:string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() enableMouseLeave: boolean = true; 
  @Output() close: EventEmitter<Event> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpenChange.emit(this.dropdownOpen);
  }

  onMouseOut() {
    if (this.enableMouseLeave) {
      this.close.emit();
      this.dropdownOpen = false;
      this.dropdownOpenChange.emit(this.dropdownOpen);
    }
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

  get yourStyles() {
    return {
      ...this.customStyles,
    };
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && this.dropdownOpen) {
      this.dropdownOpen = false;
      this.dropdownOpenChange.emit(this.dropdownOpen);
    }
  }
}
