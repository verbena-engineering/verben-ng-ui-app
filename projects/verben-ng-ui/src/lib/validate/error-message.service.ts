import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  public createErrorMessage(inputElement: HTMLInputElement, message: string, position: 'above' | 'below') {
    // Check for existing error message span
    let errorElement = this.getErrorElement(inputElement);

    if (!errorElement) {
      // Create new error element if it doesn't exist
      errorElement = document.createElement('span');
      errorElement.style.color = 'red';
      errorElement.style.fontSize = '12px';

      // Insert error element in the specified position
      if (position === 'above') {
        inputElement.parentNode?.insertBefore(errorElement, inputElement);
      } else {
        inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
      }
    }

    errorElement.textContent = message;  // Update the message
  }

  public removeErrorMessage(inputElement: HTMLInputElement) {
    const errorElement = this.getErrorElement(inputElement);
    if (errorElement) {
      errorElement.remove();  // Remove the message element
    }
  }

  private getErrorElement(inputElement: HTMLInputElement): HTMLElement | null {
    // Return the existing error element if found
    return Array.from(inputElement.parentNode?.children || []).find(
      (el) => el.tagName.toLowerCase() === 'span'
    ) as HTMLElement | null;
  }
}
