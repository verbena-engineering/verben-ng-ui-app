import { forwardRef, NgModule } from '@angular/core';
import { TemplateDirective } from './TemplateDirective.directive';

@NgModule({
  declarations: [TemplateDirective],
  imports: [],
  exports: [TemplateDirective],
})
export class SharedModule {}
