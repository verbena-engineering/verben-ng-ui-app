import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'verbena-input', // No standalone property
})
export class VerbenaInputDirective {
  @Input() required: boolean = false;
  @Input() minLength: number | undefined;
  @Input() maxLength: number | undefined;
  @Input() label: string | undefined;
  @Input() caption: string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('blur') onInputBlur() {
    const value = this.el.nativeElement.querySelector('input').value;

    // Handle required validation
    if (this.required && !value) {
      this.setErrorStyles('This field is required');
    } else {
      this.clearErrorStyles();
    }

    // Handle minLength validation
    if (this.minLength !== undefined && value.length < this.minLength) {
      this.setErrorStyles(`Minimum length is ${this.minLength}`);
    }

    // Handle maxLength validation
    if (this.maxLength !== undefined && value.length > this.maxLength) {
      this.setErrorStyles(`Maximum length is ${this.maxLength}`);
    }
  }

  private setErrorStyles(errorMessage: string) {
    this.renderer.setStyle(this.el.nativeElement.querySelector('input'), 'border', '1px solid red');
    this.renderer.setStyle(this.el.nativeElement.querySelector('input'), 'color', 'red');
    // Optionally, show the error message
    const errorNode = this.renderer.createElement('span');
    const text = this.renderer.createText(errorMessage);
    this.renderer.appendChild(errorNode, text);
    this.renderer.appendChild(this.el.nativeElement, errorNode);
  }

  private clearErrorStyles() {
    this.renderer.setStyle(this.el.nativeElement.querySelector('input'), 'border', '');
    this.renderer.setStyle(this.el.nativeElement.querySelector('input'), 'color', '');
    // Optionally, remove error message (if added)
  }

  ngAfterViewInit() {
    // Add label and caption to the input
    if (this.label) {
      const labelNode = this.renderer.createElement('label');
      this.renderer.setProperty(labelNode, 'innerText', this.label);
      this.renderer.setStyle(labelNode, 'display', 'block');
      this.renderer.insertBefore(this.el.nativeElement, labelNode, this.el.nativeElement.querySelector('input'));
    }

    if (this.caption) {
      const captionNode = this.renderer.createElement('span');
      this.renderer.setProperty(captionNode, 'innerText', this.caption);
      this.renderer.setStyle(captionNode, 'display', 'block');
      this.renderer.appendChild(this.el.nativeElement, captionNode);
    }
  }
}
