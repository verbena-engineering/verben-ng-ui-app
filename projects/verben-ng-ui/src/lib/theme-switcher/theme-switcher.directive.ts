import { Directive, ElementRef, Input, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appThemeSwitcher]'
})
export class ThemeSwitcherDirective {
  @Input() switchColor: string = 'black'; // Custom color for dark mode
  @Input() switchClass: string = ''; // Additional classes provided by the user

  private isDarkMode: boolean = false;
  private originalColor: string = ''; // Store the original color of the element

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.loadTheme();
    this.storeOriginalColor(); // Store the computed color of the element
  }

  @HostListener('click') onClick() {
    this.toggleTheme();
  }

  private toggleTheme(): void {
    const themeClass = 'dark';

    if (this.isDarkMode) {
      // Switch to light mode for the whole page
      this.renderer.removeClass(document.documentElement, themeClass);
      this.applyElementStyles(this.originalColor); // Reset the element's original color
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode for the whole page
      this.renderer.addClass(document.documentElement, themeClass);
      this.applyElementStyles(this.switchColor); // Apply dark mode color for the element
      localStorage.setItem('theme', 'dark');
    }

    this.isDarkMode = !this.isDarkMode; // Toggle the mode state
  }

  private applyElementStyles(color: string): void {
    // Apply inline color to the element
    this.el.nativeElement.style.color = color;

    // Apply user-provided custom class if available
    if (this.switchClass) {
      this.renderer.addClass(this.el.nativeElement, this.switchClass);
    }
  }

  private storeOriginalColor(): void {
    // Get the computed style of the element to find its original color
    const computedStyle = window.getComputedStyle(this.el.nativeElement);
    this.originalColor = computedStyle.color;
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      // If dark mode was previously set, apply it to the page and element
      this.renderer.addClass(document.documentElement, 'dark');
      this.isDarkMode = true;
      this.applyElementStyles(this.switchColor);
    } else {
      // Apply the original color if the light theme is active
      this.isDarkMode = false;
      this.applyElementStyles(this.originalColor);
    }
  }
}
