import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  createErrorMessage(inputElement: HTMLElement, message: string, position: 'above' | 'below') {
    // Remove any existing error message for this input field first
    this.removeErrorMessage(inputElement);

    // Create the error message element
    const errorElement = this.renderer.createElement('div');
    this.renderer.addClass(errorElement, 'error-message');
    this.renderer.setStyle(errorElement, 'color', 'red');
    const text = this.renderer.createText(message);
    this.renderer.appendChild(errorElement, text);

    // Insert the error element either above or below based on user input
    const parentElement = inputElement.parentNode;

    // Check if parentElement is not null before proceeding
    if (parentElement) {
      if (position === 'above') {
        this.renderer.insertBefore(parentElement, errorElement, inputElement);
      } else {
        this.renderer.appendChild(parentElement, errorElement);
      }
    }
  }

  removeErrorMessage(inputElement: HTMLElement) {
    const parentElement = inputElement.parentNode;

    // Check if parentElement is not null before proceeding
    if (parentElement) {
      const errorMessages = parentElement.querySelectorAll('.error-message');
      errorMessages.forEach((errorMsg) => {
        this.renderer.removeChild(parentElement, errorMsg);
      });
    }
  }
}
