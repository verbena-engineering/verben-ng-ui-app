import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInputControl]'
})
export class InputControlDirective {

  @Input() required: boolean = false;
  @Input() minLength: number | undefined;
  @Input() maxLength: number | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('blur') onInputBlur() {
    const value = this.el.nativeElement.value;

    // Handle required validation
    if (this.required && !value) {
      this.setErrorStyles('This field is required');
    } else {
      this.clearErrorStyles();
    }

    // Handle minLength validation
    if (this.minLength !== undefined && value.length < this.minLength) {
      this.setErrorStyles(`Minimum length is ${this.minLength}`);
    }

    // Handle maxLength validation
    if (this.maxLength !== undefined && value.length > this.maxLength) {
      this.setErrorStyles(`Maximum length is ${this.maxLength}`);
    }
  }

  private setErrorStyles(errorMessage: string) {
    this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid red');
    this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
    // Optionally, show the error message
    const errorNode = this.renderer.createElement('span');
    const text = this.renderer.createText(errorMessage);
    this.renderer.appendChild(errorNode, text);
    this.renderer.appendChild(this.el.nativeElement.parentNode, errorNode);
  }

  private clearErrorStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'border', '');
    this.renderer.setStyle(this.el.nativeElement, 'color', '');
    // Optionally, remove error message (if added)
  }
}
