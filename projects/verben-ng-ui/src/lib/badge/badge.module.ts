import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaBadgeDirective } from './badge.directive';

@NgModule({
  declarations: [VerbenaBadgeDirective],
  imports: [CommonModule],
  exports: [VerbenaBadgeDirective]
})
export class VerbenaBadgeModule {}
