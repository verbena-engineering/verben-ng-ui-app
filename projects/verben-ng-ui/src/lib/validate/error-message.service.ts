import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  public createErrorMessage(inputElement: HTMLInputElement, message: string, position: 'above' | 'below') {
    // Remove existing error messages first
    this.removeErrorMessage(inputElement);

    // Create a new error message span
    const errorElement = document.createElement('span');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.classList.add('error-message'); // Add a class for easier identification

    // Insert the error message based on the specified position
    if (position === 'above') {
      inputElement.parentNode?.insertBefore(errorElement, inputElement);
    } else {
      inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
    }
  }

  public removeErrorMessage(inputElement: HTMLInputElement) {
    // Remove any existing error message for this input
    const errorElements = inputElement.parentNode?.querySelectorAll('.error-message');
    if (errorElements) {
      errorElements.forEach((errorElement) => {
        errorElement.remove(); // Remove all error spans with the class
      });
    }
  }
}
