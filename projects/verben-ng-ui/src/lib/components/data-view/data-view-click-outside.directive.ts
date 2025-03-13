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
    @Input() appOutSideClick!: boolean
    @Output() outSideClick: EventEmitter<void> = new EventEmitter();
    constructor(private element: ElementRef, private renderer: Renderer2) {}
  
    private listener: (() => void) | undefined;
  
    onDocumentClick = (event: Event) => {
      const target=event.target as HTMLElement
      const isInsidePane = target.closest('.cdk-overlay-pane') !== null;
      if (!this.element.nativeElement.parentElement.contains(event.target)&& !isInsidePane) {
        this.outSideClick.emit();
      }
    };
  
    ngOnInit(): void {
      this.listener = this.renderer.listen(
        'document',
        'click',
        this.onDocumentClick
      );
    }
  
    ngOnDestroy(): void {
      if (this.listener) {
        this.listener();
      }
    }
  }