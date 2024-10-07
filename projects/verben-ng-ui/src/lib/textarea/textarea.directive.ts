import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[verbenaTextArea]'
})
export class VerbenaTextAreaDirective {
  @Input() placeholder: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'verbena-textarea');
  }

  ngOnInit() {
    this.renderer.setAttribute(this.el.nativeElement, 'placeholder', this.placeholder);
  }
}
