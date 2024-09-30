import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ErrorMessageService } from './error-message.service';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective {
  @Input() appValidate!: string;
  @Input() showBorder: boolean = false;
  @Input() showErrorMessage: boolean = false;
  @Input() errorPosition: 'above' | 'below' = 'below';

  constructor(private el: ElementRef, private renderer: Renderer2, private errorMessageService: ErrorMessageService) {}

  @HostListener('input') // Listen for the input event
  onInput() {
    this.validate();
  }

  private validate() {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    let errorMessage = '';

    switch (this.appValidate) {
      case 'text':
        if (!value) {
          errorMessage = 'This field is required.';
        }
        break;
      case 'number':
        if (isNaN(value as any)) {
          errorMessage = 'Please enter a valid number.';
        }
        break;
      case 'decimal':
        if (!/^\d+(\.\d+)?$/.test(value)) {
          errorMessage = 'Please enter a valid decimal number.';
        }
        break;
      case 'integer':
        if (!/^\d+$/.test(value)) {
          errorMessage = 'Please enter a valid integer.';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = 'Please enter a valid email address.';
        }
        break;
    }

    if (errorMessage) {
      this.showError(input, errorMessage);
    } else {
      this.clearError(input);
    }
  }

  private showError(input: HTMLInputElement, message: string) {
    if (this.showBorder) {
      this.renderer.setStyle(input, 'borderColor', 'red');
    }
    if (this.showErrorMessage) {
      this.errorMessageService.createErrorMessage(input, message, this.errorPosition);
    }
  }

  private clearError(input: HTMLInputElement) {
    if (this.showBorder) {
      this.renderer.removeStyle(input, 'borderColor');
    }
    if (this.showErrorMessage) {
      this.errorMessageService.removeErrorMessage(input);
    }
  }
}
