// import {
//     Directive,
//     ElementRef,
//     HostListener,
//     Renderer2,
//     AfterViewInit,
//   } from '@angular/core';
  
//   @Directive({
//     selector: '[appDropdownPosition]'
//   })
//   export class DropdownPositionDirective implements AfterViewInit {
//     constructor(private el: ElementRef, private renderer: Renderer2) {}
  
//     ngAfterViewInit(): void {
//       this.setDropdownPosition();
//     }
  
//     @HostListener('window:resize')
//     onWindowResize(): void {
//       this.setDropdownPosition();
//     }

//     private setDropdownPosition(): void {
//       const dropdown = this.el.nativeElement;
//       const dropdownRect = dropdown.getBoundingClientRect();
//       const parentRect = this.el.nativeElement.parentElement.getBoundingClientRect();
//       const viewportWidth = window.innerWidth;
   
//       if (dropdownRect.right > parentRect.right) {
//          this.renderer.setStyle(dropdown, 'left', 'auto');
//          this.renderer.setStyle(dropdown, 'right', '0');
//       } else if (dropdownRect.left < parentRect.left) {
//          this.renderer.setStyle(dropdown, 'left', '0');
//          this.renderer.setStyle(dropdown, 'right', 'auto');
//       }
//    }
//   }


import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { RendererStyleFlags2 } from '@angular/core';
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
    const dropdownRect = dropdown.getBoundingClientRect();
    const parentRect = this.el.nativeElement.parentElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
  
    console.log('Dropdown Rect:', dropdownRect);
    console.log('Parent Rect:', parentRect);
    console.log('Viewport:', { width: viewportWidth, height: viewportHeight });
  
    // Check vertical space
    if (viewportHeight - parentRect.bottom < dropdownRect.height) {
      // Position above
      this.renderer.setStyle(dropdown, 'top', 'auto', RendererStyleFlags2.Important);
      this.renderer.setStyle(dropdown, 'bottom', `${parentRect.height}px`, RendererStyleFlags2.Important);
      console.log('Positioned above');
    } else {
      // Position below
      this.renderer.setStyle(dropdown, 'top', `${parentRect.height}px`, RendererStyleFlags2.Important);
      this.renderer.setStyle(dropdown, 'bottom', 'auto', RendererStyleFlags2.Important);
      console.log('Positioned below');
    }
  
    // Check horizontal space
    if (parentRect.left + dropdownRect.width > viewportWidth) {
      // Position to the left
      this.renderer.setStyle(dropdown, 'left', 'auto', RendererStyleFlags2.Important);
      this.renderer.setStyle(dropdown, 'right', '0', RendererStyleFlags2.Important);
      console.log('Positioned to the left');
    } else if (parentRect.right - dropdownRect.width < 0) {
      // Position to the right
      this.renderer.setStyle(dropdown, 'left', '0', RendererStyleFlags2.Important);
      this.renderer.setStyle(dropdown, 'right', 'auto', RendererStyleFlags2.Important);
      console.log('Positioned to the right');
    } else {
      this.renderer.setStyle(dropdown, 'left', '0', RendererStyleFlags2.Important);
      this.renderer.setStyle(dropdown, 'right', 'auto', RendererStyleFlags2.Important);
      console.log('Default alignment');
    }
  }
  
}

  