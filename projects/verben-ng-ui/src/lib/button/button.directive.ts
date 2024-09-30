import { Directive, ElementRef, Input, TemplateRef, Optional } from '@angular/core';

export interface ButtonConfig {
  text?: string;
  icon?: string;
  template?: TemplateRef<any>;
  // Add more properties as needed
}

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective {
  @Input() config?: ButtonConfig;

  constructor(private elementRef: ElementRef, @Optional() private templateRef: TemplateRef<any>) {}

  ngAfterViewInit() {
    this.renderButton();
  }

  private renderButton() {
    const buttonElement = document.createElement('button');

    // Use template if provided
    if (this.config?.template && this.templateRef) {
      const embeddedView = this.templateRef.createEmbeddedView(null);
      embeddedView.rootNodes.forEach(node => buttonElement.appendChild(node));
    } else {
      // Add icon if provided
      if (this.config?.icon) {
        const iconElement = document.createElement('i');
        iconElement.className = this.config.icon;
        buttonElement.appendChild(iconElement);
      }

      // Add text if provided
      if (this.config?.text) {
        buttonElement.textContent = this.config.text;
      }
    }

    // Append the created button to the host element
    this.elementRef.nativeElement.appendChild(buttonElement);
  }
}
