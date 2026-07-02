import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

type ThemeMode = 'light' | 'dark';

const MODE_ATTR = 'data-vbn-theme';
const STORAGE_KEY = 'vbn-theme';

/**
 * Click-to-toggle light/dark mode. Sets `data-vbn-theme="dark"` on the document
 * root (the same hook used by `ThemeService` and `styles/theme.css`), so the
 * whole token system flips. The chosen mode is persisted to localStorage and
 * restored on init.
 *
 * For programmatic control, inject `ThemeService` and call `setMode()` instead.
 */
@Directive({
  selector: '[appThemeSwitcher]',
})
export class ThemeSwitcherDirective implements OnInit {
  /** Optional class toggled on the host element while dark mode is active. */
  @Input() switchClass: string = '';

  /**
   * @deprecated No longer used — color now comes from theme tokens. Kept so
   * existing `[switchColor]` bindings don't break.
   */
  @Input() switchColor: string = '';

  private isDarkMode = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const saved = this.readSavedMode();
    this.applyMode(saved === 'dark' ? 'dark' : 'light');
  }

  @HostListener('click') onClick(): void {
    this.applyMode(this.isDarkMode ? 'light' : 'dark');
  }

  private applyMode(mode: ThemeMode): void {
    this.isDarkMode = mode === 'dark';

    const root = document.documentElement;
    if (this.isDarkMode) {
      this.renderer.setAttribute(root, MODE_ATTR, 'dark');
    } else {
      this.renderer.removeAttribute(root, MODE_ATTR);
    }

    if (this.switchClass) {
      if (this.isDarkMode) {
        this.renderer.addClass(this.el.nativeElement, this.switchClass);
      } else {
        this.renderer.removeClass(this.el.nativeElement, this.switchClass);
      }
    }

    this.saveMode(mode);
  }

  private readSavedMode(): ThemeMode | null {
    try {
      return localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    } catch {
      return null;
    }
  }

  private saveMode(mode: ThemeMode): void {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* localStorage unavailable (SSR/private mode) — ignore */
    }
  }
}
