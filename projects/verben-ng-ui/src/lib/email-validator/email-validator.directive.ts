import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[validateEmail]'
})
export class EmailValidatorDirective {

  private emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string) {
    if (!this.emailRegex.test(value)) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid red');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    }
  }
}

// import { MaxNumberModule } from 'verbena-ui-peace22/max-number';
// import { MinNumberModule } from 'verbena-ui-peace22/min-number';
// import { RequiredInputModule } from 'verbena-ui-peace22/required-input';
// import { EmailValidatorModule } from 'verbena-ui-peace22/email-validator';
