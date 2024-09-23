import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appConvertToInteger]'
})
export class ConvertToIntegerDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const integerValue = this.formatToInteger(inputValue);
    this.renderer.setProperty(this.el.nativeElement, 'value', integerValue);
    console.log(`this is ${integerValue}`)
  }

  private formatToInteger(value: string): string {
    if (!value) {
      return '';
    }
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) {
      return '';
    }
    return numericValue.toString();
  }
}
