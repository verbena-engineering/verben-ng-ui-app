import { forwardRef, NgModule } from '@angular/core';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';
import { VerbenaInputComponent } from './verbena-input.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';

@NgModule({
  declarations: [VerbenaInputComponent],
  imports: [CommonModule, FormsModule, TooltipModule, SvgModule],
  exports: [VerbenaInputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerbenaInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VerbenaInputComponent),
      multi: true,
    },
  ],
})
export class VerbenaInputModule {}
