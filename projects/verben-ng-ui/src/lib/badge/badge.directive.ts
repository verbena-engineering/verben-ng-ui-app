import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appBadge]'
})
export class BadgeDirective implements OnChanges {

  @Input('appBadge') badgeContent!: string | number;  // Content inside the badge
  @Input() badgeColor: string = 'bg-red-500';         // Tailwind background color
  @Input() badgePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';  // Badge position

  private badgeElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    this.createBadge();
  }

  private createBadge() {
    // Remove existing badge if already rendered
    if (this.badgeElement) {
      this.renderer.removeChild(this.el.nativeElement, this.badgeElement);
    }

    // Create badge element
    this.badgeElement = this.renderer.createElement('span');

    // Apply Tailwind classes to the badge
    this.renderer.addClass(this.badgeElement, 'absolute');
    this.renderer.addClass(this.badgeElement, 'text-white');
    this.renderer.addClass(this.badgeElement, 'text-xs');
    this.renderer.addClass(this.badgeElement, 'font-semibold');
    this.renderer.addClass(this.badgeElement, 'rounded-full');
    this.renderer.addClass(this.badgeElement, 'h-5');
    this.renderer.addClass(this.badgeElement, 'w-5');
    this.renderer.addClass(this.badgeElement, 'flex');
    this.renderer.addClass(this.badgeElement, 'items-center');
    this.renderer.addClass(this.badgeElement, 'justify-center');

    // Apply dynamic background color using Tailwind classes
    this.renderer.addClass(this.badgeElement, this.badgeColor);

    // Set badge position
    this.setPosition();

    // Set the badge content
    const text = this.renderer.createText(this.badgeContent.toString());
    this.renderer.appendChild(this.badgeElement, text);

    // Append the badge to the host element
    this.renderer.appendChild(this.el.nativeElement, this.badgeElement);
  }

  private setPosition() {
    const positions = {
      'top-left': ['top-0', 'left-0', '-translate-x-1/2', '-translate-y-1/2'],
      'top-right': ['top-0', 'right-0', 'translate-x-1/2', '-translate-y-1/2'],
      'bottom-left': ['bottom-0', 'left-0', '-translate-x-1/2', 'translate-y-1/2'],
      'bottom-right': ['bottom-0', 'right-0', 'translate-x-1/2', 'translate-y-1/2'],
    };

    // Clear any existing position classes before adding new ones
    this.renderer.removeClass(this.badgeElement, 'top-0');
    this.renderer.removeClass(this.badgeElement, 'left-0');
    this.renderer.removeClass(this.badgeElement, 'right-0');
    this.renderer.removeClass(this.badgeElement, 'bottom-0');

    // Apply the position classes based on the badgePosition input
    positions[this.badgePosition].forEach(posClass => {
      this.renderer.addClass(this.badgeElement, posClass);
    });
  }
}




// module.exports = {
//   theme: {
//     extend: {
//       spacing: {
//         'badge': '1.25rem',  // Custom badge size
//       },
//     },
//   },
// }

