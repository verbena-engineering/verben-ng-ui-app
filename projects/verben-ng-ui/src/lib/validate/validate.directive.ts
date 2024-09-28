import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
import { ErrorMessageService } from './error-message.service';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective {
  @Input('appValidate') validationType: 'text' | 'number' | 'decimal' | 'integer' | 'email' = 'text';
  @Input() required: boolean = false;

  constructor(
    private el: ElementRef,
    private errorMessageService: ErrorMessageService,
    private renderer: Renderer2
  ) {}

  @HostListener('input') onInput() {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value.trim();

    switch (this.validationType) {
      case 'text':
        this.validateText(input, value);
        break;
      case 'number':
        this.validateNumber(input, value);
        break;
      case 'decimal':
        this.validateDecimal(input, value);
        break;
      case 'integer':
        this.validateInteger(input, value);
        break;
      case 'email':
        this.validateEmail(input, value);
        break;
    }
  }

  private validateText(input: HTMLInputElement, value: string) {
    if (this.required && value === '') {
      this.showError(input, 'Text is required');
    } else {
      this.clearError(input);
    }
  }

  private validateNumber(input: HTMLInputElement, value: string) {
    if (isNaN(+value)) {
      this.showError(input, 'Please enter a valid number');
    } else {
      this.clearError(input);
    }
  }

  private validateDecimal(input: HTMLInputElement, value: string) {
    const regex = /^\d+(\.\d+)?$/;
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid decimal number');
    } else {
      this.clearError(input);
    }
  }

  private validateInteger(input: HTMLInputElement, value: string) {
    const regex = /^\d+$/;
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid integer');
    } else {
      this.clearError(input);
    }
  }

  private validateEmail(input: HTMLInputElement, value: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid email address');
    } else {
      this.clearError(input);
    }
  }

  private showError(input: HTMLInputElement, message: string) {
    this.errorMessageService.createErrorMessage(input, message);
    this.renderer.setStyle(input, 'borderColor', 'red');
  }

  private clearError(input: HTMLInputElement) {
    this.errorMessageService.removeErrorMessage(input);
    this.renderer.removeStyle(input, 'borderColor');
  }
}
