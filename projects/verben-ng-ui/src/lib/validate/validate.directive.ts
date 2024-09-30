import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
import { ErrorMessageService } from './error-message.service';
import { VerbenaInputComponent } from '../Verbena-input/verbena-input.component';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective {
  @Input('appValidate') validationType: 'text' | 'number' | 'decimal' | 'integer' | 'email' = 'text';
  @Input() required: boolean = false;
  @Input() showBorder: boolean = true;
  @Input() showErrorMessage: boolean = true;
  @Input() errorPosition: 'above' | 'below' = 'below';

  constructor(
    private el: ElementRef,
    private errorMessageService: ErrorMessageService,
    private renderer: Renderer2
  ) {}

  @HostListener('input', ['$event.target']) onInput(inputElement: any) {
    const value = inputElement.value.trim();

    switch (this.validationType) {
      case 'text':
        this.validateText(inputElement, value);
        break;
      case 'number':
        this.validateNumber(inputElement, value);
        break;
      case 'decimal':
        this.validateDecimal(inputElement, value);
        break;
      case 'integer':
        this.validateInteger(inputElement, value);
        break;
      case 'email':
        this.validateEmail(inputElement, value);
        break;
    }
  }

  private validateText(input: any, value: string) {
    if (this.required && value === '') {
      this.showError(input, 'Text is required');
    } else {
      this.clearError(input);
    }
  }

  private validateNumber(input: any, value: string) {
    if (isNaN(+value)) {
      this.showError(input, 'Please enter a valid number');
    } else {
      this.clearError(input);
    }
  }

  private validateDecimal(input: any, value: string) {
    const regex = /^\d+(\.\d+)?$/;
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid decimal number');
    } else {
      this.clearError(input);
    }
  }

  private validateInteger(input: any, value: string) {
    const regex = /^\d+$/;
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid integer');
    } else {
      this.clearError(input);
    }
  }

  private validateEmail(input: any, value: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid email address');
    } else {
      this.clearError(input);
    }
  }

  private showError(input: any, message: string) {
    if (this.showBorder) {
      this.renderer.setStyle(input, 'borderColor', 'red');
    }
    if (this.showErrorMessage) {
      this.errorMessageService.createErrorMessage(input, message, this.errorPosition);
    }
  }

  private clearError(input: any) {
    if (this.showBorder) {
      this.renderer.removeStyle(input, 'borderColor');
    }
    if (this.showErrorMessage) {
      this.errorMessageService.removeErrorMessage(input);
    }
  }
}
