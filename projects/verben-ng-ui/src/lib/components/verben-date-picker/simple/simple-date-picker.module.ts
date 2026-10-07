import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { VerbenDatePickerModule } from '../verben-date-picker.module';
import { VerbenSimpleDatePickerComponent } from './simple-date-picker.component';

/**
 * The alternative "simple" design, in its own module so it can be kept or
 * dropped without touching VerbenDatePickerModule. It reuses that module's
 * calendar grid.
 */
@NgModule({
  declarations: [VerbenSimpleDatePickerComponent],
  imports: [CommonModule, OverlayModule, VerbenDatePickerModule],
  exports: [VerbenSimpleDatePickerComponent],
})
export class VerbenSimpleDatePickerModule {}
