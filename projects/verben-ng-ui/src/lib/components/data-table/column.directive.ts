import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libColumn]',
  // standalone: true,
})
export class ColumnDirective {
  @Input('libColumn') columnId!: string;

  constructor(public template: TemplateRef<any>) {}
}
