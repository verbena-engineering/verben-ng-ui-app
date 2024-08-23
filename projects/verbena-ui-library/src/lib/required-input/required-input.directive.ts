import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[requiredInput]'
})
export class RequiredInputDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input') onInput() {
    const value = this.el.nativeElement.value.trim();
    if (value === '') {
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid red');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    }
  }
}
