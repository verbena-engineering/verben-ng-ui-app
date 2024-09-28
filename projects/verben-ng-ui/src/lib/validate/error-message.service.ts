import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  public createErrorMessage(inputElement: HTMLInputElement, message: string) {
    let errorElement = inputElement.nextElementSibling as HTMLElement;
    if (!errorElement || errorElement.tagName.toLowerCase() !== 'span') {
      errorElement = document.createElement('span');
      inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
    }
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
  }

  public removeErrorMessage(inputElement: HTMLInputElement) {
    let errorElement = inputElement.nextElementSibling as HTMLElement;
    if (errorElement && errorElement.tagName.toLowerCase() === 'span') {
      errorElement.textContent = '';
    }
  }
}
