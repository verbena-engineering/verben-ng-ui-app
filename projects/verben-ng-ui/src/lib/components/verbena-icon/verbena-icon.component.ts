import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'verbena-icon',
  templateUrl: './verbena-icon.component.html',
  styleUrls: ['./verbena-icon.component.css']
})
export class VerbenaIconComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() icon: string = '';
  @Input() variant: 'outlined' | 'rounded' | 'sharp' = 'outlined';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | number = 'md';
  @Input() fill: boolean = false;
  @Input() weight: number = 400; // Changed to number type to accommodate both property binding and string input
  @Input() color: string = '';

  iconName: string = '';
  iconStyles: any = {};
  fillClass: string = '';

  constructor() {}

  ngOnInit(): void {
    this.updateIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateIcon();
  }

  ngAfterViewInit(): void {
    this.ensureGoogleIconsLoaded();
  }

  private ensureGoogleIconsLoaded(): void {
    // Check if Google Icons stylesheet is already loaded
    const linkExists = document.querySelector('link[href*="material-symbols"]');
    
    if (!linkExists) {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200';
      document.head.appendChild(linkElement);
    }
  }

  private updateIcon(): void {
    // Set the icon name from the input
    this.iconName = this.icon;
    this.updateStyles();
    this.fillClass = this.fill ? 'material-fill-1' : 'material-fill-0';
  }

  private updateStyles(): void {
    const sizeMap: { [key: string]: number } = {
      'sm': 18,
      'md': 24,
      'lg': 36,
      'xl': 48,
      '2xl': 60,
      '3xl': 72,
      '4xl': 96
    };

    const iconSize = typeof this.size === 'number' 
      ? this.size 
      : sizeMap[this.size as string] || 24;
    
    // Ensure weight is a valid number between 100-700 and is a multiple of 100
    let weightValue = Number(this.weight);
    weightValue = !isNaN(weightValue) ? weightValue : 400;
    weightValue = Math.min(700, Math.max(100, Math.round(weightValue / 100) * 100));

    this.iconStyles = {
      'font-size': `${iconSize}px`,
      'font-variation-settings': `'FILL' ${this.fill ? 1 : 0}, 'wght' ${weightValue}, 'GRAD' 0`,
      'color': this.color || 'inherit'
    };
  }
}