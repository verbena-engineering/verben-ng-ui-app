import { Component, EventEmitter, Input, Output, HostListener, ElementRef,Renderer2, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'verben-pop-Up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class VerbenPopUpComponent implements AfterViewChecked {
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

  constructor(private elementRef: ElementRef,private renderer: Renderer2) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpenChange.emit(this.dropdownOpen);

    
    if (this.dropdownOpen) {
      this.setDropdownPosition();
    }
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

  // private setDropdownPosition(): void {
  //   const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-menu');
  //   const dropdownRect = dropdown.getBoundingClientRect();
  //   const parentRect = this.elementRef.nativeElement.getBoundingClientRect();
  //   const viewportHeight = window.innerHeight;
  //   const viewportWidth = window.innerWidth;

    
  //   console.log('Dropdown Rect:', dropdownRect);
  //   console.log('Parent Rect:', parentRect);
  //   console.log('Viewport:', { width: viewportWidth, height: viewportHeight });
  

  //   // Check vertical space
  //   if (viewportHeight - parentRect.bottom < dropdownRect.height) {
  //     // Position above
  //     this.renderer.setStyle(dropdown, 'top', 'auto');
  //     this.renderer.setStyle(dropdown, 'bottom', `${parentRect.height}px`);
  //   } else {
  //     // Position below
  //     this.renderer.setStyle(dropdown, 'top', `${parentRect.height}px`);
  //     this.renderer.setStyle(dropdown, 'bottom', 'auto');
  //   }

  //   // Check horizontal space
  //   if (parentRect.left + dropdownRect.width > viewportWidth) {
  //     // Position to the left
  //     this.renderer.setStyle(dropdown, 'left', 'auto');
  //     this.renderer.setStyle(dropdown, 'right', '0');
  //   } else if (parentRect.right - dropdownRect.width < 0) {
  //     // Position to the right
  //     this.renderer.setStyle(dropdown, 'left', '0');
  //     this.renderer.setStyle(dropdown, 'right', 'auto');
  //   } else {
  //     // Default alignment
  //     this.renderer.setStyle(dropdown, 'left', '0');
  //     this.renderer.setStyle(dropdown, 'right', 'auto');
  //   }
  // }

  ngAfterViewChecked() {
    if (this.dropdownOpen) {
      this.setDropdownPosition();
    }
  }

  private setDropdownPosition(): void {
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-container > div');
    // const triggerElement = this.elementRef.nativeElement.querySelector('dropdown-menu')
  
    if (!dropdown) {
      console.warn('Dropdown element not found.');
      return;
    }
  
    const dropdownRect = dropdown.getBoundingClientRect();
    const parentRect = this.elementRef.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    
    console.log('Dropdown Rect:', dropdownRect);
    console.log('Parent Rect:', parentRect);
    console.log('Viewport:', { width: viewportWidth, height: viewportHeight });
  
    // Vertical Positioning
    if (viewportHeight - parentRect.bottom < dropdownRect.height) {
      // Not enough space below, position above
      console.log('not enough space below')
      const topPosition = parentRect.top - dropdownRect.height;
      console.log('top pos:', topPosition);
      this.renderer.setStyle(dropdown, 'top', `auto`);
      this.renderer.setStyle(dropdown, 'bottom', '15px');
    } else {
      // Enough space below, position below
      console.log('Enough space below')
      const topPosition = parentRect.bottom;
      this.renderer.setStyle(dropdown, 'top', `20px`);
      this.renderer.setStyle(dropdown, 'bottom', 'auto');
    }
  
    // Horizontal Positioning
    if (parentRect.left + dropdownRect.width > viewportWidth) {
      console.log('not Enough space right')
      const leftPosition = viewportWidth - dropdownRect.width - 10;
      this.renderer.setStyle(dropdown, 'left', `auto`);
      // this.renderer.setStyle(dropdown, 'left', `${Math.max(leftPosition, 0)}px`);
      this.renderer.setStyle(dropdown, 'right', '10px');
    } else {
      console.log('Enough space right')
      const leftPosition = parentRect.left;
      this.renderer.setStyle(dropdown, 'left', `${10}px`);
      this.renderer.setStyle(dropdown, 'right', 'auto');
    }
  }
  
}