import { Component, Input, booleanAttribute } from '@angular/core';

export type VerbenaButtonStyle =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'small'
  | 'outline'
  | 'grey'
  | 'ylw-outline'
  | 'ghost'
  | 'link';

export type VerbenaButtonSize = 'sm' | 'md' | 'lg';

/**
 * <verbena-button>: preset looks (styleType) and sizes with hover, pressed,
 * keyboard-focus and loading states.
 *
 *   <verbena-button text="Save" styleType="secondary"></verbena-button>
 *   <verbena-button styleType="outline" size="sm" svg="plus">Add line</verbena-button>
 *
 * The look lives in CSS (verbena-button.component.css) and the --vbn-btn-*
 * theme tokens. The per-instance inputs (bgColor, textColor, border, pd…)
 * still win over the preset; they are passed as CSS custom properties, so
 * the hover and pressed shades are derived from them too.
 */
@Component({
  selector: 'verbena-button',
  templateUrl: './verbena-button.component.html',
  styleUrls: ['./verbena-button.component.css'],
})
export class VerbenaButtonComponent {
  @Input() type: string | undefined;
  @Input() text: string = '';
  /** Preset look. Colors come from the --vbn-btn-* theme tokens */
  @Input() styleType: VerbenaButtonStyle = 'primary';
  /** Height: sm 32px · md 36px · lg 44px */
  @Input() size: VerbenaButtonSize = 'md';
  /** Fill the width of the parent */
  @Input({ transform: booleanAttribute }) block = false;
  @Input({ transform: booleanAttribute }) disable: boolean = false;
  /** Same as disable */
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() isLoading: any;
  @Input() spinnerSize: any;
  @Input() spinnerColor: any;

  // ---- Icons: an icon from the library set (svg) or a Material Symbol (useIcon + icon) ----
  @Input() svg: string = '';
  @Input() svgPosition: 'left' | 'right' = 'left';
  @Input() svgWidth: number = 20;
  @Input() svgHeight: number = 20;
  @Input() svgSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' = 'md';
  /** Icon color. Unset = the text color, so icons follow hover and dark mode */
  @Input() svgColor: string = '';
  @Input() icon: string = '';
  @Input() useIcon: boolean = false;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() iconColor: string = '';
  @Input() variant: 'outlined' | 'rounded' | 'sharp' = 'outlined';
  @Input() weight: number = 400;

  // ---- Per-instance overrides (win over the preset) ----
  @Input() bgColor?: string = '';
  @Input() textColor?: string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() pd: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() fontSize: string = '';
  @Input() fontWeight: string = '';

  /** Extra class on the inner <button> */
  @Input() buttonClass: string = '';
  /** Extra class on the label */
  @Input() buttonTextClass: string = '';

  get isDisabled(): boolean {
    return this.disable || this.disabled || !!this.isLoading;
  }
}
