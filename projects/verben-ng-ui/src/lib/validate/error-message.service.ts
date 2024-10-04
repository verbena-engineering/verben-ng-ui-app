import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  public createErrorMessage(inputElement: HTMLInputElement, message: string, position: 'above' | 'below', color: string) {
    this.removeErrorMessage(inputElement);

    const errorElement = document.createElement('span');
    errorElement.textContent = message;
    errorElement.style.color = color;  // Use custom color
    errorElement.style.fontSize = '12px';
    errorElement.classList.add('error-message');

    if (position === 'above') {
      inputElement.parentNode?.insertBefore(errorElement, inputElement);
    } else {
      inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
    }
  }

  public removeErrorMessage(inputElement: HTMLInputElement) {
    const errorElements = inputElement.parentNode?.querySelectorAll('.error-message');
    if (errorElements) {
      errorElements.forEach((errorElement) => {
        errorElement.remove();
      });
    }
  }
}
