// directives/outside-click.directive.ts

import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appOutSideClick]',
  standalone: true,
})
export class OutSideClickDirective implements OnInit, OnDestroy {
  @Input() appOutSideClick!: boolean;
  @Output() outSideClick: EventEmitter<void> = new EventEmitter();
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {}

  private listener: (() => void) | undefined;

  onDocumentClick = (event: Event) => {
    if (!this.appOutSideClick) {
      return;
    }

    const path = event.composedPath();

    const parent = this.element?.nativeElement?.parentElement;
    const isInsideElement =
      parent &&
      (path.includes(parent) || parent.contains(event.target as Node));

    const isOverlay = path.some(
      (node) =>
        node instanceof HTMLElement &&
        (node.classList.contains('cdk-overlay-pane') ||
          node.classList.contains('cdk-overlay-backdrop') ||
          node.classList.contains('cdk-overlay-container')),
    );

    if (!isInsideElement && !isOverlay) {
      this.outSideClick.emit();
    }
  };

  ngOnInit(): void {
    this.listener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick,
    );
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }
}
