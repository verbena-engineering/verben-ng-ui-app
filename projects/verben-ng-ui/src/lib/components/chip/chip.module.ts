import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [],
  imports: [ChipComponent],
  exports: [ChipComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipComponent),
      multi: true,
    },
  ],
})
export class ChipModule {}
