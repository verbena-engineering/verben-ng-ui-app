import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libColumn]',
})
export class ColumnDirective {
  @Input('libColumn') columnId!: string;

  @ContentChild('cell', { static: true }) cellTemplate?: TemplateRef<any>;
  @ContentChild('cellEdit', { static: true })
  cellEditTemplate?: TemplateRef<any>;
  @ContentChild('header', { static: true }) headerTemplate?: TemplateRef<any>;
  @ContentChild('footer', { static: true }) footerTemplate?: TemplateRef<any>;
}
