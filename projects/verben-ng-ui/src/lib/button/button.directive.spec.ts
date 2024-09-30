import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective implements OnInit {
  @Input() buttonType: 'icon-text' | 'icon-only' | 'text-only' = 'text-only'; // Default to text-only
  @Input() iconClass: string = ''; // Class for the icon (if applicable)

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyStyles();
  }

  private applyStyles() {
    // Apply base button styles using Tailwind
    this.renderer.addClass(this.el.nativeElement, 'px-4');
    this.renderer.addClass(this.el.nativeElement, 'py-2');
    this.renderer.addClass(this.el.nativeElement, 'bg-blue-500');
    this.renderer.addClass(this.el.nativeElement, 'text-white');
    this.renderer.addClass(this.el.nativeElement, 'rounded');
    this.renderer.addClass(this.el.nativeElement, 'hover:bg-blue-700');
    this.renderer.addClass(this.el.nativeElement, 'transition');
    this.renderer.addClass(this.el.nativeElement, 'inline-flex');
    this.renderer.addClass(this.el.nativeElement, 'items-center');

    // Apply button type styles
    switch (this.buttonType) {
      case 'icon-text':
        this.addIconWithText();
        break;
      case 'icon-only':
        this.addIconOnly();
        break;
      case 'text-only':
        this.addTextOnly();
        break;
    }
  }

  private addIconWithText() {
    const icon = this.createIcon();
    this.renderer.insertBefore(this.el.nativeElement, icon, this.el.nativeElement.firstChild);
    this.renderer.addClass(this.el.nativeElement, 'gap-2');
  }

  private addIconOnly() {
    this.el.nativeElement.innerHTML = ''; // Clear existing content
    const icon = this.createIcon();
    this.renderer.appendChild(this.el.nativeElement, icon);
    this.renderer.addClass(this.el.nativeElement, 'p-2'); // Adjust padding for icon-only button
  }

  private addTextOnly() {
    // Already handled by default button styles (text content can be added directly in HTML)
  }

  private createIcon(): HTMLElement {
    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, this.iconClass); // Icon class is passed in as input
    return icon;
  }
}
