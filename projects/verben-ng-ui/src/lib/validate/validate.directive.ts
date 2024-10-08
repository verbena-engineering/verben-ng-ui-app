import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
import { ErrorMessageService } from './error-message.service';
import './validate.directive.css'; // Ensure this path is correct

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective {
  @Input('appValidate') validationType: 'text' | 'number' | 'decimal' | 'integer' | 'email' = 'text';
  @Input() required: boolean = false;
  @Input() showBorder: boolean = true;  // The controlling factor for the error icon
  @Input() showErrorMessage: boolean = true;
  @Input() errorPosition: 'above' | 'below' = 'below';
  @Input() errorBorderColor: string = 'red';  // Border color for errors
  @Input() errorMessageColor: string = 'red';  // Color for error message
  @Input() errorIconTooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top'; // Tooltip position for error dot
  @Input() showErrorIcon: boolean = true;

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
      this.blockInvalidInput(input, 'Please enter a valid number');
    } else {
      this.clearError(input);
    }
  }

  private validateDecimal(input: any, value: string) {
    const regex = /^\d*\.?\d*$/; 
    if (!regex.test(value)) {
      this.showError(input, 'Please enter a valid decimal number');
    } else {
      this.clearError(input);
    }
  }

  private validateInteger(input: any, value: string) {
    const regex = /^\d+$/;
    if (!regex.test(value)) {
      this.blockInvalidInput(input, 'Please enter a valid integer');
    } else {
      this.clearError(input);
    }
  }

  private validateEmail(input: any, value: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      this.blockInvalidInput(input, 'Please enter a valid email address');
    } else {
      this.clearError(input);
    }
  }

  private blockInvalidInput(input: any, message: string) {
    input.value = '';
    this.showError(input, message);
  }

  private showError(input: any, message: string) {
    if (this.showBorder) {
      this.renderer.setStyle(input, 'borderColor', this.errorBorderColor);
      this.renderer.addClass(input, 'error-with-dot'); // Add error class

      // Show error icon when showBorder is true
      this.errorMessageService.createErrorMessage(input, message, this.errorPosition, this.errorMessageColor, true, this.errorIconTooltipPosition);
    }

    if (this.showErrorMessage) {
      // Show error message when showErrorMessage is true
      this.errorMessageService.createErrorMessage(input, message, this.errorPosition, this.errorMessageColor, false, this.errorIconTooltipPosition);
    }
  }

  private clearError(input: any) {
    if (this.showBorder) {
      this.renderer.removeStyle(input, 'borderColor');
      this.renderer.removeClass(input, 'error-with-dot'); // Remove error class
    }
    this.errorMessageService.removeErrorMessage(input);
  }
}
