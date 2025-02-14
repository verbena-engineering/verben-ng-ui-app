import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vTemplate]',
})
export class TemplateDirective {
  @Input() vTemplate!: string; // The name of the template

  constructor(public template: TemplateRef<any>) {}
}
