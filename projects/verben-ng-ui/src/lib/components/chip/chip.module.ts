import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule } from 'verben-ng-ui/src/lib/components/shared';

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
