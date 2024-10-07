import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  public createErrorMessage(inputElement: HTMLInputElement, message: string, position: 'above' | 'below', color: string, showErrorIcon: boolean, tooltipPosition: 'top' | 'bottom' | 'left' | 'right') {
    this.removeErrorMessage(inputElement);

    // Error message element
    const errorElement = document.createElement('span');
    errorElement.textContent = message;
    errorElement.style.color = color;
    errorElement.style.fontSize = '12px';
    errorElement.classList.add('error-message');

    if (position === 'above') {
      inputElement.parentNode?.insertBefore(errorElement, inputElement);
    } else {
      inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
    }

    // Tooltip behavior can be handled in the directive
    if (showErrorIcon) {
      const errorDot = document.createElement('div');
      errorDot.style.width = '8px';
      errorDot.style.height = '8px';
      errorDot.style.backgroundColor = 'red'; // Color of the dot icon
      errorDot.style.borderRadius = '50%';
      errorDot.style.position = 'absolute';
      errorDot.style.top = '50%';
      errorDot.style.right = '10px'; // Adjust to control horizontal alignment inside the input
      errorDot.style.transform = 'translateY(-50%)';
      errorDot.style.cursor = 'pointer';
      errorDot.classList.add('error-dot');

      // Tooltip element
      const tooltip = document.createElement('span');
      tooltip.textContent = message;
      tooltip.style.position = 'absolute';
      tooltip.style.padding = '5px';
      tooltip.style.backgroundColor = 'red';
      tooltip.style.color = 'white';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '10px';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.visibility = 'hidden'; // Hidden until hover/click
      tooltip.classList.add('error-tooltip');

      // Set tooltip position
      this.setTooltipPosition(tooltip, errorDot, tooltipPosition);

      // Show tooltip on hover/click
      errorDot.addEventListener('mouseenter', () => tooltip.style.visibility = 'visible');
      errorDot.addEventListener('mouseleave', () => tooltip.style.visibility = 'hidden');
      errorDot.addEventListener('click', () => tooltip.style.visibility = 'visible');

      inputElement.parentNode?.appendChild(errorDot);
      inputElement.parentNode?.appendChild(tooltip);
    }
  }

  private setTooltipPosition(tooltip: HTMLElement, errorDot: HTMLElement, position: 'top' | 'bottom' | 'left' | 'right') {
    switch (position) {
      case 'top':
        tooltip.style.bottom = '20px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        tooltip.style.top = '20px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        break;
      case 'left':
        tooltip.style.right = '20px';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translateY(-50%)';
        break;
      case 'right':
        tooltip.style.left = '20px';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translateY(-50%)';
        break;
    }
  }

  public removeErrorMessage(inputElement: HTMLInputElement) {
    const errorElements = inputElement.parentNode?.querySelectorAll('.error-message, .error-dot, .error-tooltip');
    if (errorElements) {
      errorElements.forEach((errorElement) => {
        errorElement.remove();
      });
    }
  }
}
