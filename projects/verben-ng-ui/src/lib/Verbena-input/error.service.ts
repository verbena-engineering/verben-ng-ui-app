import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  getErrorMessage(type: string, label: string, minMaxValue?: number): string {
    switch (type) {
      case 'required':
        return `${label} is required.`;
      case 'invalidNumber':
        return `${label} must be a valid number.`;
      case 'invalidInteger':
        return `${label} must be an integer.`;
      case 'minLength':
        return `${label} must be at least ${minMaxValue} characters long.`;
      case 'maxLength':
        return `${label} cannot exceed ${minMaxValue} characters.`;
      default:
        return 'Invalid input.';
    }
  }
}
