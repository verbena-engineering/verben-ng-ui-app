import {
    Directive,
    ElementRef,
    HostListener,
    Renderer2,
    AfterViewInit,
  } from '@angular/core';
  
  @Directive({
    selector: '[appDropdownPosition]'
  })
  export class DropdownPositionDirective implements AfterViewInit {
    constructor(private el: ElementRef, private renderer: Renderer2) {}
  
    ngAfterViewInit(): void {
      this.setDropdownPosition();
    }
  
    @HostListener('window:resize')
    onWindowResize(): void {
      this.setDropdownPosition();
    }
  
    // private setDropdownPosition(): void {
    //   const dropdown = this.el.nativeElement;
    //   const rect = dropdown.getBoundingClientRect();
    //   const viewportWidth = window.innerWidth;
  
    //   if (rect.right > viewportWidth) {
    //     this.renderer.setStyle(dropdown, 'right', '0');
    //     this.renderer.setStyle(dropdown, 'left', 'auto');
    //   } else {
    //     this.renderer.setStyle(dropdown, 'left', '0');
    //     this.renderer.setStyle(dropdown, 'right', 'auto');
    //   }
    // }

    private setDropdownPosition(): void {
      const dropdown = this.el.nativeElement;
      const dropdownRect = dropdown.getBoundingClientRect();
      const parentRect = this.el.nativeElement.parentElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
   
      if (dropdownRect.right > parentRect.right) {
         this.renderer.setStyle(dropdown, 'left', 'auto');
         this.renderer.setStyle(dropdown, 'right', '0');
      } else if (dropdownRect.left < parentRect.left) {
         this.renderer.setStyle(dropdown, 'left', '0');
         this.renderer.setStyle(dropdown, 'right', 'auto');
      }
   }
   
  }
  