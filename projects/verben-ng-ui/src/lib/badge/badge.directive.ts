import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[verbenaBadge]'
})
export class VerbenaBadgeDirective {
  @Input() badgeText: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const badge = this.renderer.createElement('span');
    this.renderer.addClass(badge, 'verbena-badge');
    this.renderer.appendChild(badge, this.renderer.createText(this.badgeText));
    this.renderer.appendChild(this.el.nativeElement, badge);
  }
}
