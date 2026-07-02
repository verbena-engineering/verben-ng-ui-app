import { Component, Input } from '@angular/core';

@Component({
  selector: 'verbena-button',
  templateUrl: './verbena-button.component.html',
  styleUrls: ['./verbena-button.component.css'],
})
export class VerbenaButtonComponent {
  @Input() type: string | undefined;
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() useIcon: boolean = false;

  @Input() svgPosition: 'left' | 'right' = 'left';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() bgColor?: string = '';
  @Input() textColor?: string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() pd: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() fontSize: string = '14px';
  @Input() fontWeight: string = '500';
  @Input() disable: boolean = false;
  @Input() svgSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' = 'md';
  @Input() weight: number = 400;
  @Input() variant: 'outlined' | 'rounded' | 'sharp' = 'outlined';
  @Input() styleType:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'small'
    | 'outline'
    | 'grey'
    | 'ylw-outline' = 'primary'; // Predefined styles

  @Input() svg: string = '';
  @Input() svgWidth: number = 20;
  @Input() svgHeight: number = 20;
  @Input() iconColor: string = '';
  @Input() svgColor: string = '';

  @Input() buttonClass: string = ''; // Custom class for button
  @Input() buttonTextClass: string = ''; // Custom class for button
  @Input() isLoading: any;
  @Input() spinnerSize: any;
  @Input() spinnerColor: any;

  // Defaults resolve to theme tokens (see styles/theme.css). The color @Inputs
  // remain optional per-instance overrides that take precedence over the token.
  get buttonStyles() {
    switch (this.styleType) {
      case 'primary':
        return {
          bgColor: this.bgColor || 'var(--vbn-btn-primary-bg)',
          textColor: this.textColor || 'var(--vbn-btn-primary-fg)',
          border: this.border || 'none',
          borderRadius: this.borderRadius || 'var(--vbn-radius-sm)',
          pd: this.pd || '10px 15px',
        };
      case 'secondary':
        return {
          bgColor: this.bgColor || 'var(--vbn-btn-secondary-bg)',
          textColor: this.textColor || 'var(--vbn-btn-secondary-fg)',
          border: this.border || 'none',
          borderRadius: this.borderRadius || 'var(--vbn-radius-sm)',
          pd: this.pd || '10px 15px',
        };
      case 'danger':
        return {
          bgColor: this.bgColor || 'var(--vbn-btn-danger-bg)',
          textColor: this.textColor || 'var(--vbn-btn-danger-fg)',
          border: this.border || 'none',
          borderRadius: this.borderRadius || 'var(--vbn-radius-sm)',
          pd: this.pd || '8px 10px',
        };
      case 'small':
        return {
          bgColor: this.bgColor || 'var(--vbn-btn-small-bg)',
          textColor: this.textColor || 'var(--vbn-btn-small-fg)',
          border: this.border || '1px solid var(--vbn-color-border)',
          borderRadius: this.borderRadius || '7px',
          pd: this.pd || '0px 10px',
        };

      case 'outline':
        return {
          bgColor: this.bgColor || 'none',
          textColor: this.textColor || 'var(--vbn-btn-outline-fg)',
          border: this.border || '1px solid var(--vbn-btn-outline-border)',
          borderRadius: this.borderRadius || 'var(--vbn-radius)',
          pd: this.pd || '0px 8px',
        };
      case 'ylw-outline':
        return {
          bgColor: this.bgColor || 'var(--vbn-btn-ylw-outline-bg)',
          textColor: this.textColor || 'var(--vbn-btn-ylw-outline-fg)',
          border: this.border || '1px solid var(--vbn-btn-ylw-outline-border)',
          borderRadius: this.borderRadius || 'var(--vbn-radius)',
          pd: this.pd || '10px 15px',
        };
      case 'grey':
        return {
          bgColor: this.bgColor || 'none',
          textColor: this.textColor || 'var(--vbn-btn-grey-fg)',
          border: this.border || '2px solid var(--vbn-color-border)',
          borderRadius: this.borderRadius || 'var(--vbn-radius-sm)',
          pd: this.pd || '10px 15px',
        };
      default:
        return {};
    }
  }
}
