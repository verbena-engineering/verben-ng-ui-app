import { Directive, Input, TemplateRef, ViewChild } from '@angular/core';

@Directive({
  selector: '[libColumn]',
})
export class ColumnDirective {
  @Input('libColumn') columnId!: string;

  @ViewChild('cell') cellTemplate?: TemplateRef<any>;
  @ViewChild('header') headerTemplate?: TemplateRef<any>;
  @ViewChild('footer') footerTemplate?: TemplateRef<any>;
}
