import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[controlOptions]'
})
export class ControlOptionsDirective implements OnChanges {
  
  // Inputs for various control options
  @Input() hidden: boolean = false;
  @Input() disabled: boolean = false;
  @Input() height: string | null = null;        
  @Input() width: string | null = null;    
  @Input() minHeight: string | null = null;
  @Input() minWidth: string | null = null; 
  @Input() maxHeight: string | null = null;
  @Input() maxWidth: string | null = null; 
  @Input() position: 'center' | 'left' | 'right' | 'top' | 'bottom' | null = null;
  @Input() scrollable: boolean = false;
  @Input() singleLine: boolean = false;
  @Input() multiLine: boolean = false;
  @Input() border: string | null = null; 
  @Input() borderRadius: string | null = null;
  @Input() textColor: string | null = null; 
  @Input() backgroundColor: string | null = null;
  @Input() hoverStyles: { [key: string]: string } | null = null;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.applyStyles();
  }

  private applyStyles(): void {
    const nativeElement = this.el.nativeElement;

    // Handle hidden property
    this.renderer.setStyle(nativeElement, 'display', this.hidden ? 'none' : 'block');

    // Handle disabled property
    if (this.disabled) {
      this.renderer.setAttribute(nativeElement, 'disabled', 'true');
      this.renderer.setStyle(nativeElement, 'pointer-events', 'none');
      this.renderer.setStyle(nativeElement, 'opacity', '0.6');
    } else {
      this.renderer.removeAttribute(nativeElement, 'disabled');
      this.renderer.setStyle(nativeElement, 'pointer-events', 'auto');
      this.renderer.setStyle(nativeElement, 'opacity', '1');
    }

    // Apply height, width, min/max constraints
    this.applyDimension(nativeElement, 'height', this.height);
    this.applyDimension(nativeElement, 'width', this.width);
    this.applyDimension(nativeElement, 'min-height', this.minHeight);
    this.applyDimension(nativeElement, 'min-width', this.minWidth);
    this.applyDimension(nativeElement, 'max-height', this.maxHeight);
    this.applyDimension(nativeElement, 'max-width', this.maxWidth);

    // Handle position
    this.handlePosition();

    // Scrollable property
    this.renderer.setStyle(nativeElement, 'overflow', this.scrollable ? 'auto' : 'hidden');

    // Single-line or multi-line
    if (this.singleLine) {
      this.renderer.setStyle(nativeElement, 'white-space', 'nowrap');
    } else if (this.multiLine) {
      this.renderer.setStyle(nativeElement, 'white-space', 'normal');
    }

    // Apply border and border-radius
    this.applyStyle(nativeElement, 'border', this.border);
    this.applyStyle(nativeElement, 'border-radius', this.borderRadius);

    // Apply text color and background color
    this.applyStyle(nativeElement, 'color', this.textColor);
    this.applyStyle(nativeElement, 'background-color', this.backgroundColor);
  }

  // Helper function to apply height, width, and similar styles
  private applyDimension(element: any, style: string, value: string | null): void {
    if (value) {
      this.renderer.setStyle(element, style, value);
    } else {
      this.renderer.removeStyle(element, style);
    }
  }

  // Generalized style application
  private applyStyle(element: any, style: string, value: string | null): void {
    if (value) {
      this.renderer.setStyle(element, style, value);
    } else {
      this.renderer.removeStyle(element, style);
    }
  }

  // Handle position based on the input
  private handlePosition(): void {
    const nativeElement = this.el.nativeElement;

    switch (this.position) {
      case 'center':
        this.renderer.setStyle(nativeElement, 'position', 'absolute');
        this.renderer.setStyle(nativeElement, 'top', '50%');
        this.renderer.setStyle(nativeElement, 'left', '50%');
        this.renderer.setStyle(nativeElement, 'transform', 'translate(-50%, -50%)');
        break;
      case 'left':
        this.renderer.setStyle(nativeElement, 'position', 'absolute');
        this.renderer.setStyle(nativeElement, 'left', '0');
        break;
      case 'right':
        this.renderer.setStyle(nativeElement, 'position', 'absolute');
        this.renderer.setStyle(nativeElement, 'right', '0');
        break;
      case 'top':
        this.renderer.setStyle(nativeElement, 'position', 'absolute');
        this.renderer.setStyle(nativeElement, 'top', '0');
        break;
      case 'bottom':
        this.renderer.setStyle(nativeElement, 'position', 'absolute');
        this.renderer.setStyle(nativeElement, 'bottom', '0');
        break;
      default:
        this.renderer.setStyle(nativeElement, 'position', 'static');
    }
  }
}
