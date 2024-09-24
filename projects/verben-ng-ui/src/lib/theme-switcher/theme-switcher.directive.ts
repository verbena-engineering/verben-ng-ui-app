import { Directive, HostListener, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appThemeSwitcher]'
})
export class ThemeSwitcherDirective {
  private isDarkMode = false; // Track the current mode

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  @HostListener('click') toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark'); // Add Tailwind dark mode class
    } else {
      this.renderer.removeClass(this.document.body, 'dark');
    }
  }
}
