import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    let inputValue = (event.target as HTMLInputElement).value;
    const numericValue = this.formatToNumeric(inputValue);
    this.renderer.setProperty(this.el.nativeElement, 'value', numericValue);
    console.log(`Formatted phone number: ${numericValue}`);
  }

  private formatToNumeric(value: string): string {
    // Remove all non-numeric characters except leading zeros
    return value.replace(/[^0-9]/g, '');
  }
}
