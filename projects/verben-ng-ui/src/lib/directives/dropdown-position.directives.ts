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
  
    private setDropdownPosition(): void {
      const dropdown = this.el.nativeElement;
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
  
      if (rect.right > viewportWidth) {
        this.renderer.setStyle(dropdown, 'right', '0');
        this.renderer.setStyle(dropdown, 'left', 'auto');
      } else {
        this.renderer.setStyle(dropdown, 'left', '0');
        this.renderer.setStyle(dropdown, 'right', 'auto');
      }
    }
  }
  