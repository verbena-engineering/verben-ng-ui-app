import { forwardRef, NgModule } from '@angular/core';
import { TemplateDirective } from './TemplateDirective.directive';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [TemplateDirective],
  imports: [OverlayModule],
  exports: [TemplateDirective, OverlayModule],
})
export class SharedModule {}
