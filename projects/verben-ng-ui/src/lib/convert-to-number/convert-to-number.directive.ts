import { Directive, ElementRef, HostListener, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appConvertToNumber]'
})
export class ConvertToNumberDirective {

  @Output() numberValue = new EventEmitter<number | null>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string) {
    const num = Number(value);
    if (!isNaN(num)) {
      this.numberValue.emit(num);
      this.renderer.setProperty(this.el.nativeElement, 'value', num);
    } else {
      this.numberValue.emit(null);
    }
    console.log(`this is ${num}`)
  }
}
