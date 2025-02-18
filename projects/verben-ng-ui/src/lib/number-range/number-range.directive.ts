import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNumberRange]'
})
export class NumberRangeDirective {
  @Input() maxNumber!: number;
  @Input() minNumber!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string) {
    const numberValue = parseFloat(value);
    let borderStyle = 'none';

    if (isNaN(numberValue)) {
      borderStyle = 'none';
    } else if (this.maxNumber !== undefined && numberValue > this.maxNumber) {
      borderStyle = '1px solid red';
    } else if (this.minNumber !== undefined && numberValue < this.minNumber) {
      borderStyle = '1px solid red';
    }

    this.renderer.setStyle(this.el.nativeElement, 'border', borderStyle);
  }
}



// <input type="number" appNumberRange [maxNumber]="10">
// <input type="number" appNumberRange [minNumber]="5">
// <input type="number" appNumberRange [maxNumber]="10" [minNumber]="5">



